# Python编程 - (八)高级编程技巧

掌握装饰器、生成器等高级特性。

---

## 8. 高级编程技巧

### 8.1 装饰器深入

```python
# 带参数的装饰器
def repeat(times):
    """重复执行装饰器"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            results = []
            for _ in range(times):
                result = func(*args, **kwargs)
                results.append(result)
            return results
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))  # ['Hello, Alice!', 'Hello, Alice!', 'Hello, Alice!']

# 类装饰器
class CountCalls:
    """统计函数调用次数"""
    def __init__(self, func):
        self.func = func
        self.count = 0
    
    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"{self.func.__name__} 被调用 {self.count} 次")
        return self.func(*args, **kwargs)

@CountCalls
def say_hello():
    return "Hello!"

say_hello()  # say_hello 被调用 1 次
say_hello()  # say_hello 被调用 2 次

# 多个装饰器组合
def bold(func):
    def wrapper(*args, **kwargs):
        return f"<b>{func(*args, **kwargs)}</b>"
    return wrapper

def italic(func):
    def wrapper(*args, **kwargs):
        return f"<i>{func(*args, **kwargs)}</i>"
    return wrapper

@bold
@italic
def get_text():
    return "Hello"

print(get_text())  # <b><i>Hello</i></b>
```

### 8.2 生成器与协程

```python
# 生成器表达式
squares = (x**2 for x in range(10))
print(next(squares))  # 0
print(next(squares))  # 1

# 自定义生成器
def fibonacci_generator(n):
    """斐波那契数列生成器"""
    a, b = 0, 1
    count = 0
    while count < n:
        yield a
        a, b = b, a + b
        count += 1

for num in fibonacci_generator(10):
    print(num, end=' ')  # 0 1 1 2 3 5 8 13 21 34
print()

# 生成器的send方法
def echo_generator():
    """回显生成器"""
    while True:
        received = yield
        print(f"收到: {received}")

gen = echo_generator()
next(gen)  # 启动生成器
gen.send("Hello")  # 收到: Hello
gen.send("World")  # 收到: World

# 读取大文件（节省内存）
def read_large_file(file_path):
    """逐行读取大文件"""
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            yield line.strip()

# 使用示例
# for line in read_large_file('large_data.txt'):
#     process(line)
```

### 8.3 上下文管理器

```python
from contextlib import contextmanager

# 自定义上下文管理器（类方式）
class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        self.file = open(self.filename, self.mode, encoding='utf-8')
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()
        return False  # 不抑制异常

# 使用
with FileManager('test.txt', 'w') as f:
    f.write('Hello, Context Manager!')

# 使用装饰器创建上下文管理器
@contextmanager
def timer_context():
    """计时上下文管理器"""
    import time
    start = time.time()
    yield
    end = time.time()
    print(f"执行时间: {end - start:.4f}秒")

with timer_context():
    # 需要计时的代码
    import time
    time.sleep(0.5)

# 数据库连接上下文管理器示例
@contextmanager
def database_connection(db_name):
    """数据库连接管理"""
    # 模拟连接
    print(f"连接到数据库: {db_name}")
    connection = {'db': db_name, 'connected': True}
    try:
        yield connection
    finally:
        print(f"关闭数据库连接: {db_name}")
        connection['connected'] = False

with database_connection('mydb') as conn:
    print(f"使用连接: {conn}")
```

### 8.4 并发编程

```python
import threading
import multiprocessing
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import time

# 多线程
def worker_thread(name, delay):
    """线程工作函数"""
    print(f"线程 {name} 开始")
    time.sleep(delay)
    print(f"线程 {name} 完成")
    return f"{name} 的结果"

# 创建线程
threads = []
for i in range(3):
    t = threading.Thread(target=worker_thread, args=(f"Thread-{i}", 1))
    threads.append(t)
    t.start()

# 等待所有线程完成
for t in threads:
    t.join()

# 线程池（更推荐）
def process_item(item):
    """处理单个项目"""
    time.sleep(0.5)
    return item * 2

items = [1, 2, 3, 4, 5]

with ThreadPoolExecutor(max_workers=3) as executor:
    results = list(executor.map(process_item, items))
    print(f"线程池结果: {results}")

# 多进程（CPU密集型任务）
def cpu_intensive_task(n):
    """CPU密集型任务"""
    result = 0
    for i in range(n):
        result += i ** 2
    return result

if __name__ == '__main__':  # Windows需要这个保护
    with ProcessPoolExecutor(max_workers=4) as executor:
        tasks = [1000000, 2000000, 3000000, 4000000]
        results = list(executor.map(cpu_intensive_task, tasks))
        print(f"进程池结果: {results[:2]}")  # 打印前两个

# 异步编程（asyncio）
import asyncio

async def async_task(name, delay):
    """异步任务"""
    print(f"任务 {name} 开始")
    await asyncio.sleep(delay)
    print(f"任务 {name} 完成")
    return f"{name} 的结果"

async def main():
    """主异步函数"""
    tasks = [
        async_task("Task-1", 1),
        async_task("Task-2", 2),
        async_task("Task-3", 1)
    ]
    results = await asyncio.gather(*tasks)
    print(f"异步结果: {results}")

# 运行异步程序
# asyncio.run(main())
```

---

**本章完**
