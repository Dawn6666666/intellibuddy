# C++面向对象编程 - (四)继承与多态

学习面向对象的继承和多态特性。

---

## 4. 继承与多态

### 4.1 继承方式

```cpp
class Base {
public:
    int pub;
protected:
    int prot;
private:
    int priv;
};

// public继承（最常用）
class Derived1 : public Base {
    // pub → public
    // prot → protected
    // priv → 不可访问
};

// protected继承
class Derived2 : protected Base {
    // pub → protected
    // prot → protected
    // priv → 不可访问
};

// private继承
class Derived3 : private Base {
    // pub → private
    // prot → private
    // priv → 不可访问
};
```

**Java对比**：
```java
// Java只有public继承
class Derived extends Base {
    // ...
}
```

### 4.2 虚函数与多态

**虚函数**：

```cpp
class Animal {
public:
    virtual void speak() {  // virtual关键字
        std::cout << "Animal speaks\n";
    }
    
    virtual ~Animal() {}  // 虚析构函数（重要！）
};

class Dog : public Animal {
public:
    void speak() override {  // override关键字（C++11）
        std::cout << "Woof!\n";
    }
};

// 多态
Animal* animal = new Dog();
animal->speak();  // 输出: Woof!（动态绑定）
delete animal;    // 调用Dog的析构函数（因为是虚析构）
```

**纯虚函数（抽象类）**：

```cpp
class Shape {
public:
    virtual double area() const = 0;  // 纯虚函数
    virtual ~Shape() {}
};

class Circle : public Shape {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    
    double area() const override {
        return 3.14159 * radius * radius;
    }
};

// Shape s;  // ❌ 错误：不能实例化抽象类
Circle c(5.0);  // ✅ 正确
```

**Java对比**：
```java
// Java使用abstract关键字
abstract class Shape {
    public abstract double area();
}

class Circle extends Shape {
    @Override
    public double area() {
        return 3.14159 * radius * radius;
    }
}
```

### 4.3 多重继承

**C++支持多重继承**：

```cpp
class Flyable {
public:
    virtual void fly() = 0;
};

class Swimmable {
public:
    virtual void swim() = 0;
};

class Duck : public Flyable, public Swimmable {
public:
    void fly() override {
        std::cout << "Duck flies\n";
    }
    
    void swim() override {
        std::cout << "Duck swims\n";
    }
};
```

**菱形继承问题**：

```cpp
class A {
public:
    int value;
};

class B : public A {};
class C : public A {};

class D : public B, public C {
    // D有两份A的成员（value）
    // 访问时会有歧义
};
```

**虚继承解决**：

```cpp
class B : virtual public A {};
class C : virtual public A {};

class D : public B, public C {
    // 现在只有一份A的成员
};
```

**Java对比**：
```java
// Java不支持多重继承，使用接口
interface Flyable {
    void fly();
}

interface Swimmable {
    void swim();
}

class Duck implements Flyable, Swimmable {
    public void fly() { ... }
    public void swim() { ... }
}
```

---

**本章完**
