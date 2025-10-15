# Python编程 - (七)Python标准库详解

深入学习Python标准库。

---

## 7. Python标准库详解

### 7.1 collections - 容器数据类型

```python
from collections import Counter, defaultdict, deque, namedtuple, OrderedDict

# Counter - 计数器
words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple']
counter = Counter(words)
print(counter)  # Counter({'apple': 3, 'banana': 2, 'cherry': 1})
print(counter.most_common(2))  # [('apple', 3), ('banana', 2)]

# defaultdict - 默认字典
word_groups = defaultdict(list)
words_list = ['apple', 'apricot', 'banana', 'blueberry', 'cherry']
for word in words_list:
    word_groups[word[0]].append(word)
print(dict(word_groups))  # {'a': ['apple', 'apricot'], 'b': ['banana', 'blueberry'], 'c': ['cherry']}

# deque - 双端队列（高效的append和pop）
dq = deque([1, 2, 3])
dq.append(4)        # 右侧添加
dq.appendleft(0)    # 左侧添加
print(dq)           # deque([0, 1, 2, 3, 4])
dq.pop()            # 右侧删除
dq.popleft()        # 左侧删除
print(dq)           # deque([1, 2, 3])

# namedtuple - 命名元组
Point = namedtuple('Point', ['x', 'y'])
p = Point(10, 20)
print(p.x, p.y)     # 10 20
print(p[0], p[1])   # 10 20

Student = namedtuple('Student', ['name', 'age', 'grade'])
alice = Student('Alice', 20, 95)
print(alice.name, alice.grade)  # Alice 95

# OrderedDict - 有序字典（Python 3.7+普通dict也保持顺序）
od = OrderedDict()
od['one'] = 1
od['two'] = 2
od['three'] = 3
print(list(od.keys()))  # ['one', 'two', 'three']
```

### 7.2 itertools - 迭代器工具

```python
from itertools import (
    count, cycle, repeat,
    chain, combinations, permutations,
    product, groupby
)

# 无限迭代器
counter = count(start=10, step=2)  # 10, 12, 14, 16, ...
# print(list(islice(counter, 5)))  # [10, 12, 14, 16, 18]

cycler = cycle(['A', 'B', 'C'])     # A, B, C, A, B, C, ...
repeater = repeat('Hello', 3)        # Hello, Hello, Hello

# chain - 连接多个迭代器
combined = chain([1, 2, 3], ['a', 'b'], [True, False])
print(list(combined))  # [1, 2, 3, 'a', 'b', True, False]

# combinations - 组合
print(list(combinations([1, 2, 3, 4], 2)))
# [(1, 2), (1, 3), (1, 4), (2, 3), (2, 4), (3, 4)]

# permutations - 排列
print(list(permutations([1, 2, 3], 2)))
# [(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)]

# product - 笛卡尔积
print(list(product([1, 2], ['a', 'b'])))
# [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]

# groupby - 分组
data = [
    ('Alice', 85),
    ('Bob', 90),
    ('Charlie', 85),
    ('Diana', 90)
]
data_sorted = sorted(data, key=lambda x: x[1])
for grade, group in groupby(data_sorted, key=lambda x: x[1]):
    print(f"成绩 {grade}: {list(group)}")
```

### 7.3 functools - 函数工具

```python
from functools import reduce, partial, lru_cache, wraps

# reduce - 累积计算
numbers = [1, 2, 3, 4, 5]
sum_result = reduce(lambda x, y: x + y, numbers)
print(sum_result)  # 15

product_result = reduce(lambda x, y: x * y, numbers)
print(product_result)  # 120

# partial - 偏函数
def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)

print(square(5))  # 25
print(cube(5))    # 125

# lru_cache - 缓存装饰器（提升递归性能）
@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(100))  # 快速计算
print(fibonacci.cache_info())  # 查看缓存信息

# 自定义装饰器
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
    time.sleep(1)
    return "完成"

slow_function()
```

### 7.4 datetime - 日期时间

```python
from datetime import datetime, date, time, timedelta

# 当前日期时间
now = datetime.now()
print(now)  # 2024-01-15 14:30:45.123456

# 创建特定日期
birthday = datetime(1995, 5, 20, 10, 30)
print(birthday)

# 日期格式化
formatted = now.strftime("%Y年%m月%d日 %H:%M:%S")
print(formatted)  # 2024年01月15日 14:30:45

# 字符串解析
date_str = "2024-01-15"
parsed_date = datetime.strptime(date_str, "%Y-%m-%d")
print(parsed_date)

# 日期计算
tomorrow = now + timedelta(days=1)
next_week = now + timedelta(weeks=1)
one_hour_later = now + timedelta(hours=1)

# 日期比较
date1 = datetime(2024, 1, 15)
date2 = datetime(2024, 1, 20)
print(date2 > date1)  # True

# 时间差
diff = date2 - date1
print(f"相差 {diff.days} 天")

# 实用函数
def age_calculator(birth_date):
    """计算年龄"""
    today = date.today()
    age = today.year - birth_date.year
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1
    return age

birth = date(1995, 5, 20)
print(f"年龄: {age_calculator(birth)} 岁")
```

### 7.5 re - 正则表达式

```python
import re

# 基本匹配
text = "我的邮箱是 alice@example.com 和 bob@test.org"
emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
print(emails)  # ['alice@example.com', 'bob@test.org']

# 手机号验证
def validate_phone(phone):
    pattern = r'^1[3-9]\d{9}$'
    return bool(re.match(pattern, phone))

print(validate_phone("13812345678"))  # True
print(validate_phone("12345678901"))  # False

# 替换操作
text = "今天是2024年1月15日"
replaced = re.sub(r'\d{4}年\d{1,2}月\d{1,2}日', '某天', text)
print(replaced)  # 今天是某天

# 分组捕获
url = "https://www.example.com:8080/path/to/resource"
pattern = r'(https?)://([^:]+):(\d+)(/.+)'
match = re.match(pattern, url)
if match:
    print(f"协议: {match.group(1)}")  # https
    print(f"域名: {match.group(2)}")  # www.example.com
    print(f"端口: {match.group(3)}")  # 8080
    print(f"路径: {match.group(4)}")  # /path/to/resource

# 常用正则表达式模式
patterns = {
    '邮箱': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
    '手机号': r'^1[3-9]\d{9}$',
    'URL': r'https?://[^\s]+',
    '身份证': r'^\d{17}[\dXx]$',
    'IP地址': r'^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$'
}
```

### 7.6 os与pathlib - 文件系统操作

```python
import os
from pathlib import Path

# os模块基本操作
current_dir = os.getcwd()  # 当前工作目录
print(f"当前目录: {current_dir}")

# 创建目录
os.makedirs('data/temp', exist_ok=True)

# 列出文件
files = os.listdir('.')
print(f"当前目录文件: {files[:5]}")

# 路径操作
full_path = os.path.join('data', 'temp', 'file.txt')
print(f"完整路径: {full_path}")

# pathlib（更优雅的方式）
path = Path('data/temp')
path.mkdir(parents=True, exist_ok=True)

# 创建文件
file_path = path / 'test.txt'
file_path.write_text('Hello, Python!', encoding='utf-8')

# 读取文件
content = file_path.read_text(encoding='utf-8')
print(content)

# 遍历文件
for file in Path('.').glob('*.py'):
    print(f"Python文件: {file.name}, 大小: {file.stat().st_size} 字节")

# 文件信息
if file_path.exists():
    print(f"是文件: {file_path.is_file()}")
    print(f"是目录: {file_path.is_dir()}")
    print(f"文件名: {file_path.name}")
    print(f"扩展名: {file_path.suffix}")
    print(f"父目录: {file_path.parent}")
```

---

**本章完**
