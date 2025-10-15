# C++面向对象编程 - (一)C++基础与C的区别

学习C++相对于C语言的增强特性和新语法。

---

## 1. C++基础与C的区别

### 1.1 命名空间（Namespace）

**解决问题**：避免命名冲突

```cpp
// 定义命名空间
namespace MyLib {
    int value = 100;
    void print() {
        std::cout << "Hello from MyLib\n";
    }
}

// 使用命名空间
MyLib::print();  // 方式1：使用::访问
using MyLib::value;  // 方式2：引入特定成员
using namespace MyLib;  // 方式3：引入整个命名空间（不推荐）
```

**Java对比**：
```java
// Java使用package
package com.mylib;
public class MyClass {
    public static final int VALUE = 100;
}

// 使用
import com.mylib.MyClass;
```

### 1.2 引用类型（Reference）

**定义**：变量的别名

```cpp
int x = 10;
int& ref = x;  // ref是x的引用
ref = 20;      // 修改ref就是修改x
std::cout << x;  // 输出: 20
```

**与指针的区别**：

| 特性 | 引用 | 指针 |
|------|------|------|
| 空值 | 不可为空 | 可以为nullptr |
| 重新赋值 | 不可 | 可以 |
| 语法 | 透明（像普通变量） | 需要解引用 |

```cpp
// 引用作为函数参数（避免拷贝）
void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 5, y = 10;
    swap(x, y);  // 直接传递变量，不需要&取地址
    std::cout << x << " " << y;  // 10 5
}
```

**Java对比**：
```java
// Java对象传递是引用传递
public void swap(int[] a, int[] b) {
    // 但基本类型是值传递，无法直接swap两个int
}
```

### 1.3 函数重载（Overloading）

**同名函数，不同参数**：

```cpp
int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {
    return a + b;
}

int add(int a, int b, int c) {
    return a + b + c;
}

// 调用
add(1, 2);        // 调用第一个
add(1.5, 2.3);    // 调用第二个
add(1, 2, 3);     // 调用第三个
```

**Java对比**：Java也支持重载，语法完全一致。

### 1.4 默认参数

```cpp
void printInfo(std::string name, int age = 18, std::string city = "Beijing") {
    std::cout << name << ", " << age << ", " << city << std::endl;
}

// 调用
printInfo("Alice");              // Alice, 18, Beijing
printInfo("Bob", 25);            // Bob, 25, Beijing
printInfo("Charlie", 30, "Shanghai");  // Charlie, 30, Shanghai
```

**注意**：默认参数必须从右往左

```cpp
// ❌ 错误
void func(int a = 1, int b);  

// ✅ 正确
void func(int a, int b = 1);
```

**Java对比**：Java不支持默认参数，需要重载实现。

### 1.5 auto类型推导（C++11）

```cpp
auto x = 10;         // int
auto y = 3.14;       // double
auto s = "Hello";    // const char*
auto v = std::vector<int>{1, 2, 3};  // std::vector<int>

// 常用于迭代器
std::vector<int> vec{1, 2, 3};
for (auto it = vec.begin(); it != vec.end(); ++it) {
    std::cout << *it << " ";
}

// 更简洁：范围for循环
for (auto val : vec) {
    std::cout << val << " ";
}
```

### 1.6 输入输出流（iostream）

**C++流式输入输出**：

```cpp
#include <iostream>
#include <iomanip>
#include <fstream>
#include <sstream>

void io_demo() {
    // 标准输出
    std::cout << "Hello, C++!" << std::endl;
    
    // 格式化输出
    int num = 42;
    double pi = 3.14159;
    
    std::cout << std::setw(10) << num << std::endl;        // 宽度10
    std::cout << std::fixed << std::setprecision(2) << pi << std::endl;  // 保留2位小数
    std::cout << std::hex << num << std::endl;             // 16进制
    
    // 标准输入
    int age;
    std::string name;
    std::cout << "Enter your age: ";
    std::cin >> age;
    std::cout << "Enter your name: ";
    std::cin.ignore();  // 清除缓冲区
    std::getline(std::cin, name);
    
    // 文件输入输出
    std::ofstream outFile("data.txt");
    outFile << "Hello, File!" << std::endl;
    outFile << num << " " << pi << std::endl;
    outFile.close();
    
    std::ifstream inFile("data.txt");
    std::string line;
    while (std::getline(inFile, line)) {
        std::cout << line << std::endl;
    }
    inFile.close();
    
    // 字符串流
    std::stringstream ss;
    ss << "Value: " << 123;
    std::string result = ss.str();
    
    // 从字符串流读取
    std::stringstream ss2("100 200 300");
    int a, b, c;
    ss2 >> a >> b >> c;
}
```

**Java对比**：

```java
// Java输入输出
System.out.println("Hello, Java!");

Scanner scanner = new Scanner(System.in);
int age = scanner.nextInt();
String name = scanner.nextLine();
```

### 1.7 const关键字深入

```cpp
// const变量
const int MAX_SIZE = 100;
// MAX_SIZE = 200;  // 错误：不能修改

// const指针
int x = 10;
const int* p1 = &x;      // 指向常量的指针，不能通过p1修改x
// *p1 = 20;             // 错误
p1 = &y;                 // 正确：可以改变指向

int* const p2 = &x;      // 常量指针，不能改变指向
*p2 = 20;                // 正确：可以修改x
// p2 = &y;              // 错误

const int* const p3 = &x;  // 常量指针指向常量
// *p3 = 20;             // 错误
// p3 = &y;              // 错误

// const成员函数
class Circle {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    
    // const成员函数：不修改成员变量
    double getRadius() const {
        return radius;
    }
    
    double getArea() const {
        return 3.14159 * radius * radius;
    }
    
    // 非const成员函数
    void setRadius(double r) {
        radius = r;
    }
};

const Circle c(5.0);
c.getRadius();  // 正确：const对象可以调用const成员函数
// c.setRadius(10);  // 错误：const对象不能调用非const成员函数
```

### 1.8 内联函数（inline）

**目的**：建议编译器将函数展开，避免函数调用开销

```cpp
// C语言使用宏
#define SQUARE(x) ((x) * (x))  // 容易出错

// C++内联函数
inline int square(int x) {
    return x * x;
}

// 类内定义的成员函数自动为内联
class Point {
private:
    int x, y;
public:
    // 自动内联
    int getX() const { return x; }
    int getY() const { return y; }
    
    void setX(int val) { x = val; }
};

// 何时使用内联
// ✅ 适合：简短函数（1-3行）
// ✅ 适合：频繁调用的小函数
// ❌ 不适合：复杂函数、递归函数
```

**注意**：`inline`只是建议，编译器可能不采纳。

### 1.9 nullptr（C++11）

**C++11之前的问题**：

```cpp
void func(int x) { std::cout << "int版本\n"; }
void func(int* p) { std::cout << "指针版本\n"; }

func(0);      // 调用int版本（歧义）
func(NULL);   // 可能调用int版本（NULL通常定义为0）
```

**C++11解决方案**：

```cpp
func(nullptr);  // 明确调用指针版本

// nullptr的优势
int* p1 = nullptr;     // 清晰
int* p2 = NULL;        // 旧式
int* p3 = 0;           // 不推荐

// nullptr是关键字，类型安全
if (p1 == nullptr) {
    std::cout << "空指针\n";
}
```

### 1.10 强制类型转换

**C风格转换（不推荐）**：

```cpp
double pi = 3.14;
int x = (int)pi;  // C风格
```

**C++风格转换（推荐）**：

```cpp
// static_cast：编译时类型转换
double d = 3.14;
int i = static_cast<int>(d);  // 3

// const_cast：移除const属性
const int* cp = &i;
int* p = const_cast<int*>(cp);
*p = 100;  // 修改原本const的变量（危险）

// dynamic_cast：运行时类型检查（用于多态）
class Base {
    virtual void func() {}
};
class Derived : public Base {};

Base* b = new Derived();
Derived* d = dynamic_cast<Derived*>(b);  // 安全的向下转型
if (d != nullptr) {
    std::cout << "转换成功\n";
}

// reinterpret_cast：底层位模式转换（危险）
int n = 42;
int* pn = &n;
char* pc = reinterpret_cast<char*>(pn);  // 将int*视为char*
```

**对比总结**：

| 转换类型 | 用途 | 安全性 |
|---------|------|--------|
| `static_cast` | 基本类型、类层次向上转型 | 较安全 |
| `const_cast` | 移除/添加const | 危险 |
| `dynamic_cast` | 多态类型转换，带运行时检查 | 安全 |
| `reinterpret_cast` | 底层位重新解释 | 非常危险 |

### 1.11 C++与C的语法差异

```cpp
// 1. 变量声明位置
void func() {
    // C++：可以在任何地方声明
    int a = 10;
    std::cout << a << std::endl;
    
    int b = 20;  // C语言要求所有变量在函数开头声明
    std::cout << b << std::endl;
}

// 2. for循环中声明变量
for (int i = 0; i < 10; i++) {  // C++允许
    std::cout << i << " ";
}

// 3. struct不需要typedef
struct Point {
    int x, y;
};
Point p1;  // C++直接使用，C语言需要struct Point p1;

// 4. bool类型
bool flag = true;  // C++内置，C语言需要#include <stdbool.h>

// 5. 函数原型
void foo();  // C++表示无参数
void foo(void);  // C语言需要明确void

// 6. 枚举类型（C++11强类型枚举）
enum class Color { RED, GREEN, BLUE };
Color c = Color::RED;  // 必须带作用域

// 传统枚举
enum OldColor { RED, GREEN, BLUE };
OldColor oc = RED;  // 可以直接使用
```

---

**本章完**
