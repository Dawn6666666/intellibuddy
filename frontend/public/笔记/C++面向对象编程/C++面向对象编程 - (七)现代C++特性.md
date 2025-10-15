# C++面向对象编程 - (七)现代C++特性

掌握C++11及以后的现代特性。

---

## 7. 现代C++特性

### 7.1 Lambda表达式（C++11）

```cpp
// 基本语法：[捕获列表](参数列表) -> 返回类型 { 函数体 }

// 无捕获
auto add = [](int a, int b) { return a + b; };
std::cout << add(3, 5);  // 8

// 值捕获
int x = 10;
auto func1 = [x]() { return x * 2; };  // 捕获x的副本

// 引用捕获
auto func2 = [&x]() { x += 5; };  // 捕获x的引用

// 捕获所有
auto func3 = [=]() { return x + y; };  // 值捕获所有变量
auto func4 = [&]() { x++; y++; };      // 引用捕获所有变量

// 配合STL
std::vector<int> vec{1, 2, 3, 4, 5};
auto it = std::find_if(vec.begin(), vec.end(), [](int x) { return x > 3; });
```

**Java对比**：
```java
// Java 8 Lambda表达式
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);
list.forEach(x -> System.out.println(x));

// 方法引用
list.forEach(System.out::println);
```

### 7.2 移动语义（C++11）

**右值引用**：

```cpp
void process(std::string&& str) {  // 右值引用参数
    std::cout << "Rvalue: " << str << std::endl;
}

process("Hello");  // ✅ 可以绑定到临时对象
std::string s = "World";
process(s);        // ❌ 错误：不能绑定到左值
process(std::move(s));  // ✅ std::move将左值转为右值
```

**移动构造函数**：

```cpp
class MyString {
private:
    char* data;
    size_t length;

public:
    // 移动构造函数
    MyString(MyString&& other) noexcept 
        : data(other.data), length(other.length) {
        other.data = nullptr;  // 转移所有权
        other.length = 0;
        std::cout << "Move constructor\n";
    }
    
    // 移动赋值运算符
    MyString& operator=(MyString&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            length = other.length;
            other.data = nullptr;
            other.length = 0;
        }
        return *this;
    }
};
```

### 7.3 变参模板（C++11）

```cpp
// 递归展开
template <typename T>
void print(T value) {
    std::cout << value << std::endl;
}

template <typename T, typename... Args>
void print(T first, Args... args) {
    std::cout << first << " ";
    print(args...);  // 递归调用
}

// 使用
print(1, 2.5, "Hello", 'A');  // 输出: 1 2.5 Hello A
```

**折叠表达式（C++17）**：

```cpp
template <typename... Args>
auto sum(Args... args) {
    return (args + ...);  // 折叠表达式
}

std::cout << sum(1, 2, 3, 4, 5);  // 15
```

---

## 📚 学习建议

### C++ vs Java选择

**选择C++的理由：**
- 需要极致性能（游戏、高频交易）
- 系统级编程（操作系统、驱动）
- 嵌入式开发
- 对内存控制要求高

**选择Java的理由：**
- 企业级应用（Spring、微服务）
- Android开发
- 快速开发迭代
- 跨平台性要求高

### 学习路径

1. **扎实C基础** → 理解指针、内存
2. **掌握类与对象** → OOP思想
3. **深入内存管理** → 智能指针、RAII
4. **熟练STL** → 提高开发效率
5. **学习现代C++** → C++11/14/17新特性

### 推荐资源

📖 **书籍：**
- 《C++ Primer》（入门经典）
- 《Effective C++》（进阶必读）
- 《C++并发编程实战》

🎥 **视频：**
- CppCon演讲（YouTube）
- 侯捷C++系列课程

💻 **练习：**
- LeetCode C++刷题
- 实现STL容器
- 开源项目贡献

---

**本章完**
