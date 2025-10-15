# Python编程 - (二)函数与模块

掌握函数定义和模块化编程。

---

## 2. 函数与模块

### 2.1 函数定义

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

### 2.3 装饰器基础

```python
# 简单装饰器
def my_decorator(func):
    """装饰器函数"""
    def wrapper():
        print("函数执行前")
        func()
        print("函数执行后")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
# 输出:
# 函数执行前
# Hello!
# 函数执行后

# 带参数的装饰器
def repeat(times):
    """重复执行装饰器"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")  # 打印3次

# 保留函数元信息
from functools import wraps

def timer(func):
    """计时装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} 执行时间: {end - start:.4f}秒")
        return result
    return wrapper

@timer
def slow_function():
    import time
    time.sleep(0.5)
    return "完成"

result = slow_function()
```

### 2.4 闭包

```python
# 闭包示例
def outer_function(x):
    """外部函数"""
    def inner_function(y):
        """内部函数（闭包）"""
        return x + y
    return inner_function

# 创建闭包
add_5 = outer_function(5)
print(add_5(3))   # 8
print(add_5(10))  # 15

# 实用闭包：计数器
def make_counter():
    """创建计数器"""
    count = 0
    
    def counter():
        nonlocal count  # 声明使用外部变量
        count += 1
        return count
    
    return counter

counter1 = make_counter()
print(counter1())  # 1
print(counter1())  # 2
print(counter1())  # 3

counter2 = make_counter()
print(counter2())  # 1 (独立的计数器)

# 闭包实现乘法器
def multiplier(factor):
    """创建乘法器"""
    def multiply(number):
        return number * factor
    return multiply

double = multiplier(2)
triple = multiplier(3)

print(double(5))   # 10
print(triple(5))   # 15
```

### 2.5 作用域

```python
# LEGB规则：Local -> Enclosing -> Global -> Built-in

# 全局变量
global_var = "我是全局变量"

def outer():
    # 外层函数变量（Enclosing）
    enclosing_var = "我是外层变量"
    
    def inner():
        # 局部变量（Local）
        local_var = "我是局部变量"
        
        print(f"局部: {local_var}")
        print(f"外层: {enclosing_var}")
        print(f"全局: {global_var}")
    
    inner()

outer()

# global关键字
count = 0

def increment():
    global count  # 声明使用全局变量
    count += 1
    return count

print(increment())  # 1
print(increment())  # 2
print(count)        # 2

# nonlocal关键字
def outer_func():
    x = 10
    
    def inner_func():
        nonlocal x  # 声明使用外层变量
        x += 5
        return x
    
    result = inner_func()
    print(f"外层x: {x}")  # 15
    return result

print(outer_func())  # 15
```

### 2.6 模块和包

```python
# 导入模块的不同方式
import math                    # 导入整个模块
import datetime as dt          # 导入并重命名
from random import randint, choice  # 导入特定函数
from collections import *      # 导入所有（不推荐）

# 使用模块
print(math.pi)                 # 3.141592653589793
print(math.sqrt(16))           # 4.0
print(dt.datetime.now())       # 当前时间
print(randint(1, 10))          # 1-10的随机整数

# 查看模块内容
print(dir(math))               # 列出math模块的所有内容
print(help(math.sqrt))         # 查看函数帮助

# 自定义模块 (utils.py)
"""
# utils.py 文件内容
import math

def calculate_area(radius):
    '''计算圆的面积'''
    return math.pi * radius ** 2

def format_currency(amount):
    '''格式化货币'''
    return f"¥{amount:.2f}"

def is_prime(n):
    '''判断是否为质数'''
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

# 模块级变量
VERSION = "1.0.0"
AUTHOR = "Alice"
"""

# 在其他文件中使用
# from utils import calculate_area, format_currency
# print(calculate_area(5))
# print(format_currency(1234.56))

# 包的结构示例
"""
mypackage/
    __init__.py
    module1.py
    module2.py
    subpackage/
        __init__.py
        module3.py
"""

# 导入包
# from mypackage import module1
# from mypackage.subpackage import module3
# import mypackage.module2 as m2
```

### 2.7 内置函数速查

```python
# 常用内置函数
numbers = [1, 2, 3, 4, 5]

# 数学函数
print(sum(numbers))        # 15 (求和)
print(max(numbers))        # 5 (最大值)
print(min(numbers))        # 1 (最小值)
print(abs(-10))            # 10 (绝对值)
print(pow(2, 3))           # 8 (幂运算)
print(round(3.14159, 2))   # 3.14 (四舍五入)

# 类型转换
print(int("123"))          # 123
print(float("3.14"))       # 3.14
print(str(123))            # "123"
print(list("abc"))         # ['a', 'b', 'c']
print(tuple([1, 2, 3]))    # (1, 2, 3)
print(set([1, 1, 2, 3]))   # {1, 2, 3}

# 序列操作
print(len(numbers))        # 5 (长度)
print(sorted(numbers, reverse=True))  # [5, 4, 3, 2, 1]
print(reversed(numbers))   # 反向迭代器
print(list(range(5)))      # [0, 1, 2, 3, 4]

# 高阶函数
print(list(map(lambda x: x**2, numbers)))  # [1, 4, 9, 16, 25]
print(list(filter(lambda x: x % 2 == 0, numbers)))  # [2, 4]

# 其他实用函数
print(all([True, True, False]))   # False (全部为True)
print(any([False, False, True]))  # True (至少一个True)
print(zip([1, 2, 3], ['a', 'b', 'c']))  # 打包迭代器
```

---

**本章完**
