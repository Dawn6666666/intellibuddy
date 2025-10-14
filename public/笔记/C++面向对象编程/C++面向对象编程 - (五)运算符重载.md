# C++面向对象编程 - (五)运算符重载

掌握运算符重载的使用技巧。

---

## 5.1 基本运算符重载

```cpp
class Complex {
private:
    double real, imag;

public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}
    
    // + 运算符重载（成员函数）
    Complex operator+(const Complex& other) const {
        return Complex(real + other.real, imag + other.imag);
    }
    
    // == 运算符重载
    bool operator==(const Complex& other) const {
        return real == other.real && imag == other.imag;
    }
    
    // 前置++
    Complex& operator++() {
        ++real;
        return *this;
    }
    
    // 后置++
    Complex operator++(int) {  // int是占位符
        Complex temp = *this;
        ++real;
        return temp;
    }
};
```

### 5.2 友元函数重载

```cpp
class Complex {
    friend std::ostream& operator<<(std::ostream& os, const Complex& c);
    friend Complex operator*(double scalar, const Complex& c);
private:
    double real, imag;
public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}
};

// 流操作符重载（必须用友元或非成员函数）
std::ostream& operator<<(std::ostream& os, const Complex& c) {
    os << c.real << " + " << c.imag << "i";
    return os;
}

// 左操作数不是Complex的重载
Complex operator*(double scalar, const Complex& c) {
    return Complex(scalar * c.real, scalar * c.imag);
}

// 使用
Complex c(3, 4);
std::cout << c << std::endl;  // 3 + 4i
Complex c2 = 2.0 * c;         // 6 + 8i
```

---

**本章完**
