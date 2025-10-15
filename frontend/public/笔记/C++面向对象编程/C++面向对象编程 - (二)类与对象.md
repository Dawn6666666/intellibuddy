# C++面向对象编程 - (二)类与对象

掌握C++中类和对象的定义与使用。

---

## 2. 类与对象

### 2.1 类的定义（.h和.cpp分离）

**头文件（Person.h）**：
```cpp
#ifndef PERSON_H
#define PERSON_H

#include <string>

class Person {
private:
    std::string name;
    int age;

public:
    // 构造函数
    Person(std::string n, int a);
    
    // 成员函数声明
    void display() const;
    int getAge() const;
    void setAge(int a);
};

#endif
```

**实现文件（Person.cpp）**：
```cpp
#include "Person.h"
#include <iostream>

Person::Person(std::string n, int a) : name(n), age(a) {
    // 初始化列表（推荐）
}

void Person::display() const {
    std::cout << "Name: " << name << ", Age: " << age << std::endl;
}

int Person::getAge() const {
    return age;
}

void Person::setAge(int a) {
    if (a > 0) age = a;
}
```

**Java对比**：
```java
// Java一个文件包含声明和实现
public class Person {
    private String name;
    private int age;
    
    public Person(String n, int a) {
        this.name = n;
        this.age = a;
    }
    
    public void display() {
        System.out.println("Name: " + name + ", Age: " + age);
    }
}
```

### 2.2 构造函数与析构函数

**构造函数**：

```cpp
class MyClass {
private:
    int* data;
    int size;

public:
    // 默认构造函数
    MyClass() : data(nullptr), size(0) {}
    
    // 带参数的构造函数
    MyClass(int s) : size(s) {
        data = new int[size];
    }
    
    // 析构函数（释放资源）
    ~MyClass() {
        delete[] data;
        std::cout << "Destructor called\n";
    }
};
```

**初始化列表 vs 赋值**：

```cpp
class Point {
private:
    const int x;  // const成员必须用初始化列表
    int& ref;     // 引用成员必须用初始化列表

public:
    // ✅ 正确：使用初始化列表
    Point(int a, int& r) : x(a), ref(r) {}
    
    // ❌ 错误：不能在构造函数体内赋值
    // Point(int a, int& r) { x = a; ref = r; }
};
```

**Java对比**：Java有构造函数，但没有析构函数（依赖GC）。

### 2.3 拷贝构造与赋值运算符

**拷贝构造函数**：

```cpp
class MyString {
private:
    char* data;
    int length;

public:
    // 拷贝构造函数
    MyString(const MyString& other) {
        length = other.length;
        data = new char[length + 1];
        strcpy(data, other.data);
        std::cout << "Copy constructor called\n";
    }
    
    // 赋值运算符重载
    MyString& operator=(const MyString& other) {
        if (this != &other) {  // 自赋值检查
            delete[] data;
            length = other.length;
            data = new char[length + 1];
            strcpy(data, other.data);
        }
        std::cout << "Assignment operator called\n";
        return *this;
    }
};
```

**三五法则（Rule of Three/Five）**：

如果需要自定义以下任一函数，通常需要定义全部：
1. 析构函数
2. 拷贝构造函数
3. 拷贝赋值运算符
4. 移动构造函数（C++11）
5. 移动赋值运算符（C++11）

### 2.4 静态成员

**静态成员变量**：

```cpp
class Counter {
private:
    static int count;  // 声明静态成员
    int id;

public:
    Counter() {
        id = ++count;
        std::cout << "Object " << id << " created\n";
    }
    
    ~Counter() {
        --count;
        std::cout << "Object " << id << " destroyed\n";
    }
    
    static int getCount() {  // 静态成员函数
        return count;
        // 注意：静态函数不能访问非静态成员
    }
    
    void display() {
        std::cout << "ID: " << id << ", Total: " << count << "\n";
    }
};

// 静态成员变量定义（必须在类外初始化）
int Counter::count = 0;

// 使用
Counter c1, c2, c3;
std::cout << "Total objects: " << Counter::getCount() << "\n";  // 3
```

**静态const成员**：

```cpp
class Config {
public:
    static const int MAX_SIZE = 100;  // 可以在类内初始化
    static const std::string NAME;    // 非整型需要类外定义
};

const std::string Config::NAME = "MyApp";
```

**Java对比**：

```java
// Java静态成员
public class Counter {
    private static int count = 0;
    private int id;
    
    public Counter() {
        id = ++count;
    }
    
    public static int getCount() {
        return count;
    }
}
```

### 2.5 友元（Friend）

**友元函数**：

```cpp
class Box {
private:
    double width;
    double height;

public:
    Box(double w, double h) : width(w), height(h) {}
    
    // 声明友元函数
    friend double getArea(const Box& b);
    friend class BoxPrinter;  // 友元类
};

// 友元函数可以访问私有成员
double getArea(const Box& b) {
    return b.width * b.height;
}

// 友元类
class BoxPrinter {
public:
    void print(const Box& b) {
        std::cout << "Width: " << b.width 
                  << ", Height: " << b.height << "\n";
    }
};

// 使用
Box box(10, 20);
std::cout << "Area: " << getArea(box) << "\n";

BoxPrinter printer;
printer.print(box);
```

**友元的使用场景**：
- 运算符重载（特别是 `<<` 和 `>>`）
- 需要访问多个类的私有成员
- 某些算法需要高效访问内部数据

**注意**：友元破坏封装性，应谨慎使用。

### 2.6 this指针

```cpp
class Student {
private:
    std::string name;
    int age;

public:
    Student(std::string name, int age) {
        // 使用this指针区分成员变量和参数
        this->name = name;
        this->age = age;
    }
    
    // 返回this指针实现链式调用
    Student& setName(std::string name) {
        this->name = name;
        return *this;
    }
    
    Student& setAge(int age) {
        this->age = age;
        return *this;
    }
    
    void display() const {
        std::cout << "Name: " << name << ", Age: " << age << "\n";
    }
    
    // 比较函数
    bool isOlderThan(const Student& other) const {
        return this->age > other.age;
    }
};

// 链式调用
Student s("Alice", 20);
s.setName("Bob").setAge(25).display();  // Name: Bob, Age: 25
```

### 2.7 对象组合与委托

**组合关系**：

```cpp
class Engine {
public:
    void start() { std::cout << "Engine started\n"; }
    void stop() { std::cout << "Engine stopped\n"; }
};

class Wheel {
private:
    double size;
public:
    Wheel(double s) : size(s) {}
    double getSize() const { return size; }
};

class Car {
private:
    Engine engine;              // 组合：Car拥有Engine
    std::vector<Wheel> wheels;  // 组合：Car拥有4个Wheel
    std::string brand;

public:
    Car(const std::string& b, double wheelSize) 
        : brand(b), wheels(4, Wheel(wheelSize)) {}
    
    void start() {
        std::cout << brand << " car starting...\n";
        engine.start();
    }
    
    void stop() {
        std::cout << brand << " car stopping...\n";
        engine.stop();
    }
    
    void displayInfo() {
        std::cout << "Brand: " << brand << "\n";
        std::cout << "Wheel size: " << wheels[0].getSize() << "\n";
    }
};

// 使用
Car myCar("Toyota", 17.0);
myCar.start();
myCar.displayInfo();
```

**Java对比**：

```java
// Java组合
public class Car {
    private Engine engine;  // 组合
    private String brand;
    
    public Car(String brand) {
        this.brand = brand;
        this.engine = new Engine();
    }
}
```

### 2.8 常量对象与mutable

```cpp
class Cache {
private:
    std::string data;
    mutable int accessCount;  // mutable：即使在const函数中也可修改

public:
    Cache(const std::string& d) : data(d), accessCount(0) {}
    
    // const成员函数
    std::string getData() const {
        ++accessCount;  // 合法：accessCount是mutable
        return data;
    }
    
    int getAccessCount() const {
        return accessCount;
    }
};

const Cache cache("Hello");
std::cout << cache.getData() << "\n";  // 调用const函数
std::cout << "Access count: " << cache.getAccessCount() << "\n";  // 1
```

### 2.9 explicit关键字

**防止隐式类型转换**：

```cpp
class MyInt {
private:
    int value;

public:
    // 没有explicit：允许隐式转换
    MyInt(int v) : value(v) {}
    
    int getValue() const { return value; }
};

void func(MyInt obj) {
    std::cout << obj.getValue() << "\n";
}

func(10);  // 隐式转换：10 -> MyInt(10)

// 使用explicit防止隐式转换
class SafeInt {
private:
    int value;

public:
    explicit SafeInt(int v) : value(v) {}
    
    int getValue() const { return value; }
};

void func2(SafeInt obj) {
    std::cout << obj.getValue() << "\n";
}

// func2(10);  // 错误：不能隐式转换
func2(SafeInt(10));  // 正确：显式构造
```

**使用建议**：
- 单参数构造函数应使用 `explicit`（除非确实需要隐式转换）
- 防止意外的类型转换导致的bug

### 2.10 委托构造函数（C++11）

```cpp
class Rectangle {
private:
    double width;
    double height;
    std::string name;

public:
    // 主构造函数
    Rectangle(double w, double h, std::string n) 
        : width(w), height(h), name(n) {
        std::cout << "Full constructor\n";
    }
    
    // 委托构造函数
    Rectangle() : Rectangle(0, 0, "Default") {
        std::cout << "Default constructor\n";
    }
    
    Rectangle(double w, double h) : Rectangle(w, h, "Unnamed") {
        std::cout << "Two-param constructor\n";
    }
    
    void display() const {
        std::cout << "Rectangle " << name 
                  << ": " << width << "x" << height << "\n";
    }
};

// 使用
Rectangle r1;                    // 调用委托构造
Rectangle r2(10, 20);            // 调用委托构造
Rectangle r3(5, 10, "MyRect");   // 调用主构造
```

---

**本章完**
