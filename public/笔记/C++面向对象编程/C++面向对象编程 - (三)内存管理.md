# C++面向对象编程 - (三)内存管理

理解C++的内存管理机制和RAII原则。

---

## 3.1 new/delete操作符

```cpp
// 动态分配单个对象
int* p = new int(10);
delete p;

// 动态分配数组
int* arr = new int[10];
delete[] arr;  // 注意：数组要用delete[]

// 动态分配对象
Person* person = new Person("Alice", 25);
delete person;
```

**常见错误**：

```cpp
// ❌ 内存泄漏
void leak() {
    int* p = new int(10);
    // 忘记delete，内存泄漏
}

// ❌ 重复释放
int* p = new int(10);
delete p;
delete p;  // 未定义行为

// ❌ 野指针
int* p = new int(10);
delete p;
*p = 20;  // p已是野指针
```

**Java对比**：
```java
// Java自动垃圾回收
Person person = new Person("Alice", 25);
// 不需要手动delete，GC会自动回收
```

### 3.2 RAII原则

**资源获取即初始化（Resource Acquisition Is Initialization）**：

```cpp
class FileHandler {
private:
    FILE* file;

public:
    FileHandler(const char* filename) {
        file = fopen(filename, "r");
        if (!file) throw std::runtime_error("Failed to open file");
    }
    
    ~FileHandler() {
        if (file) {
            fclose(file);
            std::cout << "File closed\n";
        }
    }
    
    // 禁止拷贝
    FileHandler(const FileHandler&) = delete;
    FileHandler& operator=(const FileHandler&) = delete;
};

// 使用
void processFile() {
    FileHandler fh("data.txt");
    // 处理文件...
    // 函数结束时自动调用析构函数，关闭文件
}
```

### 3.3 智能指针（C++11）

**unique_ptr（独占所有权）**：

```cpp
#include <memory>

std::unique_ptr<int> p1(new int(10));
// 或使用make_unique（C++14）
auto p2 = std::make_unique<int>(20);

// ❌ 不能拷贝
// std::unique_ptr<int> p3 = p1;  // 编译错误

// ✅ 可以移动
std::unique_ptr<int> p3 = std::move(p1);  // p1变为nullptr
```

**shared_ptr（共享所有权）**：

```cpp
std::shared_ptr<int> p1 = std::make_shared<int>(10);
std::shared_ptr<int> p2 = p1;  // 引用计数+1

std::cout << p1.use_count();  // 2
p1.reset();  // p1释放，引用计数-1
std::cout << p2.use_count();  // 1
// p2超出作用域时，引用计数归0，自动释放
```

**weak_ptr（弱引用，解决循环引用）**：

```cpp
class Node {
public:
    std::shared_ptr<Node> next;
    std::weak_ptr<Node> prev;  // 使用weak_ptr避免循环引用
};

auto n1 = std::make_shared<Node>();
auto n2 = std::make_shared<Node>();
n1->next = n2;
n2->prev = n1;  // weak_ptr不增加引用计数
```

**Java对比**：
```java
// Java所有对象引用类似shared_ptr
Person p1 = new Person("Alice", 25);
Person p2 = p1;  // 引用同一对象
// GC自动管理，无需手动释放
```

---

**本章完**
