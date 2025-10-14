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

### 1.2 控制结构

```python
# 条件语句
age = 18
if age >= 18:
    print("成年人")
elif age >= 13:
    print("青少年")
else:
    print("儿童")

# 循环
# for循环
for i in range(5):
    print(f"数字: {i}")

# while循环
count = 0
while count < 3:
    print(f"计数: {count}")
    count += 1

# 列表推导式
squares = [x**2 for x in range(10)]
even_squares = [x**2 for x in range(10) if x % 2 == 0]
```

---

**本章完**
