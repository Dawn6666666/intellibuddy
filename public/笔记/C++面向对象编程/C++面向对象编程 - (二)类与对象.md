# C++面向对象编程 - (二)类与对象

掌握C++中类和对象的定义与使用。

---

## 2.1 类的定义（.h和.cpp分离）

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

---

**本章完**
