# 面向对象编程基础 - (一)OOP三大特性

学习封装、继承、多态三大特性。

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

```plain
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
```plain
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

### 1.4 组合 vs 继承

#### 什么是组合？

**组合（Composition）**：通过包含其他类的实例来实现功能复用，建立"has-a"关系。

**继承 vs 组合对比：**

| 特性 | 继承（is-a） | 组合（has-a） |
|------|-------------|--------------|
| 关系类型 | 父子类关系 | 包含关系 |
| 耦合度 | 高（紧耦合） | 低（松耦合） |
| 灵活性 | 较低 | 高 |
| 运行时改变 | 不可以 | 可以 |
| 代码复用 | 继承父类 | 组合多个对象 |
| 适用场景 | 明确的"是一个"关系 | "有一个"或"使用"关系 |

#### 继承示例

```python
class Engine:
    def start(self):
        print("Engine starting...")
    
    def stop(self):
        print("Engine stopping...")

# 使用继承（不推荐）
class Car(Engine):
    """Car is-a Engine? 不合理！"""
    
    def drive(self):
        self.start()
        print("Car is driving")
        self.stop()

car = Car()
car.drive()
```

**问题**：汽车不是发动机，这违反了"is-a"关系。

#### 组合示例（推荐）

```python
class Engine:
    def start(self):
        print("Engine starting...")
    
    def stop(self):
        print("Engine stopping...")

class Wheels:
    def __init__(self, count=4):
        self.count = count
    
    def rotate(self):
        print(f"{self.count} wheels rotating")

class GPS:
    def navigate(self, destination):
        print(f"Navigating to {destination}")

class Car:
    """Car has-a Engine, has-a Wheels, has-a GPS"""
    
    def __init__(self):
        self.engine = Engine()  # 组合：汽车有一个发动机
        self.wheels = Wheels(4)
        self.gps = GPS()
    
    def drive(self, destination):
        self.engine.start()
        self.wheels.rotate()
        self.gps.navigate(destination)
        print("Car is driving")
    
    def stop(self):
        self.engine.stop()
        print("Car stopped")

# 使用
car = Car()
car.drive("Beijing")
car.stop()
```

**优点**：
+ ✅ 符合"has-a"关系
+ ✅ 灵活组合不同组件
+ ✅ 运行时可替换组件
+ ✅ 降低耦合度

#### 组合的高级应用：策略模式

```python
class CompressionStrategy:
    """压缩策略基类"""
    def compress(self, data):
        raise NotImplementedError

class ZipCompression(CompressionStrategy):
    def compress(self, data):
        return f"ZIP compressed: {data}"

class RarCompression(CompressionStrategy):
    def compress(self, data):
        return f"RAR compressed: {data}"

class GzipCompression(CompressionStrategy):
    def compress(self, data):
        return f"GZIP compressed: {data}"

class FileCompressor:
    """文件压缩器（使用组合）"""
    
    def __init__(self, strategy: CompressionStrategy):
        self.strategy = strategy  # 组合：使用压缩策略
    
    def set_strategy(self, strategy: CompressionStrategy):
        """运行时切换策略"""
        self.strategy = strategy
    
    def compress_file(self, filename):
        with open(filename, 'r') as f:
            data = f.read()
        return self.strategy.compress(data)

# 使用
compressor = FileCompressor(ZipCompression())
result1 = compressor.compress_file("data.txt")
print(result1)

# 运行时切换策略
compressor.set_strategy(RarCompression())
result2 = compressor.compress_file("data.txt")
print(result2)
```

#### 何时使用继承？何时使用组合？

**使用继承的场景：**
+ 明确的"is-a"关系（Dog is an Animal）
+ 需要利用多态性
+ 子类是父类的特化版本

```python
class Animal:
    def breathe(self):
        print("Breathing...")

class Mammal(Animal):
    """哺乳动物是动物（is-a关系）"""
    def feed_young(self):
        print("Feeding young with milk")

class Dog(Mammal):
    """狗是哺乳动物（is-a关系）"""
    def bark(self):
        print("Woof!")

dog = Dog()
dog.breathe()  # 继承自Animal
dog.feed_young()  # 继承自Mammal
dog.bark()  # Dog特有方法
```

**使用组合的场景：**
+ "has-a"或"uses-a"关系
+ 需要运行时改变行为
+ 需要组合多个功能
+ 避免深层继承层次

```python
class Logger:
    def log(self, message):
        print(f"[LOG] {message}")

class Database:
    def save(self, data):
        print(f"Saving {data} to database")

class EmailService:
    def send(self, to, message):
        print(f"Sending email to {to}: {message}")

class UserService:
    """用户服务（使用组合）"""
    
    def __init__(self):
        self.logger = Logger()  # 组合
        self.database = Database()  # 组合
        self.email_service = EmailService()  # 组合
    
    def register_user(self, username, email):
        self.logger.log(f"Registering user: {username}")
        self.database.save({"username": username, "email": email})
        self.email_service.send(email, "Welcome!")
        self.logger.log(f"User {username} registered successfully")

# 使用
service = UserService()
service.register_user("Alice", "alice@example.com")
```

**设计原则**：
> **优先使用组合而非继承** - Gang of Four (设计模式)

### 1.5 多重继承与方法解析顺序（MRO）

#### 多重继承

Python支持多重继承，一个类可以继承多个父类。

```python
class Flyable:
    def fly(self):
        print("Flying in the sky")

class Swimmable:
    def swim(self):
        print("Swimming in water")

class Duck(Flyable, Swimmable):
    """鸭子既能飞又能游泳"""
    
    def quack(self):
        print("Quack!")

# 使用
duck = Duck()
duck.fly()    # 继承自Flyable
duck.swim()   # 继承自Swimmable
duck.quack()  # Duck特有方法
```

#### 钻石问题（Diamond Problem）

当多重继承形成菱形结构时，方法调用顺序变得复杂：

```python
class A:
    def method(self):
        print("Method in A")

class B(A):
    def method(self):
        print("Method in B")
        super().method()

class C(A):
    def method(self):
        print("Method in C")
        super().method()

class D(B, C):
    """钻石继承：D -> B -> A, D -> C -> A"""
    def method(self):
        print("Method in D")
        super().method()

# 继承结构：
#     A
#    / \
#   B   C
#    \ /
#     D

d = D()
d.method()
```

**输出：**
```plain
Method in D
Method in B
Method in C
Method in A
```

#### 方法解析顺序（MRO - Method Resolution Order）

Python使用C3线性化算法确定方法查找顺序。

```python
class A:
    def show(self):
        print("A")

class B(A):
    def show(self):
        print("B")
        super().show()

class C(A):
    def show(self):
        print("C")
        super().show()

class D(B, C):
    def show(self):
        print("D")
        super().show()

# 查看MRO
print(D.__mro__)
# 输出: (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)

print(D.mro())
# 更易读的MRO输出

d = D()
d.show()
# 输出:
# D
# B
# C
# A
```

**MRO规则：**
1. 子类优先于父类
2. 多个父类按照声明顺序
3. 如果有多条继承路径，选择最后出现的类
4. 使用C3线性化算法保证单调性

#### 多重继承最佳实践

```python
class LoggerMixin:
    """日志混入类（Mixin）"""
    
    def log(self, message, level="INFO"):
        print(f"[{level}] {self.__class__.__name__}: {message}")

class TimestampMixin:
    """时间戳混入类"""
    
    def get_timestamp(self):
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

class CacheMixin:
    """缓存混入类"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._cache = {}
    
    def get_from_cache(self, key):
        return self._cache.get(key)
    
    def set_cache(self, key, value):
        self._cache[key] = value

class User(LoggerMixin, TimestampMixin, CacheMixin):
    """用户类（使用多个Mixin）"""
    
    def __init__(self, username):
        super().__init__()
        self.username = username
        self.log(f"User {username} created")
    
    def get_user_info(self):
        # 先检查缓存
        cached = self.get_from_cache('info')
        if cached:
            self.log("Retrieved from cache", "DEBUG")
            return cached
        
        # 生成信息
        info = {
            'username': self.username,
            'created_at': self.get_timestamp()
        }
        
        # 存入缓存
        self.set_cache('info', info)
        self.log("Generated and cached user info", "DEBUG")
        
        return info

# 使用
user = User("Alice")
info1 = user.get_user_info()
info2 = user.get_user_info()  # 从缓存获取
```

**Mixin设计原则：**
1. ✅ Mixin类不应该单独实例化
2. ✅ Mixin提供单一、明确的功能
3. ✅ Mixin不应该有复杂的继承关系
4. ✅ 使用描述性命名（如 `LoggerMixin`）
5. ✅ 避免Mixin之间的依赖

### 1.6 实战案例：电商系统

综合运用封装、继承、多态、组合设计电商系统：

```python
from abc import ABC, abstractmethod
from datetime import datetime
from typing import List

# 1. 使用封装：Product类
class Product:
    """产品类（封装）"""
    
    def __init__(self, product_id, name, price, stock):
        self.__product_id = product_id  # 私有属性
        self.__name = name
        self.__price = price
        self.__stock = stock
    
    # Getter方法
    @property
    def product_id(self):
        return self.__product_id
    
    @property
    def name(self):
        return self.__name
    
    @property
    def price(self):
        return self.__price
    
    @property
    def stock(self):
        return self.__stock
    
    # 带验证的Setter
    @price.setter
    def price(self, value):
        if value > 0:
            self.__price = value
        else:
            raise ValueError("Price must be positive")
    
    def reduce_stock(self, quantity):
        """减少库存"""
        if quantity <= self.__stock:
            self.__stock -= quantity
            return True
        return False
    
    def __str__(self):
        return f"{self.__name} (${self.__price})"

# 2. 使用抽象类和多态：支付方式
class PaymentMethod(ABC):
    """支付方式抽象类（多态）"""
    
    @abstractmethod
    def process_payment(self, amount) -> bool:
        pass
    
    @abstractmethod
    def get_name(self) -> str:
        pass

class CreditCardPayment(PaymentMethod):
    def __init__(self, card_number):
        self.card_number = card_number
    
    def process_payment(self, amount) -> bool:
        print(f"Processing ${amount} via Credit Card ending in {self.card_number[-4:]}")
        return True
    
    def get_name(self) -> str:
        return "Credit Card"

class AlipayPayment(PaymentMethod):
    def __init__(self, account):
        self.account = account
    
    def process_payment(self, amount) -> bool:
        print(f"Processing ${amount} via Alipay account {self.account}")
        return True
    
    def get_name(self) -> str:
        return "Alipay"

# 3. 使用组合：订单类
class Order:
    """订单类（组合）"""
    
    def __init__(self, order_id, customer_name):
        self.order_id = order_id
        self.customer_name = customer_name
        self.items: List[tuple[Product, int]] = []  # (product, quantity)
        self.payment_method: PaymentMethod = None
        self.status = "Pending"
        self.created_at = datetime.now()
    
    def add_item(self, product: Product, quantity: int):
        """添加商品"""
        if product.reduce_stock(quantity):
            self.items.append((product, quantity))
            return True
        print(f"Insufficient stock for {product.name}")
        return False
    
    def set_payment_method(self, payment_method: PaymentMethod):
        """设置支付方式（组合）"""
        self.payment_method = payment_method
    
    def calculate_total(self) -> float:
        """计算总价"""
        return sum(product.price * quantity for product, quantity in self.items)
    
    def checkout(self) -> bool:
        """结账"""
        if not self.items:
            print("Cart is empty")
            return False
        
        if not self.payment_method:
            print("Please select a payment method")
            return False
        
        total = self.calculate_total()
        
        if self.payment_method.process_payment(total):
            self.status = "Paid"
            print(f"Order {self.order_id} completed successfully!")
            self.print_receipt()
            return True
        
        self.status = "Failed"
        return False
    
    def print_receipt(self):
        """打印收据"""
        print("\n" + "="*50)
        print(f"Order #{self.order_id}")
        print(f"Customer: {self.customer_name}")
        print(f"Date: {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
        print("-"*50)
        
        for product, quantity in self.items:
            print(f"{product.name} x {quantity} = ${product.price * quantity:.2f}")
        
        print("-"*50)
        print(f"Total: ${self.calculate_total():.2f}")
        print(f"Payment Method: {self.payment_method.get_name()}")
        print("="*50 + "\n")

# 4. 继承示例：特殊用户类型
class Customer:
    """普通客户"""
    
    def __init__(self, name):
        self.name = name
    
    def get_discount(self) -> float:
        return 0.0  # 无折扣

class VIPCustomer(Customer):
    """VIP客户（继承）"""
    
    def get_discount(self) -> float:
        return 0.1  # 10%折扣

class SVIPCustomer(VIPCustomer):
    """超级VIP客户（继承）"""
    
    def get_discount(self) -> float:
        return 0.2  # 20%折扣

# 使用示例
def main():
    # 创建产品
    laptop = Product(1, "Laptop", 1200.0, 10)
    mouse = Product(2, "Mouse", 25.0, 100)
    keyboard = Product(3, "Keyboard", 75.0, 50)
    
    # 创建客户
    customer = VIPCustomer("Alice")
    
    # 创建订单
    order = Order("ORD-001", customer.name)
    
    # 添加商品
    order.add_item(laptop, 1)
    order.add_item(mouse, 2)
    order.add_item(keyboard, 1)
    
    # 设置支付方式（多态）
    payment = CreditCardPayment("1234-5678-9012-3456")
    order.set_payment_method(payment)
    
    # 结账
    order.checkout()

if __name__ == "__main__":
    main()
```

**输出：**
```plain
Processing $1325.0 via Credit Card ending in 3456
Order ORD-001 completed successfully!

==================================================
Order #ORD-001
Customer: Alice
Date: 2025-10-15 14:30:45
--------------------------------------------------
Laptop x 1 = $1200.00
Mouse x 2 = $50.00
Keyboard x 1 = $75.00
--------------------------------------------------
Total: $1325.00
Payment Method: Credit Card
==================================================
```

**设计亮点：**
+ ✅ **封装**：Product类隐藏内部数据，提供安全接口
+ ✅ **继承**：Customer -> VIPCustomer -> SVIPCustomer 层次
+ ✅ **多态**：不同支付方式统一接口
+ ✅ **组合**：Order类组合Product、PaymentMethod
+ ✅ **SOLID原则**：单一职责、开闭原则

---

**本章完**