# Python编程 - (四)文件操作与异常处理

掌握文件读写和异常处理机制。

---

## 4. 文件操作与异常处理

### 4.1 文件操作

```python
# 写入文件
with open('data.txt', 'w', encoding='utf-8') as file:
    file.write("Hello, Python!\n")
    file.write("文件操作示例\n")

# 读取文件
with open('data.txt', 'r', encoding='utf-8') as file:
    content = file.read()
    print(content)

# 逐行读取
with open('data.txt', 'r', encoding='utf-8') as file:
    for line in file:
        print(line.strip())

# JSON文件操作
import json

data = {
    "name": "Alice",
    "age": 25,
    "courses": ["Python", "数据结构"]
}

# 写入JSON
with open('student.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=2)

# 读取JSON
with open('student.json', 'r', encoding='utf-8') as file:
    student_data = json.load(file)
    print(student_data)
```

### 4.2 异常处理

```python
def divide_numbers(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("错误: 除数不能为零")
        return None
    except TypeError:
        print("错误: 参数必须是数字")
        return None
    except Exception as e:
        print(f"未知错误: {e}")
        return None
    else:
        print("计算成功")
    finally:
        print("函数执行完毕")

# 测试异常处理
print(divide_numbers(10, 2))    # 正常情况
print(divide_numbers(10, 0))    # 除零错误
print(divide_numbers("10", 2))  # 类型错误

# 自定义异常
class CustomError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

def validate_age(age):
    if age < 0:
        raise CustomError("年龄不能为负数")
    if age > 150:
        raise CustomError("年龄不能超过150岁")
    return True

try:
    validate_age(-5)
except CustomError as e:
    print(f"验证失败: {e.message}")
```

### 4.3 CSV文件处理

```python
import csv

# 写入CSV文件
data = [
    ['姓名', '年龄', '城市'],
    ['Alice', 25, '北京'],
    ['Bob', 30, '上海'],
    ['Charlie', 35, '深圳']
]

# 方法1：使用writer
with open('students.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerows(data)

# 方法2：使用DictWriter（推荐）
students = [
    {'name': 'Alice', 'age': 25, 'city': '北京'},
    {'name': 'Bob', 'age': 30, 'city': '上海'},
    {'name': 'Charlie', 'age': 35, 'city': '深圳'}
]

with open('students_dict.csv', 'w', newline='', encoding='utf-8') as file:
    fieldnames = ['name', 'age', 'city']
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    
    writer.writeheader()  # 写入表头
    writer.writerows(students)

# 读取CSV文件
# 方法1：使用reader
with open('students.csv', 'r', encoding='utf-8') as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# 方法2：使用DictReader（推荐）
with open('students_dict.csv', 'r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(f"{row['name']}, {row['age']}岁, 来自{row['city']}")

# CSV文件处理实用函数
def read_csv_to_dict(filename):
    """读取CSV文件为字典列表"""
    with open(filename, 'r', encoding='utf-8') as file:
        return list(csv.DictReader(file))

def write_dict_to_csv(filename, data, fieldnames):
    """将字典列表写入CSV文件"""
    with open(filename, 'w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)
```

### 4.4 JSON文件进阶

```python
import json
from datetime import datetime

# 复杂JSON数据
complex_data = {
    "user": {
        "id": 1,
        "name": "Alice",
        "email": "alice@example.com",
        "roles": ["admin", "user"],
        "metadata": {
            "last_login": "2024-01-15T10:30:00",
            "login_count": 42
        }
    },
    "posts": [
        {
            "id": 1,
            "title": "Python学习笔记",
            "content": "今天学习了文件操作...",
            "tags": ["python", "学习"],
            "published": True
        },
        {
            "id": 2,
            "title": "数据结构复习",
            "content": "复习了树和图...",
            "tags": ["数据结构", "算法"],
            "published": False
        }
    ]
}

# 写入JSON（美化格式）
with open('data.json', 'w', encoding='utf-8') as file:
    json.dump(complex_data, file, ensure_ascii=False, indent=2)

# 读取JSON
with open('data.json', 'r', encoding='utf-8') as file:
    loaded_data = json.load(file)
    print(f"用户名: {loaded_data['user']['name']}")
    print(f"文章数: {len(loaded_data['posts'])}")

# JSON字符串操作
json_string = json.dumps(complex_data, ensure_ascii=False, indent=2)
parsed_data = json.loads(json_string)

# 自定义JSON编码器（处理日期时间）
class DateTimeEncoder(json.JSONEncoder):
    """自定义JSON编码器"""
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

data_with_datetime = {
    "event": "登录",
    "timestamp": datetime.now(),
    "user_id": 123
}

json_str = json.dumps(data_with_datetime, cls=DateTimeEncoder, ensure_ascii=False)
print(json_str)

# JSON配置文件示例
config = {
    "database": {
        "host": "localhost",
        "port": 3306,
        "username": "root",
        "password": "secret"
    },
    "app": {
        "debug": True,
        "log_level": "INFO",
        "max_connections": 100
    }
}

def save_config(filename, config):
    """保存配置文件"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)

def load_config(filename):
    """加载配置文件"""
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)
```

### 4.5 上下文管理器

```python
from contextlib import contextmanager

# 自定义上下文管理器（类方式）
class FileManager:
    """文件管理器"""
    
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        """进入上下文"""
        self.file = open(self.filename, self.mode, encoding='utf-8')
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """退出上下文"""
        if self.file:
            self.file.close()
        
        # 处理异常
        if exc_type is not None:
            print(f"发生异常: {exc_type.__name__}: {exc_val}")
        
        return False  # False表示不抑制异常

# 使用
with FileManager('test.txt', 'w') as f:
    f.write('Hello, Context Manager!')

# 使用装饰器创建上下文管理器
@contextmanager
def timer():
    """计时上下文管理器"""
    import time
    start = time.time()
    yield
    end = time.time()
    print(f"执行时间: {end - start:.4f}秒")

with timer():
    # 需要计时的代码
    import time
    time.sleep(0.5)

# 数据库连接上下文管理器
@contextmanager
def database_connection(db_name):
    """数据库连接管理"""
    print(f"连接到数据库: {db_name}")
    connection = {'db': db_name, 'connected': True}
    
    try:
        yield connection
    except Exception as e:
        print(f"数据库操作失败: {e}")
        # 回滚操作
        connection['rollback'] = True
        raise
    finally:
        print(f"关闭数据库连接: {db_name}")
        connection['connected'] = False

# 使用
with database_connection('mydb') as conn:
    print(f"使用连接: {conn}")
    # 执行数据库操作

# 文件锁上下文管理器
@contextmanager
def file_lock(filename):
    """文件锁管理器"""
    lock_file = f"{filename}.lock"
    
    # 获取锁
    with open(lock_file, 'w') as f:
        f.write('locked')
    
    try:
        yield lock_file
    finally:
        # 释放锁
        import os
        if os.path.exists(lock_file):
            os.remove(lock_file)

# 使用
with file_lock('data.txt'):
    # 在这里安全地操作文件
    print("文件已锁定，可以安全操作")
```

### 4.6 异常处理最佳实践

```python
# 1. 具体的异常处理
def divide(a, b):
    """除法运算"""
    try:
        result = a / b
    except ZeroDivisionError:
        print("错误: 除数不能为零")
        return None
    except TypeError:
        print("错误: 参数必须是数字")
        return None
    else:
        print("计算成功")
        return result
    finally:
        print("函数执行完毕")

# 2. 异常链
def process_data(data):
    """处理数据"""
    try:
        result = int(data) / 10
    except ValueError as e:
        raise TypeError("数据格式错误") from e
    except ZeroDivisionError as e:
        raise RuntimeError("计算错误") from e
    return result

# 3. 自定义异常层次结构
class AppError(Exception):
    """应用基础异常"""
    pass

class ValidationError(AppError):
    """验证错误"""
    pass

class DatabaseError(AppError):
    """数据库错误"""
    pass

class NetworkError(AppError):
    """网络错误"""
    pass

# 使用自定义异常
def validate_user(user_data):
    """验证用户数据"""
    if 'username' not in user_data:
        raise ValidationError("缺少用户名")
    
    if len(user_data['username']) < 3:
        raise ValidationError("用户名长度不能少于3个字符")
    
    return True

try:
    validate_user({'username': 'ab'})
except ValidationError as e:
    print(f"验证失败: {e}")
except AppError as e:
    print(f"应用错误: {e}")

# 4. 异常重试机制
def retry(max_attempts=3, delay=1):
    """重试装饰器"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            import time
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    print(f"尝试 {attempt + 1} 失败: {e}")
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=0.5)
def unreliable_function():
    """不可靠的函数"""
    import random
    if random.random() < 0.7:
        raise ConnectionError("连接失败")
    return "成功"

# 5. 警告处理
import warnings

def deprecated_function():
    """已弃用的函数"""
    warnings.warn("此函数已弃用，请使用new_function", DeprecationWarning)
    return "旧功能"

# 忽略特定警告
warnings.filterwarnings('ignore', category=DeprecationWarning)
```

---

**本章完**
