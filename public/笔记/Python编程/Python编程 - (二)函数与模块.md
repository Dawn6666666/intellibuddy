# Python编程 - (二)函数与模块

掌握函数定义和模块化编程。

---

## 2.1 函数定义

```python
def greet(name, greeting="Hello"):
    """问候函数"""
    return f"{greeting}, {name}!"

# 调用函数
message = greet("World")
print(message)  # Hello, World!

# 关键字参数
message = greet("Python", greeting="Hi")

# 可变参数
def sum_all(*args):
    return sum(args)

result = sum_all(1, 2, 3, 4, 5)  # 15

# 关键字可变参数
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25, city="Beijing")
```

### 2.2 Lambda函数

```python
# Lambda表达式
square = lambda x: x**2
print(square(5))  # 25

# 与内置函数结合使用
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))

# 排序
students = [("Alice", 85), ("Bob", 90), ("Charlie", 78)]
students.sort(key=lambda x: x[1])  # 按成绩排序
```

### 2.3 模块和包

```python
# 导入模块
import math
import datetime as dt
from random import randint, choice

# 使用模块
print(math.pi)
print(dt.datetime.now())
print(randint(1, 10))

# 自定义模块 (utils.py)
def calculate_area(radius):
    return math.pi * radius ** 2

def format_currency(amount):
    return f"¥{amount:.2f}"

# 在其他文件中使用
# from utils import calculate_area, format_currency
```

---

**本章完**
