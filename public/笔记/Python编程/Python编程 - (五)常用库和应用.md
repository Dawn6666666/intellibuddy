# Python编程 - (五)常用库和应用

学习NumPy、Pandas等常用库。

---

## 5.1 数据处理

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

---

**本章完**
