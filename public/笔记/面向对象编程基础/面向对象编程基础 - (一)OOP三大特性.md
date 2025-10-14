![(一)OOP三大特性](https://via.placeholder.com/800x200?text=OOP+Three+Features)

# 面向对象编程基础 - (一)OOP三大特性

学习封装、继承、多态三大特性。

---

# 面向对象编程基础

> 💡 **课程信息**
> - 学习时长：100小时
> - 难度等级：⭐⭐⭐ (中高)
> - 前置课程：C语言编程导论
> - 课程代码：CS102

---

## 📚 课程概述

### 什么是面向对象编程？

面向对象编程(OOP)是一种以**对象**为中心的编程范式，它将数据和操作数据的方法封装在一起，通过对象之间的交互来完成程序功能。

**编程范式对比：**

| 特性 | 面向过程 | 面向对象 |
|------|----------|----------|
| 核心单位 | 函数 | 对象（类的实例） |
| 数据组织 | 全局变量、局部变量 | 对象的属性 |
| 代码复用 | 函数调用 | 继承、多态 |
| 扩展性 | 较差 | 良好 |
| 维护性 | 困难 | 相对容易 |

**OOP的优势：**
- ✅ **模块化**：代码组织更清晰
- ✅ **复用性**：通过继承减少重复代码
- ✅ **可维护性**：修改局部不影响全局
- ✅ **可扩展性**：易于添加新功能
- ✅ **抽象性**：隐藏复杂实现细节

### 为什么要学OOP？

**在计算机专业中的重要性：**

1. **软件开发**：现代主流语言都支持OOP（Java、Python、C++）
2. **系统设计**：框架和库大多基于OOP思想
3. **代码质量**：OOP有助于编写高质量、可维护的代码
4. **职业需求**：企业开发普遍使用OOP

**实际应用场景：**
- 🌐 Web开发：Spring、Django等框架
- 📱 移动开发：Android、iOS应用
- 🎮 游戏开发：Unity、Unreal引擎
- 🤖 人工智能：TensorFlow、PyTorch库

### 学习目标

完成本课程学习后，学生应能够：

**✅ 核心概念掌握：**
- 深入理解类、对象、封装、继承、多态
- 区分面向对象与面向过程编程
- 理解抽象、接口的作用

**✅ 设计原则应用：**
- SOLID原则（单一职责、开闭、里氏替换、接口隔离、依赖倒置）
- 组合优于继承
- 面向接口编程

**✅ 实践能力培养：**
- 设计合理的类层次结构
- 熟练运用继承和多态
- 使用设计模式解决问题
- 编写可维护的代码

---

## 1. OOP三大特性

### 1.1 封装（Encapsulation）

#### 什么是封装？

**定义**：将数据（属性）和操作数据的方法绑定在一起，隐藏内部实现细节，只暴露必要的接口。

**封装的好处：**
1. **数据安全**：防止外部随意修改内部数据
2. **降低耦合**：外部只需知道接口，不需了解实现
3. **易于维护**：修改内部实现不影响外部使用
4. **提高复用**：封装良好的类易于重用

#### Python示例

```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.__balance = balance  # 私有属性
    
    def deposit(self, amount):
        """存款"""
        if amount > 0:
            self.__balance += amount
            return True
        return False
    
    def withdraw(self, amount):
        """取款"""
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            return True
        return False
    
    def get_balance(self):
        """查询余额"""
        return self.__balance

# 使用示例
account = BankAccount("Alice", 1000)
account.deposit(500)
print(account.get_balance())  # 1500
# print(account.__balance)  # 错误！无法直接访问私有属性
```

#### Java示例

```java
public class Student {
    // 私有属性
    private String name;
    private int age;
    private double score;
    
    // 构造方法
    public Student(String name, int age) {
        this.name = name;
        this.setAge(age);  // 使用setter进行验证
    }
    
    // Getter方法
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
    
    // Setter方法（带验证）
    public void setAge(int age) {
        if (age > 0 && age < 150) {
            this.age = age;
        } else {
            throw new IllegalArgumentException("年龄无效");
        }
    }
    
    public void setScore(double score) {
        if (score >= 0 && score <= 100) {
            this.score = score;
        }
    }
}
```

**访问修饰符对比：**

| 修饰符 | 类内部 | 同包 | 子类 | 其他 |
|--------|--------|------|------|------|
| `private` | ✅ | ❌ | ❌ | ❌ |
| `default` | ✅ | ✅ | ❌ | ❌ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| `public` | ✅ | ✅ | ✅ | ✅ |

### 1.2 继承（Inheritance）

#### 什么是继承？

**定义**：子类继承父类的属性和方法，实现代码复用和层次化设计。

**继承的作用：**
- 📦 **代码复用**：避免重复编写相同代码
- 🏗️ **层次结构**：建立"is-a"关系
- 🔄 **多态基础**：为方法重写提供基础

#### Python示例

```python
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        pass  # 抽象方法
    
    def move(self):
        print(f"{self.name} is moving")

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"
    
    def fetch(self):
        return f"{self.name} is fetching"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"
    
    def climb(self):
        return f"{self.name} is climbing"

# 使用示例
dog = Dog("Buddy")
cat = Cat("Whiskers")

print(dog.speak())  # Buddy says Woof!
print(cat.speak())  # Whiskers says Meow!
dog.move()  # Buddy is moving（继承自Animal）
```

#### 继承层次示例

```
        Vehicle（交通工具）
           ↓
    ┌──────┴──────┐
    ↓             ↓
  Car          Bicycle
   ↓
┌──┴──┐
↓     ↓
Sedan SUV
```

**代码实现：**

```python
class Vehicle:
    def __init__(self, brand, model):
        self.brand = brand
        self.model = model
    
    def start(self):
        print(f"{self.brand} {self.model} is starting")

class Car(Vehicle):
    def __init__(self, brand, model, doors):
        super().__init__(brand, model)
        self.doors = doors
    
    def drive(self):
        print(f"Driving the {self.brand} car")

class Sedan(Car):
    def __init__(self, brand, model, doors, trunk_size):
        super().__init__(brand, model, doors)
        self.trunk_size = trunk_size

# 使用
sedan = Sedan("Toyota", "Camry", 4, "large")
sedan.start()  # 继承自Vehicle
sedan.drive()  # 继承自Car
```

#### 方法重写（Override）

```python
class Shape:
    def area(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        import math
        return math.pi * self.radius ** 2

# 使用
shapes = [
    Rectangle(5, 3),
    Circle(4)
]

for shape in shapes:
    print(f"Area: {shape.area():.2f}")
```

### 1.3 多态（Polymorphism）

#### 什么是多态？

**定义**：同一操作作用于不同对象时，可以有不同的解释，产生不同的执行结果。

**多态的实现方式：**
1. **重写（Override）**：子类重新定义父类方法
2. **重载（Overload）**：同名方法不同参数（Python不直接支持）
3. **接口实现**：不同类实现相同接口

#### 多态示例

```python
class PaymentMethod:
    def pay(self, amount):
        raise NotImplementedError

class CreditCard(PaymentMethod):
    def pay(self, amount):
        print(f"Paying ${amount} with Credit Card")
        # 信用卡支付逻辑

class PayPal(PaymentMethod):
    def pay(self, amount):
        print(f"Paying ${amount} with PayPal")
        # PayPal支付逻辑

class Bitcoin(PaymentMethod):
    def pay(self, amount):
        print(f"Paying ${amount} with Bitcoin")
        # 比特币支付逻辑

# 多态应用
def process_payment(payment_method, amount):
    """统一的支付处理接口"""
    payment_method.pay(amount)

# 使用不同的支付方式
methods = [
    CreditCard(),
    PayPal(),
    Bitcoin()
]

for method in methods:
    process_payment(method, 100)
```

**输出：**
```
Paying $100 with Credit Card
Paying $100 with PayPal
Paying $100 with Bitcoin
```

#### 鸭子类型（Duck Typing）

Python的多态不需要继承，只要有相同的方法即可：

```python
class Duck:
    def quack(self):
        print("Quack quack!")
    
    def swim(self):
        print("Duck is swimming")

class Person:
    def quack(self):
        print("Person imitating duck: Quack!")
    
    def swim(self):
        print("Person is swimming")

def make_it_quack(thing):
    """如果它能叫，它就是鸭子（鸭子类型）"""
    thing.quack()
    thing.swim()

# 都可以工作
make_it_quack(Duck())
make_it_quack(Person())
```

---

## 2. 类与对象详解