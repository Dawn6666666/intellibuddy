# Python编程 - (五)常用库和应用

学习NumPy、Pandas等常用库。

---

## 5. 常用库和应用

### 5.1 数据处理

```python
# 使用pandas处理数据
import pandas as pd
import numpy as np

# 创建DataFrame
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'Diana'],
    'age': [25, 30, 35, 28],
    'salary': [50000, 60000, 70000, 55000]
}

df = pd.DataFrame(data)
print(df)

# 数据分析
print(f"平均年龄: {df['age'].mean()}")
print(f"最高薪资: {df['salary'].max()}")

# 数据筛选
high_salary = df[df['salary'] > 55000]
print(high_salary)

# 数据排序
df_sorted = df.sort_values('age', ascending=False)
print(df_sorted)
```

### 5.2 Web开发

```python
# Flask Web应用示例
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return '<h1>欢迎使用Python Web应用!</h1>'

@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    # 模拟用户数据
    user = {
        'id': user_id,
        'name': f'User{user_id}',
        'email': f'user{user_id}@example.com'
    }
    return jsonify(user)

@app.route('/api/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    a = data.get('a', 0)
    b = data.get('b', 0)
    operation = data.get('operation', 'add')
    
    if operation == 'add':
        result = a + b
    elif operation == 'multiply':
        result = a * b
    else:
        result = 0
    
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)
```

### 5.3 数据可视化

```python
import matplotlib.pyplot as plt
import seaborn as sns

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

# 简单折线图
x = range(1, 11)
y = [i**2 for i in x]

plt.figure(figsize=(10, 6))
plt.plot(x, y, marker='o')
plt.title('平方数增长图')
plt.xlabel('X值')
plt.ylabel('Y值')
plt.grid(True)
plt.show()

# 柱状图
categories = ['Python', 'Java', 'C++', 'JavaScript']
popularity = [85, 75, 65, 80]

plt.figure(figsize=(8, 6))
plt.bar(categories, popularity, color=['blue', 'orange', 'green', 'red'])
plt.title('编程语言流行度')
plt.ylabel('流行度分数')
plt.show()

# 使用seaborn绘制更美观的图表
tips = sns.load_dataset('tips')
plt.figure(figsize=(10, 6))
sns.scatterplot(data=tips, x='total_bill', y='tip', hue='day')
plt.title('账单与小费关系图')
plt.show()
```

### 5.4 日期时间处理

```python
from datetime import datetime, timedelta
import time

# 获取当前时间
now = datetime.now()
print(f"当前时间: {now}")
print(f"年: {now.year}, 月: {now.month}, 日: {now.day}")
print(f"时: {now.hour}, 分: {now.minute}, 秒: {now.second}")

# 格式化日期时间
formatted = now.strftime("%Y-%m-%d %H:%M:%S")
print(f"格式化: {formatted}")

# 解析字符串为日期
date_str = "2024-01-15 14:30:00"
parsed = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
print(f"解析: {parsed}")

# 日期计算
tomorrow = now + timedelta(days=1)
next_week = now + timedelta(weeks=1)
one_hour_ago = now - timedelta(hours=1)

print(f"明天: {tomorrow.strftime('%Y-%m-%d')}")
print(f"下周: {next_week.strftime('%Y-%m-%d')}")

# 时间戳
timestamp = time.time()
print(f"时间戳: {timestamp}")

# 时间戳转日期
dt = datetime.fromtimestamp(timestamp)
print(f"时间戳转日期: {dt}")

# 计算时间差
start = datetime(2024, 1, 1)
end = datetime(2024, 12, 31)
diff = end - start
print(f"相差 {diff.days} 天")

# 实用函数
def get_age(birth_date):
    """计算年龄"""
    from datetime import date
    today = date.today()
    age = today.year - birth_date.year
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1
    return age

birth = datetime(1995, 5, 20)
print(f"年龄: {get_age(birth)} 岁")
```

### 5.5 正则表达式应用

```python
import re

# 邮箱验证
def validate_email(email):
    """验证邮箱格式"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

print(validate_email("alice@example.com"))  # True
print(validate_email("invalid-email"))      # False

# 手机号提取
text = "联系方式：13812345678 或 13987654321"
phones = re.findall(r'1[3-9]\d{9}', text)
print(f"手机号: {phones}")  # ['13812345678', '13987654321']

# URL提取
text = "访问 https://www.python.org 和 http://github.com"
urls = re.findall(r'https?://[^\s]+', text)
print(f"URL: {urls}")

# 替换敏感词
text = "这是一个测试，包含敏感词和违禁词"
cleaned = re.sub(r'(敏感词|违禁词)', '***', text)
print(cleaned)

# 分组捕获
log = "2024-01-15 14:30:45 [ERROR] Database connection failed"
pattern = r'(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) \[(\w+)\] (.+)'
match = re.match(pattern, log)

if match:
    date, time, level, message = match.groups()
    print(f"日期: {date}")
    print(f"时间: {time}")
    print(f"级别: {level}")
    print(f"消息: {message}")

# 实用正则表达式
patterns = {
    '中文': r'[\u4e00-\u9fa5]+',
    '数字': r'\d+',
    '邮箱': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
    'IP地址': r'\b(?:\d{1,3}\.){3}\d{1,3}\b',
    '身份证': r'\d{17}[\dXx]',
    'URL': r'https?://[^\s]+'
}
```

### 5.6 HTTP请求

```python
import requests

# GET请求
response = requests.get('https://api.github.com')
print(f"状态码: {response.status_code}")
print(f"响应头: {response.headers['Content-Type']}")
print(f"响应体: {response.text[:100]}")  # 前100个字符

# 带参数的GET请求
params = {'q': 'python', 'sort': 'stars'}
response = requests.get('https://api.github.com/search/repositories', params=params)
data = response.json()
print(f"找到 {data['total_count']} 个仓库")

# POST请求
data = {
    'username': 'alice',
    'email': 'alice@example.com'
}
response = requests.post('https://httpbin.org/post', json=data)
print(response.json())

# 带请求头
headers = {
    'User-Agent': 'Mozilla/5.0',
    'Authorization': 'Bearer token123'
}
response = requests.get('https://api.example.com', headers=headers)

# 超时设置
try:
    response = requests.get('https://httpbin.org/delay/10', timeout=5)
except requests.Timeout:
    print("请求超时")

# 会话管理（保持cookies）
session = requests.Session()
session.get('https://httpbin.org/cookies/set/sessioncookie/123')
response = session.get('https://httpbin.org/cookies')
print(response.json())

# 下载文件
url = 'https://www.python.org/static/img/python-logo.png'
response = requests.get(url)
with open('python-logo.png', 'wb') as f:
    f.write(response.content)
print("文件下载完成")
```

### 5.7 命令行参数处理

```python
import argparse

# 创建解析器
parser = argparse.ArgumentParser(
    description='Python脚本示例',
    epilog='感谢使用！'
)

# 添加参数
parser.add_argument('input', help='输入文件路径')
parser.add_argument('-o', '--output', help='输出文件路径', default='output.txt')
parser.add_argument('-v', '--verbose', action='store_true', help='详细输出')
parser.add_argument('-n', '--number', type=int, default=10, help='数字参数')
parser.add_argument('--format', choices=['json', 'csv', 'xml'], default='json')

# 解析参数
# args = parser.parse_args()
# print(f"输入文件: {args.input}")
# print(f"输出文件: {args.output}")
# print(f"详细模式: {args.verbose}")
# print(f"数字: {args.number}")
# print(f"格式: {args.format}")

# 使用示例
"""
python script.py input.txt -o output.txt -v -n 20 --format csv
"""

# 子命令示例
parser = argparse.ArgumentParser()
subparsers = parser.add_subparsers(dest='command')

# 添加子命令
add_parser = subparsers.add_parser('add', help='添加记录')
add_parser.add_argument('name', help='名称')
add_parser.add_argument('value', type=int, help='值')

delete_parser = subparsers.add_parser('delete', help='删除记录')
delete_parser.add_argument('id', type=int, help='记录ID')

# args = parser.parse_args()
# if args.command == 'add':
#     print(f"添加: {args.name} = {args.value}")
# elif args.command == 'delete':
#     print(f"删除: ID={args.id}")
```

### 5.8 环境变量和配置

```python
import os
from pathlib import Path

# 读取环境变量
home = os.getenv('HOME')  # Linux/Mac
user = os.getenv('USERNAME')  # Windows
path = os.getenv('PATH')

print(f"HOME: {home}")
print(f"USER: {user}")

# 设置环境变量
os.environ['MY_VAR'] = 'my_value'
print(os.getenv('MY_VAR'))

# 使用.env文件（需要python-dotenv库）
"""
# .env 文件内容
DATABASE_URL=postgresql://localhost/mydb
SECRET_KEY=my-secret-key
DEBUG=True
"""

# from dotenv import load_dotenv
# load_dotenv()  # 加载.env文件
# db_url = os.getenv('DATABASE_URL')
# secret = os.getenv('SECRET_KEY')
# debug = os.getenv('DEBUG') == 'True'

# 配置类
class Config:
    """应用配置"""
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///app.db')
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    MAX_CONNECTIONS = int(os.getenv('MAX_CONNECTIONS', '100'))

config = Config()
print(f"Debug模式: {config.DEBUG}")
print(f"数据库URL: {config.DATABASE_URL}")
```

---

**本章完**
