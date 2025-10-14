# 微积分II - (一)多元函数微分学

学习偏导数、梯度等多元微分概念。

---

## 1. 多元函数微分学

### 1.1 偏导数

**定义**：对一个变量求导，其他变量视为常数

$$
\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h, y) - f(x, y)}{h}
$$

**示例：**

$$
f(x, y) = x^2 + 3xy + y^2
$$

$$
\frac{\partial f}{\partial x} = 2x + 3y, \quad \frac{\partial f}{\partial y} = 3x + 2y
$$

**Python实现（数值偏导数）：**

```python
import numpy as np

def partial_derivative(f, x, i, h=1e-5):
    """
    计算函数f在点x处对第i个变量的偏导数
    f: 函数
    x: 点（数组）
    i: 变量索引
    h: 步长
    """
    x_plus = x.copy()
    x_plus[i] += h
    return (f(x_plus) - f(x)) / h

# 示例
def f(x):
    return x[0]**2 + 3*x[0]*x[1] + x[1]**2

x = np.array([1.0, 2.0])
df_dx = partial_derivative(f, x, 0)
df_dy = partial_derivative(f, x, 1)
print(f"∂f/∂x = {df_dx:.4f}")  # ≈ 8
print(f"∂f/∂y = {df_dy:.4f}")  # ≈ 7
```

### 1.2 梯度（Gradient）

**定义**：所有偏导数组成的向量

$$
\nabla f = \left( \frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, \frac{\partial f}{\partial z} \right)
$$

**性质**：梯度方向是函数增长最快的方向

**梯度下降算法（机器学习核心）：**

```python
def gradient_descent(f, grad_f, x0, learning_rate=0.01, iterations=100):
    """
    梯度下降优化
    f: 目标函数
    grad_f: 梯度函数
    x0: 初始点
    """
    x = x0.copy()
    history = [x.copy()]
    
    for _ in range(iterations):
        grad = grad_f(x)
        x = x - learning_rate * grad  # 沿负梯度方向
        history.append(x.copy())
    
    return x, history

# 示例：最小化 f(x,y) = x² + y²
def f(x):
    return x[0]**2 + x[1]**2

def grad_f(x):
    return np.array([2*x[0], 2*x[1]])

x0 = np.array([5.0, 5.0])
x_min, history = gradient_descent(f, grad_f, x0, learning_rate=0.1, iterations=50)
print(f"最小值点: {x_min}")  # 接近 [0, 0]

# 可视化
import matplotlib.pyplot as plt

history = np.array(history)
plt.plot(history[:, 0], history[:, 1], 'o-')
plt.xlabel('x')
plt.ylabel('y')
plt.title('梯度下降路径')
plt.grid()
plt.show()
```

### 1.3 多元函数极值

**无约束优化**：

临界点条件：

$$
\nabla f = \mathbf{0}
$$

**Hessian矩阵（二阶判别）：**

$$
H = \begin{bmatrix}
\frac{\partial^2 f}{\partial x^2} & \frac{\partial^2 f}{\partial x \partial y} \\
\frac{\partial^2 f}{\partial y \partial x} & \frac{\partial^2 f}{\partial y^2}
\end{bmatrix}
$$

- $\det(H) > 0, f_{xx} > 0$ → 极小值
- $\det(H) > 0, f_{xx} < 0$ → 极大值
- $\det(H) < 0$ → 鞍点

**示例：**

$$
f(x, y) = x^2 - xy + y^2 - 2x - y
$$

$$
\nabla f = (2x - y - 2, -x + 2y - 1) = (0, 0)
$$

解得：$(x, y) = (1, 1)$

$$
H = \begin{bmatrix} 2 & -1 \\ -1 & 2 \end{bmatrix}, \quad \det(H) = 3 > 0, f_{xx} = 2 > 0
$$

∴ $(1, 1)$ 是极小值点

### 1.4 拉格朗日乘数法

**约束优化问题**：

$$
\min f(x, y) \quad \text{s.t.} \quad g(x, y) = 0
$$

**拉格朗日函数**：

$$
\mathcal{L}(x, y, \lambda) = f(x, y) + \lambda g(x, y)
$$

**KKT条件**：

$$
\nabla_x \mathcal{L} = 0, \quad \nabla_y \mathcal{L} = 0, \quad \nabla_\lambda \mathcal{L} = 0
$$

**示例**：求 $f(x, y) = x^2 + y^2$ 在约束 $x + y = 1$ 下的极值

$$
\mathcal{L} = x^2 + y^2 + \lambda(x + y - 1)
$$

$$
\begin{cases}
2x + \lambda = 0 \\
2y + \lambda = 0 \\
x + y - 1 = 0
\end{cases}
\Rightarrow x = y = \frac{1}{2}, \lambda = -1
$$

**机器学习应用（SVM）：**

```python
from scipy.optimize import minimize

def lagrangian_optimization():
    """拉格朗日乘数法优化"""
    # 目标：最小化 f(x,y) = x² + y² 约束 x + y = 1
    
    def objective(X):
        x, y = X
        return x**2 + y**2
    
    def constraint(X):
        x, y = X
        return x + y - 1
    
    constraints = {'type': 'eq', 'fun': constraint}
    x0 = [0.0, 0.0]
    
    result = minimize(objective, x0, constraints=constraints)
    print(f"最优解: {result.x}")
    print(f"最优值: {result.fun}")

lagrangian_optimization()
```

---

**本章完**
