![(四)SOLID设计原则](https://via.placeholder.com/800x200?text=SOLID+Principles)

# 面向对象编程基础 - (四)SOLID设计原则

学习面向对象设计的五大原则。

---


### 4.1 单一职责原则（SRP）

**定义**：一个类应该只有一个引起它变化的原因。

**❌ 违反SRP：**

```python
class User:
    def __init__(self, name):
        self.name = name
    
    def get_name(self):
        return self.name
    
    def save_to_database(self):
        # 数据库操作
        pass
    
    def send_email(self):
        # 发送邮件
        pass
```

**✅ 遵循SRP：**

```python
class User:
    def __init__(self, name):
        self.name = name
    
    def get_name(self):
        return self.name

class UserRepository:
    def save(self, user):
        # 数据库操作
        pass

class EmailService:
    def send_email(self, user, message):
        # 发送邮件
        pass
```

### 4.2 开闭原则（OCP）

**定义**：软件实体应该对扩展开放，对修改关闭。

**❌ 违反OCP：**

```python
class DiscountCalculator:
    def calculate(self, customer_type, amount):
        if customer_type == "regular":
            return amount
        elif customer_type == "vip":
            return amount * 0.9
        elif customer_type == "svip":
            return amount * 0.8
        # 添加新客户类型需要修改此方法
```

**✅ 遵循OCP：**

```python
class Customer(ABC):
    @abstractmethod
    def get_discount(self, amount):
        pass

class RegularCustomer(Customer):
    def get_discount(self, amount):
        return amount

class VIPCustomer(Customer):
    def get_discount(self, amount):
        return amount * 0.9

class SVIPCustomer(Customer):
    def get_discount(self, amount):
        return amount * 0.8

# 添加新客户类型只需新增类，不修改现有代码
```

### 4.3 里氏替换原则（LSP）

**定义**：子类对象应该能够替换父类对象。

**❌ 违反LSP：**

```python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def set_width(self, width):
        self.width = width
    
    def set_height(self, height):
        self.height = height
    
    def area(self):
        return self.width * self.height

class Square(Rectangle):
    def set_width(self, width):
        self.width = width
        self.height = width  # 破坏了父类行为
    
    def set_height(self, height):
        self.width = height
        self.height = height

# 问题：
rect = Square(5, 5)
rect.set_width(10)  # 期望：宽=10，高=5；实际：宽=10，高=10
```

**✅ 遵循LSP：**

```python
class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height

class Square(Shape):
    def __init__(self, side):
        self.side = side
    
    def area(self):
        return self.side * self.side
```

### 4.4 接口隔离原则（ISP）

**定义**：不应该强迫客户依赖它们不使用的方法。

**❌ 违反ISP：**

```python
class Worker(ABC):
    @abstractmethod
    def work(self):
        pass
    
    @abstractmethod
    def eat(self):
        pass

class HumanWorker(Worker):
    def work(self):
        print("Human working")
    
    def eat(self):
        print("Human eating")

class RobotWorker(Worker):
    def work(self):
        print("Robot working")
    
    def eat(self):
        pass  # 机器人不需要吃饭！
```

**✅ 遵循ISP：**

```python
class Workable(ABC):
    @abstractmethod
    def work(self):
        pass

class Eatable(ABC):
    @abstractmethod
    def eat(self):
        pass

class HumanWorker(Workable, Eatable):
    def work(self):
        print("Human working")
    
    def eat(self):
        print("Human eating")

class RobotWorker(Workable):
    def work(self):
        print("Robot working")
```

### 4.5 依赖倒置原则（DIP）

**定义**：高层模块不应该依赖低层模块，两者都应该依赖抽象。

**❌ 违反DIP：**

```python
class MySQLDatabase:
    def save(self, data):
        print("Saving to MySQL")

class UserService:
    def __init__(self):
        self.db = MySQLDatabase()  # 直接依赖具体类
    
    def save_user(self, user):
        self.db.save(user)
```

**✅ 遵循DIP：**

```python
class Database(ABC):
    @abstractmethod
    def save(self, data):
        pass

class MySQLDatabase(Database):
    def save(self, data):
        print("Saving to MySQL")

class MongoDBDatabase(Database):
    def save(self, data):
        print("Saving to MongoDB")

class UserService:
    def __init__(self, db: Database):  # 依赖抽象
        self.db = db
    
    def save_user(self, user):
        self.db.save(user)

# 使用
mysql_db = MySQLDatabase()
service = UserService(mysql_db)
```

---

## 5. 常用设计模式