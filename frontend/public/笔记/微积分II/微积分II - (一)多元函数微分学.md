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

### 1.5 方向导数与梯度的几何意义

**方向导数定义**：

$$
D_{\mathbf{u}}f(x_0, y_0) = \lim_{t \to 0} \frac{f(x_0 + t u_1, y_0 + t u_2) - f(x_0, y_0)}{t}
$$

其中 $\mathbf{u} = (u_1, u_2)$ 是单位方向向量。

**与梯度的关系**：

$$
D_{\mathbf{u}}f = \nabla f \cdot \mathbf{u} = \|\nabla f\| \cos \theta
$$

**性质**：

1. 梯度方向是函数增长最快的方向
2. 梯度大小是最大方向导数的值
3. 梯度垂直于等高线

**示例：登山路径优化**

```python
def gradient_path_visualization():
    """可视化梯度方向与等高线"""
    import matplotlib.pyplot as plt
    from mpl_toolkits.mplot3d import Axes3D
    
    # 定义函数 f(x,y) = x² + 2y²
    def f(x, y):
        return x**2 + 2*y**2
    
    def grad_f(x, y):
        return np.array([2*x, 4*y])
    
    # 创建网格
    x = np.linspace(-3, 3, 100)
    y = np.linspace(-3, 3, 100)
    X, Y = np.meshgrid(x, y)
    Z = f(X, Y)
    
    # 绘制等高线
    plt.figure(figsize=(12, 5))
    
    plt.subplot(121)
    contour = plt.contour(X, Y, Z, levels=15)
    plt.clabel(contour, inline=True, fontsize=8)
    
    # 绘制梯度向量场
    x_sparse = np.linspace(-3, 3, 15)
    y_sparse = np.linspace(-3, 3, 15)
    X_sparse, Y_sparse = np.meshgrid(x_sparse, y_sparse)
    
    U = 2 * X_sparse
    V = 4 * Y_sparse
    plt.quiver(X_sparse, Y_sparse, U, V, color='red', alpha=0.6)
    
    plt.title('梯度场与等高线')
    plt.xlabel('x')
    plt.ylabel('y')
    plt.axis('equal')
    plt.grid(True)
    
    # 3D曲面
    ax = plt.subplot(122, projection='3d')
    ax.plot_surface(X, Y, Z, cmap='viridis', alpha=0.7)
    ax.set_xlabel('x')
    ax.set_ylabel('y')
    ax.set_zlabel('f(x,y)')
    ax.set_title('函数曲面')
    
    plt.tight_layout()
    plt.show()

gradient_path_visualization()
```

### 1.6 Jacobian矩阵与变量替换

**Jacobian矩阵**：多元函数的"导数矩阵"

$$
J = \begin{bmatrix}
\frac{\partial f_1}{\partial x_1} & \cdots & \frac{\partial f_1}{\partial x_n} \\
\vdots & \ddots & \vdots \\
\frac{\partial f_m}{\partial x_1} & \cdots & \frac{\partial f_m}{\partial x_n}
\end{bmatrix}
$$

**坐标变换中的Jacobian行列式**：

极坐标变换 $(x, y) \to (r, \theta)$：

$$
J = \begin{vmatrix}
\frac{\partial x}{\partial r} & \frac{\partial x}{\partial \theta} \\
\frac{\partial y}{\partial r} & \frac{\partial y}{\partial \theta}
\end{vmatrix} = \begin{vmatrix}
\cos\theta & -r\sin\theta \\
\sin\theta & r\cos\theta
\end{vmatrix} = r
$$

因此 $dx \, dy = r \, dr \, d\theta$

**Python计算Jacobian**：

```python
import sympy as sp

def compute_jacobian():
    """符号计算Jacobian矩阵"""
    # 定义符号变量
    r, theta = sp.symbols('r theta', real=True, positive=True)
    
    # 极坐标变换
    x = r * sp.cos(theta)
    y = r * sp.sin(theta)
    
    # 计算Jacobian
    J = sp.Matrix([[x, y]]).jacobian([r, theta])
    
    print("Jacobian矩阵:")
    sp.pprint(J)
    
    print("\nJacobian行列式:")
    det_J = J.det()
    sp.pprint(det_J)
    
    # 数值验证
    J_func = sp.lambdify((r, theta), det_J, 'numpy')
    print(f"\n在 r=2, θ=π/4 处: J = {J_func(2, np.pi/4)}")

compute_jacobian()
```

### 1.7 多元泰勒展开

**二元泰勒公式**：

$$
f(x, y) = f(a, b) + \left[ f_x(a,b)(x-a) + f_y(a,b)(y-b) \right]
$$

$$
+ \frac{1}{2!} \left[ f_{xx}(a,b)(x-a)^2 + 2f_{xy}(a,b)(x-a)(y-b) + f_{yy}(a,b)(y-b)^2 \right] + \cdots
$$

**二阶近似（Hessian矩阵）**：

$$
f(\mathbf{x}) \approx f(\mathbf{x}_0) + \nabla f(\mathbf{x}_0)^T (\mathbf{x} - \mathbf{x}_0) + \frac{1}{2} (\mathbf{x} - \mathbf{x}_0)^T H(\mathbf{x}_0) (\mathbf{x} - \mathbf{x}_0)
$$

**应用：牛顿法优化**

```python
def newton_method(grad_f, hessian_f, x0, max_iter=50, tol=1e-6):
    """
    牛顿法多元优化
    grad_f: 梯度函数
    hessian_f: Hessian矩阵函数
    """
    x = x0.copy()
    history = [x.copy()]
    
    for i in range(max_iter):
        grad = grad_f(x)
        H = hessian_f(x)
        
        # 牛顿方向：H^(-1) * grad
        try:
            direction = np.linalg.solve(H, -grad)
        except:
            print("Hessian矩阵奇异，退出")
            break
        
        x = x + direction
        history.append(x.copy())
        
        if np.linalg.norm(grad) < tol:
            print(f"在第{i+1}次迭代收敛")
            break
    
    return x, history

# 示例：最小化 f(x,y) = x² + xy + y² - 2x - y
def f(x):
    return x[0]**2 + x[0]*x[1] + x[1]**2 - 2*x[0] - x[1]

def grad_f(x):
    return np.array([
        2*x[0] + x[1] - 2,
        x[0] + 2*x[1] - 1
    ])

def hessian_f(x):
    return np.array([
        [2, 1],
        [1, 2]
    ])

x0 = np.array([0.0, 0.0])

# 梯度下降 vs 牛顿法
x_gd, hist_gd = gradient_descent(f, grad_f, x0, learning_rate=0.1, iterations=100)
x_newton, hist_newton = newton_method(grad_f, hessian_f, x0)

print(f"梯度下降: {len(hist_gd)} 次迭代, 最优点 {x_gd}")
print(f"牛顿法: {len(hist_newton)} 次迭代, 最优点 {x_newton}")
```

### 1.8 隐函数定理与反函数定理

**隐函数定理**：

若 $F(x, y, z) = 0$ 确定了 $z = z(x, y)$，则：

$$
\frac{\partial z}{\partial x} = -\frac{F_x}{F_z}, \quad \frac{\partial z}{\partial y} = -\frac{F_y}{F_z}
$$

（条件：$F_z \neq 0$）

**示例**：求 $x^2 + y^2 + z^2 = 1$ 确定的 $z = z(x, y)$ 的偏导数

$$
F = x^2 + y^2 + z^2 - 1
$$

$$
\frac{\partial z}{\partial x} = -\frac{2x}{2z} = -\frac{x}{z}, \quad \frac{\partial z}{\partial y} = -\frac{2y}{2z} = -\frac{y}{z}
$$

**反函数定理**：

若 $\mathbf{F}: \mathbb{R}^n \to \mathbb{R}^n$ 的Jacobian矩阵可逆，则存在局部反函数，且：

$$
J_{\mathbf{F}^{-1}} = (J_{\mathbf{F}})^{-1}
$$

---

**本章完**
