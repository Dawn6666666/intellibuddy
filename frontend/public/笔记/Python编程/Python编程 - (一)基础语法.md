# Python编程 - (一)基础语法

学习Python的基本语法和数据类型。

---

## 📚 Python语言简介

Python是一门简洁优雅、功能强大的现代编程语言。

### 核心理念
- **简洁优雅** - "Life is short, you need Python"
- **可读性强** - 代码即文档
- **功能强大** - 丰富的标准库和第三方库
- **跨平台** - 一次编写，到处运行

---

## 1. 基础语法

### 1.1 数据类型

```python
# 基本数据类型
number = 42              # 整数
pi = 3.14159            # 浮点数
name = "Python"         # 字符串
is_awesome = True       # 布尔值

# 集合类型
numbers = [1, 2, 3, 4, 5]           # 列表
coordinates = (10, 20)              # 元组
unique_items = {1, 2, 3}           # 集合
person = {"name": "Alice", "age": 25}  # 字典

# 类型检查
print(type(number))     # <class 'int'>
print(isinstance(pi, float))  # True
```

### 1.2 字符串操作

```python
# 字符串创建
text = "Hello, Python!"
multi_line = """这是
多行
字符串"""

# 字符串索引和切片
print(text[0])      # H
print(text[-1])     # !
print(text[0:5])    # Hello
print(text[::-1])   # !nohtyP ,olleH (反转)

# 字符串方法
name = "  alice  "
print(name.strip())           # "alice" (去除空格)
print(name.upper())           # "  ALICE  "
print(name.lower())           # "  alice  "
print(name.capitalize())      # "  alice  "

# 字符串格式化
name = "Alice"
age = 25

# 方法1: f-string (推荐)
print(f"我是{name}, 今年{age}岁")

# 方法2: format()
print("我是{}, 今年{}岁".format(name, age))
print("我是{name}, 今年{age}岁".format(name=name, age=age))

# 方法3: % 格式化
print("我是%s, 今年%d岁" % (name, age))

# 字符串分割和连接
sentence = "Python is awesome"
words = sentence.split()      # ['Python', 'is', 'awesome']
joined = "-".join(words)      # "Python-is-awesome"

# 字符串查找和替换
text = "Hello World"
print(text.find("World"))     # 6
print(text.replace("World", "Python"))  # "Hello Python"
print("World" in text)        # True
```

### 1.3 运算符详解

```python
# 算术运算符
a, b = 10, 3
print(f"加法: {a + b}")      # 13
print(f"减法: {a - b}")      # 7
print(f"乘法: {a * b}")      # 30
print(f"除法: {a / b}")      # 3.333...
print(f"整除: {a // b}")     # 3
print(f"取余: {a % b}")      # 1
print(f"幂运算: {a ** b}")   # 1000

# 比较运算符
x, y = 5, 10
print(x == y)   # False (等于)
print(x != y)   # True (不等于)
print(x < y)    # True (小于)
print(x > y)    # False (大于)
print(x <= y)   # True (小于等于)
print(x >= y)   # False (大于等于)

# 逻辑运算符
a, b = True, False
print(a and b)  # False (与)
print(a or b)   # True (或)
print(not a)    # False (非)

# 成员运算符
fruits = ['apple', 'banana', 'cherry']
print('apple' in fruits)      # True
print('orange' not in fruits) # True

# 身份运算符
x = [1, 2, 3]
y = [1, 2, 3]
z = x

print(x is z)      # True (同一对象)
print(x is y)      # False (不同对象)
print(x == y)      # True (值相等)
print(x is not y)  # True
```

### 1.4 控制结构

```python
# 条件语句
age = 18
if age >= 18:
    print("成年人")
elif age >= 13:
    print("青少年")
else:
    print("儿童")

# 三元表达式
status = "成年" if age >= 18 else "未成年"
print(status)

# 循环 - for循环
for i in range(5):
    print(f"数字: {i}")

# range()函数的用法
for i in range(1, 10, 2):  # 起始, 结束, 步长
    print(i, end=' ')  # 1 3 5 7 9
print()

# 遍历列表
fruits = ['apple', 'banana', 'cherry']
for fruit in fruits:
    print(fruit)

# enumerate()获取索引和值
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# while循环
count = 0
while count < 3:
    print(f"计数: {count}")
    count += 1

# break和continue
for i in range(10):
    if i == 3:
        continue  # 跳过3
    if i == 7:
        break     # 在7处停止
    print(i, end=' ')  # 0 1 2 4 5 6
print()

# 列表推导式
squares = [x**2 for x in range(10)]
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(f"平方数: {squares}")
print(f"偶数平方: {even_squares}")

# 字典推导式
square_dict = {x: x**2 for x in range(5)}
print(f"平方字典: {square_dict}")

# 集合推导式
unique_squares = {x**2 for x in [1, -1, 2, -2, 3, -3]}
print(f"唯一平方数: {unique_squares}")
```

### 1.5 输入输出

```python
# 基本输入
name = input("请输入你的名字: ")
print(f"你好, {name}!")

# 类型转换
age_str = input("请输入你的年龄: ")
age = int(age_str)  # 转换为整数

# 格式化输出
pi = 3.14159265359
print(f"π ≈ {pi:.2f}")      # 保留2位小数: 3.14
print(f"π ≈ {pi:.4f}")      # 保留4位小数: 3.1416

# 对齐输出
print(f"{'左对齐':<10}|")
print(f"{'右对齐':>10}|")
print(f"{'居中':^10}|")

# 数字格式化
number = 1234567
print(f"千分位: {number:,}")           # 1,234,567
print(f"百分比: {0.85:.1%}")           # 85.0%
print(f"科学计数: {number:.2e}")       # 1.23e+06

# 打印到文件
with open('output.txt', 'w', encoding='utf-8') as f:
    print("Hello, File!", file=f)
```

---

**本章完**
