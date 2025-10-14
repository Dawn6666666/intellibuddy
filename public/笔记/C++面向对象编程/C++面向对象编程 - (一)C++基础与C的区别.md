# C++面向对象编程 - (一)C++基础与C的区别

学习C++相对于C语言的增强特性和新语法。

---

# C++面向对象编程

> 💡 **课程信息**
> - 学习时长：180小时
> - 难度等级：⭐⭐⭐⭐ (高)
> - 前置课程：C语言编程导论
> - 相关课程：Java面向对象编程

---

## 📚 课程概述

### C++ vs Java

作为两门主流的面向对象编程语言，C++和Java各有特色：

| 特性 | C++ | Java |
|------|-----|------|
| **内存管理** | 手动/智能指针 | 自动垃圾回收 |
| **多继承** | 支持 | 仅支持接口多实现 |
| **编译方式** | 编译为机器码 | 编译为字节码 |
| **性能** | 更快（接近C） | 较快（JIT优化） |
| **应用场景** | 系统编程、游戏引擎 | 企业应用、Android |
| **泛型** | 模板（编译期） | 泛型（类型擦除） |

### 学习路线

```
C++基础特性
    ↓
类与对象
    ↓
内存管理与RAII
    ↓
继承与多态
    ↓
模板编程
    ↓
现代C++特性(C++11/14/17)
```

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

---

**本章完**
