# C++面向对象编程 - (九)实战项目

通过实战项目巩固C++编程技能。

---

## 9.1 Lambda表达式

```cpp
#include <vector>
#include <algorithm>
#include <functional>

void lambda_demo() {
    // 基本lambda
    auto add = [](int a, int b) { return a + b; };
    std::cout << add(3, 5) << std::endl;  // 8
    
    // 捕获变量
    int x = 10;
    
    // [=] 值捕获所有变量
    auto lambda1 = [=]() { return x + 1; };
    
    // [&] 引用捕获所有变量
    auto lambda2 = [&]() { x++; };
    
    // [x] 值捕获特定变量
    auto lambda3 = [x]() { return x * 2; };
    
    // [&x] 引用捕获特定变量
    auto lambda4 = [&x]() { x += 5; };
    
    // [this] 捕获当前对象指针
    // [=, &y] 值捕获所有，但y用引用
    
    // 实际应用：排序
    std::vector<int> nums{5, 2, 8, 1, 9};
    std::sort(nums.begin(), nums.end(),
        [](int a, int b) { return a > b; });  // 降序
    
    // 过滤
    std::vector<int> result;
    std::copy_if(nums.begin(), nums.end(), std::back_inserter(result),
        [](int x) { return x > 5; });
    
    // 泛型lambda（C++14）
    auto print = [](const auto& x) { std::cout << x << " "; };
    print(42);
    print("Hello");
    print(3.14);
    
    // 初始化捕获（C++14）
    auto lambda5 = [ptr = std::make_unique<int>(10)]() {
        return *ptr;
    };
}
```

## 9.2 智能指针详解

```cpp
#include <memory>
#include <vector>

class Resource {
public:
    Resource(int id) : id_(id) {
        std::cout << "Resource " << id_ << " created\n";
    }
    ~Resource() {
        std::cout << "Resource " << id_ << " destroyed\n";
    }
    void use() { std::cout << "Using resource " << id_ << "\n"; }
private:
    int id_;
};

void smart_ptr_demo() {
    // unique_ptr - 独占所有权
    {
        std::unique_ptr<Resource> ptr1(new Resource(1));
        // 或使用make_unique（C++14，推荐）
        auto ptr2 = std::make_unique<Resource>(2);
        
        ptr2->use();
        
        // 转移所有权
        std::unique_ptr<Resource> ptr3 = std::move(ptr2);
        // ptr2现在为nullptr
        
        // unique_ptr不能拷贝
        // std::unique_ptr<Resource> ptr4 = ptr3;  // 错误
    }  // ptr3离开作用域，Resource自动销毁
    
    // shared_ptr - 共享所有权，引用计数
    {
        std::shared_ptr<Resource> sp1 = std::make_shared<Resource>(3);
        std::cout << "Count: " << sp1.use_count() << "\n";  // 1
        
        {
            std::shared_ptr<Resource> sp2 = sp1;  // 引用计数+1
            std::cout << "Count: " << sp1.use_count() << "\n";  // 2
        }  // sp2销毁，引用计数-1
        
        std::cout << "Count: " << sp1.use_count() << "\n";  // 1
    }  // sp1销毁，引用计数归0，Resource销毁
    
    // weak_ptr - 弱引用，不增加引用计数
    std::shared_ptr<Resource> sp = std::make_shared<Resource>(4);
    std::weak_ptr<Resource> wp = sp;
    
    std::cout << "Count: " << sp.use_count() << "\n";  // 1（weak_ptr不增加计数）
    
    // 使用weak_ptr
    if (auto locked = wp.lock()) {  // 尝试获取shared_ptr
        locked->use();
    } else {
        std::cout << "Resource已销毁\n";
    }
    
    // 实际应用：管理动态数组
    std::shared_ptr<int[]> arr(new int[10]);
    // 或使用make_shared（C++20）
    
    // 自定义删除器
    auto deleter = [](Resource* p) {
        std::cout << "Custom deleter\n";
        delete p;
    };
    std::unique_ptr<Resource, decltype(deleter)> ptr(new Resource(5), deleter);
}
```

## 9.3 移动语义与右值引用

```cpp
#include <vector>
#include <string>
#include <utility>

class BigData {
public:
    BigData(size_t size) : size_(size) {
        data_ = new int[size];
        std::cout << "Construct: allocate " << size << " ints\n";
    }
    
    // 拷贝构造
    BigData(const BigData& other) : size_(other.size_) {
        data_ = new int[size_];
        std::copy(other.data_, other.data_ + size_, data_);
        std::cout << "Copy construct: allocate " << size_ << " ints\n";
    }
    
    // 移动构造（C++11）
    BigData(BigData&& other) noexcept : size_(other.size_), data_(other.data_) {
        other.data_ = nullptr;
        other.size_ = 0;
        std::cout << "Move construct: steal resource\n";
    }
    
    // 拷贝赋值
    BigData& operator=(const BigData& other) {
        if (this != &other) {
            delete[] data_;
            size_ = other.size_;
            data_ = new int[size_];
            std::copy(other.data_, other.data_ + size_, data_);
            std::cout << "Copy assignment\n";
        }
        return *this;
    }
    
    // 移动赋值（C++11）
    BigData& operator=(BigData&& other) noexcept {
        if (this != &other) {
            delete[] data_;
            data_ = other.data_;
            size_ = other.size_;
            other.data_ = nullptr;
            other.size_ = 0;
            std::cout << "Move assignment\n";
        }
        return *this;
    }
    
    ~BigData() {
        delete[] data_;
        if (size_ > 0) {
            std::cout << "Destruct: free memory\n";
        }
    }

private:
    int* data_;
    size_t size_;
};

void move_semantics_demo() {
    BigData obj1(1000);
    
    // 拷贝（昂贵）
    BigData obj2 = obj1;
    
    // 移动（高效）
    BigData obj3 = std::move(obj1);  // obj1变为空
    
    // vector的移动优化
    std::vector<BigData> vec;
    vec.push_back(BigData(100));  // 临时对象，自动移动
    
    BigData obj4(200);
    vec.push_back(std::move(obj4));  // 显式移动
    
    // 完美转发
    auto make_big_data = [](auto&&... args) {
        return std::make_unique<BigData>(std::forward<decltype(args)>(args)...);
    };
}
```

## 9.4 类型推导与auto

```cpp
#include <vector>
#include <map>
#include <typeinfo>

void auto_demo() {
    // auto类型推导
    auto x = 42;              // int
    auto y = 3.14;            // double
    auto s = "Hello";         // const char*
    auto str = std::string("World");  // std::string
    
    // 容器迭代器
    std::vector<int> vec{1, 2, 3, 4, 5};
    
    // 传统写法
    std::vector<int>::iterator it1 = vec.begin();
    
    // auto简化
    auto it2 = vec.begin();
    
    // map遍历
    std::map<std::string, int> scores{{"Alice", 95}, {"Bob", 88}};
    
    // 传统写法
    for (std::map<std::string, int>::const_iterator it = scores.begin();
         it != scores.end(); ++it) {
        std::cout << it->first << ": " << it->second << "\n";
    }
    
    // auto简化
    for (auto it = scores.begin(); it != scores.end(); ++it) {
        std::cout << it->first << ": " << it->second << "\n";
    }
    
    // 结构化绑定（C++17）
    for (const auto& [name, score] : scores) {
        std::cout << name << ": " << score << "\n";
    }
    
    // decltype - 获取类型
    int a = 10;
    decltype(a) b = 20;  // b的类型与a相同
    
    // 函数返回类型推导（C++14）
    auto add = [](int a, int b) { return a + b; };  // 返回类型自动推导为int
    
    // 尾置返回类型
    auto multiply = [](int a, int b) -> int { return a * b; };
}
```

## 9.5 变长参数模板

```cpp
#include <iostream>
#include <sstream>

// 递归基础情况
void print() {
    std::cout << "\n";
}

// 变长参数模板
template <typename T, typename... Args>
void print(T first, Args... rest) {
    std::cout << first << " ";
    print(rest...);  // 递归调用
}

// 折叠表达式（C++17）
template <typename... Args>
auto sum(Args... args) {
    return (args + ...);
}

template <typename... Args>
auto multiply(Args... args) {
    return (args * ...);
}

// 实际应用：类型安全的printf
template <typename... Args>
std::string format(const std::string& fmt, Args... args) {
    std::ostringstream oss;
    // 实现省略...
    return oss.str();
}

// 完美转发
template <typename T, typename... Args>
std::unique_ptr<T> make_unique_cpp11(Args&&... args) {
    return std::unique_ptr<T>(new T(std::forward<Args>(args)...));
}

void variadic_demo() {
    print(1, 2.5, "Hello", 'A');  // 输出: 1 2.5 Hello A
    
    std::cout << sum(1, 2, 3, 4, 5) << "\n";  // 15
    std::cout << multiply(2, 3, 4) << "\n";   // 24
}
```

---

## 9.6 实战项目

### 智能图书管理系统

```cpp
#include <iostream>
#include <vector>
#include <map>
#include <memory>
#include <algorithm>
#include <iomanip>

class Book {
public:
    Book(int id, std::string title, std::string author, int year)
        : id_(id), title_(std::move(title)), author_(std::move(author)), 
          year_(year), borrowed_(false) {}
    
    int getId() const { return id_; }
    const std::string& getTitle() const { return title_; }
    const std::string& getAuthor() const { return author_; }
    int getYear() const { return year_; }
    bool isBorrowed() const { return borrowed_; }
    
    void borrow() { borrowed_ = true; }
    void returnBook() { borrowed_ = false; }
    
    friend std::ostream& operator<<(std::ostream& os, const Book& book) {
        os << std::setw(5) << book.id_ 
           << std::setw(30) << book.title_
           << std::setw(20) << book.author_
           << std::setw(6) << book.year_
           << std::setw(10) << (book.borrowed_ ? "已借出" : "可借阅");
        return os;
    }

private:
    int id_;
    std::string title_;
    std::string author_;
    int year_;
    bool borrowed_;
};

class Library {
public:
    void addBook(std::shared_ptr<Book> book) {
        books_[book->getId()] = book;
        std::cout << "成功添加图书: " << book->getTitle() << "\n";
    }
    
    bool borrowBook(int id) {
        auto it = books_.find(id);
        if (it == books_.end()) {
            std::cout << "图书不存在！\n";
            return false;
        }
        
        if (it->second->isBorrowed()) {
            std::cout << "图书已被借出！\n";
            return false;
        }
        
        it->second->borrow();
        std::cout << "借阅成功: " << it->second->getTitle() << "\n";
        return true;
    }
    
    bool returnBook(int id) {
        auto it = books_.find(id);
        if (it == books_.end()) {
            std::cout << "图书不存在！\n";
            return false;
        }
        
        if (!it->second->isBorrowed()) {
            std::cout << "图书未被借出！\n";
            return false;
        }
        
        it->second->returnBook();
        std::cout << "归还成功: " << it->second->getTitle() << "\n";
        return true;
    }
    
    void searchByTitle(const std::string& keyword) const {
        std::cout << "\n搜索结果:\n";
        printHeader();
        
        bool found = false;
        for (const auto& [id, book] : books_) {
            if (book->getTitle().find(keyword) != std::string::npos) {
                std::cout << *book << "\n";
                found = true;
            }
        }
        
        if (!found) {
            std::cout << "未找到匹配的图书！\n";
        }
    }
    
    void searchByAuthor(const std::string& author) const {
        std::cout << "\n作者 \"" << author << "\" 的图书:\n";
        printHeader();
        
        bool found = false;
        for (const auto& [id, book] : books_) {
            if (book->getAuthor() == author) {
                std::cout << *book << "\n";
                found = true;
            }
        }
        
        if (!found) {
            std::cout << "未找到该作者的图书！\n";
        }
    }
    
    void displayAll() const {
        std::cout << "\n所有图书:\n";
        printHeader();
        for (const auto& [id, book] : books_) {
            std::cout << *book << "\n";
        }
    }
    
    void displayAvailable() const {
        std::cout << "\n可借阅图书:\n";
        printHeader();
        for (const auto& [id, book] : books_) {
            if (!book->isBorrowed()) {
                std::cout << *book << "\n";
            }
        }
    }

private:
    std::map<int, std::shared_ptr<Book>> books_;
    
    void printHeader() const {
        std::cout << std::setw(5) << "ID"
                  << std::setw(30) << "书名"
                  << std::setw(20) << "作者"
                  << std::setw(6) << "年份"
                  << std::setw(10) << "状态" << "\n";
        std::cout << std::string(71, '-') << "\n";
    }
};

// 使用示例
void library_demo() {
    Library lib;
    
    // 添加图书
    lib.addBook(std::make_shared<Book>(1, "C++ Primer", "Stanley Lippman", 2012));
    lib.addBook(std::make_shared<Book>(2, "Effective C++", "Scott Meyers", 2005));
    lib.addBook(std::make_shared<Book>(3, "The C++ Programming Language", "Bjarne Stroustrup", 2013));
    
    // 显示所有图书
    lib.displayAll();
    
    // 借阅图书
    lib.borrowBook(1);
    
    // 显示可借阅图书
    lib.displayAvailable();
    
    // 搜索
    lib.searchByAuthor("Scott Meyers");
    
    // 归还图书
    lib.returnBook(1);
}
```

### 学生成绩管理系统（OOP版）

```cpp
#include <iostream>
#include <vector>
#include <map>
#include <numeric>
#include <algorithm>
#include <fstream>

class Student {
public:
    Student(int id, std::string name) 
        : id_(id), name_(std::move(name)) {}
    
    int getId() const { return id_; }
    const std::string& getName() const { return name_; }
    
    void addScore(const std::string& subject, double score) {
        scores_[subject] = score;
    }
    
    double getScore(const std::string& subject) const {
        auto it = scores_.find(subject);
        return it != scores_.end() ? it->second : 0.0;
    }
    
    double getAverage() const {
        if (scores_.empty()) return 0.0;
        
        double sum = std::accumulate(scores_.begin(), scores_.end(), 0.0,
            [](double acc, const auto& pair) {
                return acc + pair.second;
            });
        return sum / scores_.size();
    }
    
    void displayScores() const {
        std::cout << "学生: " << name_ << " (ID: " << id_ << ")\n";
        std::cout << "科目成绩:\n";
        for (const auto& [subject, score] : scores_) {
            std::cout << "  " << subject << ": " << score << "\n";
        }
        std::cout << "平均分: " << getAverage() << "\n";
    }

private:
    int id_;
    std::string name_;
    std::map<std::string, double> scores_;
};

class GradeManager {
public:
    void addStudent(std::shared_ptr<Student> student) {
        students_[student->getId()] = student;
    }
    
    std::shared_ptr<Student> getStudent(int id) {
        auto it = students_.find(id);
        return it != students_.end() ? it->second : nullptr;
    }
    
    void addScore(int studentId, const std::string& subject, double score) {
        auto student = getStudent(studentId);
        if (student) {
            student->addScore(subject, score);
            std::cout << "成绩添加成功！\n";
        } else {
            std::cout << "学生不存在！\n";
        }
    }
    
    void displayStudentScores(int id) const {
        auto it = students_.find(id);
        if (it != students_.end()) {
            it->second->displayScores();
        } else {
            std::cout << "学生不存在！\n";
        }
    }
    
    void displayAllStudents() const {
        std::cout << "\n所有学生成绩:\n";
        std::cout << std::string(50, '=') << "\n";
        for (const auto& [id, student] : students_) {
            student->displayScores();
            std::cout << std::string(50, '-') << "\n";
        }
    }
    
    void displayRanking(const std::string& subject) const {
        std::vector<std::pair<std::string, double>> rankings;
        
        for (const auto& [id, student] : students_) {
            rankings.emplace_back(student->getName(), student->getScore(subject));
        }
        
        std::sort(rankings.begin(), rankings.end(),
            [](const auto& a, const auto& b) {
                return a.second > b.second;
            });
        
        std::cout << "\n" << subject << " 排名:\n";
        int rank = 1;
        for (const auto& [name, score] : rankings) {
            std::cout << rank++ << ". " << name << ": " << score << "\n";
        }
    }

private:
    std::map<int, std::shared_ptr<Student>> students_;
};

// 使用示例
void grade_manager_demo() {
    GradeManager manager;
    
    // 添加学生
    auto alice = std::make_shared<Student>(1, "Alice");
    auto bob = std::make_shared<Student>(2, "Bob");
    auto charlie = std::make_shared<Student>(3, "Charlie");
    
    manager.addStudent(alice);
    manager.addStudent(bob);
    manager.addStudent(charlie);
    
    // 添加成绩
    manager.addScore(1, "数学", 95);
    manager.addScore(1, "英语", 88);
    manager.addScore(1, "C++", 92);
    
    manager.addScore(2, "数学", 88);
    manager.addScore(2, "英语", 90);
    manager.addScore(2, "C++", 95);
    
    manager.addScore(3, "数学", 78);
    manager.addScore(3, "英语", 85);
    manager.addScore(3, "C++", 80);
    
    // 显示成绩
    manager.displayAllStudents();
    
    // 显示排名
    manager.displayRanking("数学");
    manager.displayRanking("C++");
}
```

---

**本章完**

