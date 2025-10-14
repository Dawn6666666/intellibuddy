# Python编程 - (九)数据分析实战

用Pandas进行数据分析实战。

---

## 9.1 NumPy数组操作

```python
import numpy as np

# 创建数组
arr1 = np.array([1, 2, 3, 4, 5])
arr2 = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]
arr3 = np.linspace(0, 1, 5)  # [0, 0.25, 0.5, 0.75, 1]
zeros = np.zeros((3, 4))     # 3x4 零矩阵
ones = np.ones((2, 3))       # 2x3 全1矩阵
identity = np.eye(4)         # 4x4 单位矩阵

# 随机数
random_arr = np.random.random((3, 3))        # 0-1之间的随机数
random_int = np.random.randint(1, 100, 10)   # 1-100的随机整数
normal_dist = np.random.normal(0, 1, 1000)   # 正态分布

# 数组操作
arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print(f"形状: {arr.shape}")      # (3, 3)
print(f"维度: {arr.ndim}")       # 2
print(f"大小: {arr.size}")       # 9
print(f"数据类型: {arr.dtype}")  # int64

# 索引和切片
print(arr[0, 1])      # 2
print(arr[1:, :2])    # [[4, 5], [7, 8]]
print(arr[arr > 5])   # [6, 7, 8, 9]

# 数学运算
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

print(a + b)          # [5, 7, 9]
print(a * b)          # [4, 10, 18]
print(np.dot(a, b))   # 32 (点积)

# 统计函数
data = np.random.randint(1, 100, 20)
print(f"均值: {np.mean(data):.2f}")
print(f"中位数: {np.median(data):.2f}")
print(f"标准差: {np.std(data):.2f}")
print(f"最大值: {np.max(data)}")
print(f"最小值: {np.min(data)}")

# 矩阵运算
matrix_a = np.array([[1, 2], [3, 4]])
matrix_b = np.array([[5, 6], [7, 8]])

print("矩阵乘法:")
print(np.matmul(matrix_a, matrix_b))

print("转置:")
print(matrix_a.T)

print("行列式:")
print(np.linalg.det(matrix_a))

print("逆矩阵:")
print(np.linalg.inv(matrix_a))
```

### 9.2 Pandas数据处理

```python
import pandas as pd
import numpy as np

# 创建DataFrame
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
    'age': [25, 30, 35, 28, 32],
    'city': ['北京', '上海', '北京', '深圳', '上海'],
    'salary': [50000, 60000, 70000, 55000, 65000]
}

df = pd.DataFrame(data)
print(df)
print("\n")

# 基本信息
print(df.info())
print(df.describe())
print(f"列名: {df.columns.tolist()}")

# 数据选择
print("\n选择列:")
print(df['name'])
print(df[['name', 'salary']])

print("\n选择行:")
print(df.loc[0])  # 按标签
print(df.iloc[0])  # 按位置

print("\n条件筛选:")
high_salary = df[df['salary'] > 55000]
print(high_salary)

beijing_people = df[df['city'] == '北京']
print(beijing_people)

# 数据操作
df['bonus'] = df['salary'] * 0.1  # 新增列
df['total_income'] = df['salary'] + df['bonus']

# 排序
df_sorted = df.sort_values('salary', ascending=False)
print("\n按薪资排序:")
print(df_sorted)

# 分组统计
print("\n按城市分组:")
city_stats = df.groupby('city')['salary'].agg(['mean', 'max', 'min'])
print(city_stats)

# 数据清洗
df_with_na = pd.DataFrame({
    'A': [1, 2, np.nan, 4],
    'B': [5, np.nan, np.nan, 8],
    'C': [9, 10, 11, 12]
})

print("\n处理缺失值:")
print(df_with_na.fillna(0))  # 填充0
print(df_with_na.dropna())    # 删除含NaN的行

# 数据合并
df1 = pd.DataFrame({
    'id': [1, 2, 3],
    'name': ['Alice', 'Bob', 'Charlie']
})

df2 = pd.DataFrame({
    'id': [1, 2, 4],
    'score': [95, 88, 92]
})

# 合并
merged = pd.merge(df1, df2, on='id', how='inner')
print("\n合并数据:")
print(merged)

# 读写文件
# df.to_csv('data.csv', index=False, encoding='utf-8')
# df_loaded = pd.read_csv('data.csv', encoding='utf-8')
# df.to_excel('data.xlsx', index=False)
# df_excel = pd.read_excel('data.xlsx')
```

### 9.3 数据可视化进阶

```python
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# 设置样式
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")

# 子图布局
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# 1. 折线图
x = np.linspace(0, 10, 100)
axes[0, 0].plot(x, np.sin(x), label='sin(x)', linewidth=2)
axes[0, 0].plot(x, np.cos(x), label='cos(x)', linewidth=2)
axes[0, 0].set_title('三角函数', fontsize=14, fontweight='bold')
axes[0, 0].set_xlabel('X轴')
axes[0, 0].set_ylabel('Y轴')
axes[0, 0].legend()
axes[0, 0].grid(True, alpha=0.3)

# 2. 散点图
n = 50
x_scatter = np.random.randn(n)
y_scatter = 2 * x_scatter + np.random.randn(n)
colors = np.random.rand(n)
sizes = 100 * np.random.rand(n)

axes[0, 1].scatter(x_scatter, y_scatter, c=colors, s=sizes, alpha=0.6, cmap='viridis')
axes[0, 1].set_title('散点图', fontsize=14, fontweight='bold')
axes[0, 1].set_xlabel('X值')
axes[0, 1].set_ylabel('Y值')

# 3. 柱状图
categories = ['Python', 'Java', 'C++', 'JavaScript', 'Go']
values = [85, 75, 65, 80, 70]
colors_bar = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']

axes[1, 0].barh(categories, values, color=colors_bar)
axes[1, 0].set_title('编程语言流行度', fontsize=14, fontweight='bold')
axes[1, 0].set_xlabel('流行度分数')

# 4. 饼图
sizes = [30, 25, 20, 15, 10]
labels = ['产品A', '产品B', '产品C', '产品D', '产品E']
explode = (0.1, 0, 0, 0, 0)  # 突出第一块

axes[1, 1].pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%',
               shadow=True, startangle=90)
axes[1, 1].set_title('市场份额分布', fontsize=14, fontweight='bold')

plt.tight_layout()
# plt.savefig('visualization.png', dpi=300, bbox_inches='tight')
# plt.show()

# 热力图
correlation_data = np.random.randn(10, 10)
plt.figure(figsize=(10, 8))
sns.heatmap(correlation_data, annot=True, fmt='.2f', cmap='coolwarm',
            center=0, square=True, linewidths=1)
plt.title('相关性热力图', fontsize=16, fontweight='bold')
# plt.show()

# 箱线图
data_box = [np.random.normal(0, std, 100) for std in range(1, 4)]
plt.figure(figsize=(8, 6))
plt.boxplot(data_box, labels=['组1', '组2', '组3'])
plt.title('箱线图示例', fontsize=14, fontweight='bold')
plt.ylabel('数值')
plt.grid(True, alpha=0.3)
# plt.show()
```

---

**本章完**
