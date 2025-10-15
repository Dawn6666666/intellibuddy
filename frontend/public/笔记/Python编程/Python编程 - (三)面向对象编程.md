# Python编程 - (三)面向对象编程

学习Python的面向对象特性。

---

## 3. 面向对象编程

### 3.1 类和对象

```python
class Student:
    # 类变量
    school = "清华大学"
    
    def __init__(self, name, age, student_id):
        # 实例变量
        self.name = name
        self.age = age
        self.student_id = student_id
        self.courses = []
    
    def enroll(self, course):
        """选课"""
        self.courses.append(course)
        print(f"{self.name} 选择了课程: {course}")
    
    def get_info(self):
        """获取学生信息"""
        return f"姓名: {self.name}, 年龄: {self.age}, 学号: {self.student_id}"
    
    def __str__(self):
        """字符串表示"""
        return f"Student({self.name})"
    
    def __repr__(self):
        """开发者表示"""
        return f"Student('{self.name}', {self.age}, '{self.student_id}')"

# 创建对象
alice = Student("Alice", 20, "2021001")
alice.enroll("Python编程")
print(alice.get_info())
```

### 3.2 继承和多态

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        return f"我是 {self.name}, {self.age} 岁"

class Student(Person):
    def __init__(self, name, age, student_id):
        super().__init__(name, age)  # 调用父类构造函数
        self.student_id = student_id
    
    def introduce(self):  # 方法重写
        return f"我是学生 {self.name}, 学号: {self.student_id}"

class Teacher(Person):
    def __init__(self, name, age, subject):
        super().__init__(name, age)
        self.subject = subject
    
    def introduce(self):
        return f"我是 {self.subject} 老师 {self.name}"

# 多态演示
people = [
    Student("Alice", 20, "2021001"),
    Teacher("Bob", 35, "Python"),
    Person("Charlie", 25)
]

for person in people:
    print(person.introduce())
```

### 3.3 特殊方法

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __add__(self, other):
        """向量加法"""
        return Vector(self.x + other.x, self.y + other.y)
    
    def __mul__(self, scalar):
        """标量乘法"""
        return Vector(self.x * scalar, self.y * scalar)
    
    def __len__(self):
        """向量长度"""
        return int((self.x**2 + self.y**2)**0.5)
    
    def __str__(self):
        return f"Vector({self.x}, {self.y})"
    
    def __eq__(self, other):
        """相等比较"""
        return self.x == other.x and self.y == other.y

# 使用特殊方法
v1 = Vector(3, 4)
v2 = Vector(1, 2)

v3 = v1 + v2        # Vector(4, 6)
v4 = v1 * 2         # Vector(6, 8)
length = len(v1)    # 5
print(v1 == v2)     # False
```

### 3.4 属性装饰器

```python
class Temperature:
    """温度类（摄氏度和华氏度转换）"""
    
    def __init__(self, celsius=0):
        self._celsius = celsius
    
    @property
    def celsius(self):
        """获取摄氏度"""
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        """设置摄氏度"""
        if value < -273.15:
            raise ValueError("温度不能低于绝对零度")
        self._celsius = value
    
    @property
    def fahrenheit(self):
        """获取华氏度"""
        return self._celsius * 9/5 + 32
    
    @fahrenheit.setter
    def fahrenheit(self, value):
        """设置华氏度"""
        self.celsius = (value - 32) * 5/9

# 使用属性
temp = Temperature(25)
print(f"摄氏度: {temp.celsius}°C")      # 25°C
print(f"华氏度: {temp.fahrenheit}°F")   # 77.0°F

temp.fahrenheit = 100
print(f"摄氏度: {temp.celsius}°C")      # 37.78°C

# 只读属性
class Circle:
    """圆形类"""
    
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        """半径（只读）"""
        return self._radius
    
    @property
    def area(self):
        """面积（只读，计算属性）"""
        import math
        return math.pi * self._radius ** 2
    
    @property
    def circumference(self):
        """周长（只读，计算属性）"""
        import math
        return 2 * math.pi * self._radius

circle = Circle(5)
print(f"半径: {circle.radius}")
print(f"面积: {circle.area:.2f}")
print(f"周长: {circle.circumference:.2f}")
```

### 3.5 类方法和静态方法

```python
class Date:
    """日期类"""
    
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day
    
    def __str__(self):
        return f"{self.year}-{self.month:02d}-{self.day:02d}"
    
    @classmethod
    def from_string(cls, date_string):
        """类方法：从字符串创建日期对象"""
        year, month, day = map(int, date_string.split('-'))
        return cls(year, month, day)
    
    @classmethod
    def today(cls):
        """类方法：获取今天的日期"""
        from datetime import date
        today = date.today()
        return cls(today.year, today.month, today.day)
    
    @staticmethod
    def is_leap_year(year):
        """静态方法：判断是否为闰年"""
        return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
    
    def is_valid(self):
        """实例方法：验证日期是否有效"""
        if self.month < 1 or self.month > 12:
            return False
        
        days_in_month = [31, 29 if self.is_leap_year(self.year) else 28,
                        31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        
        return 1 <= self.day <= days_in_month[self.month - 1]

# 使用实例方法
date1 = Date(2024, 1, 15)
print(date1)                    # 2024-01-15
print(date1.is_valid())         # True

# 使用类方法
date2 = Date.from_string("2024-12-25")
print(date2)                    # 2024-12-25

date3 = Date.today()
print(f"今天: {date3}")

# 使用静态方法
print(Date.is_leap_year(2024))  # True
print(Date.is_leap_year(2023))  # False
```

### 3.6 抽象基类

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    """抽象形状类"""
    
    @abstractmethod
    def area(self):
        """计算面积（抽象方法）"""
        pass
    
    @abstractmethod
    def perimeter(self):
        """计算周长（抽象方法）"""
        pass
    
    def describe(self):
        """描述形状（具体方法）"""
        return f"这是一个{self.__class__.__name__}"

class Rectangle(Shape):
    """矩形类"""
    
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)

class Circle(Shape):
    """圆形类"""
    
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        import math
        return math.pi * self.radius ** 2
    
    def perimeter(self):
        import math
        return 2 * math.pi * self.radius

# 使用
rect = Rectangle(5, 3)
print(f"矩形面积: {rect.area()}")           # 15
print(f"矩形周长: {rect.perimeter()}")     # 16
print(rect.describe())                     # 这是一个Rectangle

circle = Circle(5)
print(f"圆形面积: {circle.area():.2f}")    # 78.54
print(f"圆形周长: {circle.perimeter():.2f}")  # 31.42

# 不能实例化抽象类
# shape = Shape()  # TypeError: Can't instantiate abstract class
```

### 3.7 魔法方法速查

```python
class MagicDemo:
    """魔法方法演示类"""
    
    def __init__(self, value):
        """构造函数"""
        self.value = value
    
    def __str__(self):
        """字符串表示（用户友好）"""
        return f"MagicDemo({self.value})"
    
    def __repr__(self):
        """字符串表示（开发者友好）"""
        return f"MagicDemo(value={self.value!r})"
    
    def __len__(self):
        """长度"""
        return len(str(self.value))
    
    def __getitem__(self, key):
        """索引访问"""
        return str(self.value)[key]
    
    def __setitem__(self, key, value):
        """索引赋值"""
        temp = list(str(self.value))
        temp[key] = value
        self.value = ''.join(temp)
    
    def __call__(self, *args, **kwargs):
        """使对象可调用"""
        return f"Called with {args} and {kwargs}"
    
    def __enter__(self):
        """上下文管理器进入"""
        print("Entering context")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """上下文管理器退出"""
        print("Exiting context")
        return False

# 使用魔法方法
obj = MagicDemo("Hello")
print(str(obj))         # MagicDemo(Hello)
print(repr(obj))        # MagicDemo(value='Hello')
print(len(obj))         # 5
print(obj[0])           # H
print(obj())            # Called with () and {}

with obj as o:
    print("Inside context")
```

---

**本章完**
