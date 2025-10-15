# 微积分II - (四)微分方程

掌握常微分方程的求解方法。

---

## 4. 微分方程

### 4.1 一阶微分方程

**可分离变量**：

$$
\frac{dy}{dx} = g(x) h(y) \Rightarrow \frac{dy}{h(y)} = g(x) dx
$$

**示例**：

$$
\frac{dy}{dx} = xy \Rightarrow \frac{dy}{y} = x dx \Rightarrow \ln|y| = \frac{x^2}{2} + C
$$

$$
y = Ae^{x^2/2}
$$

**一阶线性微分方程**：

$$
\frac{dy}{dx} + P(x)y = Q(x)
$$

**通解公式**：

$$
y = e^{-\int P(x) dx} \left( \int Q(x) e^{\int P(x) dx} dx + C \right)
$$

### 4.2 二阶常系数线性微分方程

**齐次方程**：

$$
y'' + py' + qy = 0
$$

**特征方程**：

$$
r^2 + pr + q = 0
$$

**通解**：

| 判别式 | 根 | 通解 |
|--------|-----|------|
| $\Delta > 0$ | $r_1, r_2$ 实根 | $y = C_1 e^{r_1 x} + C_2 e^{r_2 x}$ |
| $\Delta = 0$ | $r$ 重根 | $y = (C_1 + C_2 x) e^{rx}$ |
| $\Delta < 0$ | $r = \alpha \pm \beta i$ | $y = e^{\alpha x}(C_1 \cos \beta x + C_2 \sin \beta x)$ |

**示例**：

$$
y'' - 3y' + 2y = 0
$$

特征方程：$r^2 - 3r + 2 = 0 \Rightarrow r_1 = 1, r_2 = 2$

通解：$y = C_1 e^x + C_2 e^{2x}$

### 4.3 数值解法

#### 欧拉法

```python
def euler_method(f, y0, t0, t_end, h):
    """
    欧拉法求解 dy/dt = f(t, y)
    y0: 初值
    t0, t_end: 时间范围
    h: 步长
    """
    t = np.arange(t0, t_end + h, h)
    y = np.zeros(len(t))
    y[0] = y0
    
    for i in range(len(t) - 1):
        y[i+1] = y[i] + h * f(t[i], y[i])
    
    return t, y

# 示例：dy/dt = -y, y(0) = 1（解析解：y = e^(-t)）
def f(t, y):
    return -y

t, y = euler_method(f, y0=1.0, t0=0, t_end=5, h=0.1)
y_exact = np.exp(-t)

plt.plot(t, y, 'o-', label='欧拉法')
plt.plot(t, y_exact, label='精确解')
plt.legend()
plt.title('微分方程数值解')
plt.show()
```

#### 龙格-库塔法（RK4）

```python
def rk4(f, y0, t0, t_end, h):
    """四阶龙格-库塔法"""
    t = np.arange(t0, t_end + h, h)
    y = np.zeros(len(t))
    y[0] = y0
    
    for i in range(len(t) - 1):
        k1 = f(t[i], y[i])
        k2 = f(t[i] + h/2, y[i] + h*k1/2)
        k3 = f(t[i] + h/2, y[i] + h*k2/2)
        k4 = f(t[i] + h, y[i] + h*k3)
        
        y[i+1] = y[i] + h * (k1 + 2*k2 + 2*k3 + k4) / 6
    
    return t, y

t, y = rk4(f, y0=1.0, t0=0, t_end=5, h=0.1)
y_exact = np.exp(-t)

print(f"RK4误差: {np.max(np.abs(y - y_exact)):.10f}")
```

### 4.5 齐次方程

**定义**：形如 $\frac{dy}{dx} = f\left(\frac{y}{x}\right)$ 的方程

**解法**：令 $u = \frac{y}{x}$，则 $y = ux$，$\frac{dy}{dx} = u + x\frac{du}{dx}$

代入得：

$$
u + x\frac{du}{dx} = f(u) \Rightarrow \frac{du}{f(u) - u} = \frac{dx}{x}
$$

**示例**：

$$
\frac{dy}{dx} = \frac{y^2 + xy}{x^2}
$$

令 $u = \frac{y}{x}$：

$$
u + x\frac{du}{dx} = u^2 + u \Rightarrow x\frac{du}{dx} = u^2 \Rightarrow \frac{du}{u^2} = \frac{dx}{x}
$$

$$
-\frac{1}{u} = \ln|x| + C \Rightarrow y = -\frac{x}{\ln|x| + C}
$$

```python
def homogeneous_equation_solver():
    """齐次方程数值解"""
    # dy/dx = (y² + xy) / x²
    
    def f(x, y):
        if x == 0:
            return 0
        return (y**2 + x*y) / x**2
    
    # 使用RK4求解
    x0, y0 = 1.0, 1.0
    x_end = 5.0
    h = 0.01
    
    x_vals, y_vals = rk4(f, y0, x0, x_end, h)
    
    # 解析解：y = -x / (ln|x| + C)
    # 初值条件：y(1) = 1 => C = -1
    y_exact = -x_vals / (np.log(x_vals) - 1)
    
    plt.plot(x_vals, y_vals, label='数值解 (RK4)')
    plt.plot(x_vals, y_exact, '--', label='解析解')
    plt.xlabel('x')
    plt.ylabel('y')
    plt.title('齐次方程求解')
    plt.legend()
    plt.grid(True)
    plt.show()

homogeneous_equation_solver()
```

### 4.6 伯努利方程

**标准形式**：

$$
\frac{dy}{dx} + P(x)y = Q(x)y^n \quad (n \neq 0, 1)
$$

**解法**：令 $z = y^{1-n}$，转化为线性方程

$$
\frac{dz}{dx} + (1-n)P(x)z = (1-n)Q(x)
$$

**示例**：

$$
\frac{dy}{dx} + \frac{y}{x} = y^2
$$

令 $z = y^{-1}$：

$$
-\frac{1}{y^2}\frac{dy}{dx} = \frac{dz}{dx}
$$

$$
\frac{dz}{dx} - \frac{z}{x} = -1
$$

线性方程解：$z = x + Cx$

因此：$y = \frac{1}{x + Cx} = \frac{1}{x(1 + C)}$

```python
def bernoulli_equation():
    """伯努利方程求解示例"""
    # dy/dx + y/x = y²
    
    def f(x, y):
        if x == 0 or y == 0:
            return 0
        return y**2 - y / x
    
    x0, y0 = 1.0, 0.5
    x_end = 5.0
    h = 0.01
    
    x_vals, y_vals = rk4(f, y0, x0, x_end, h)
    
    # 解析解：y = 1/(x(1+C))
    # 初值：y(1) = 0.5 => C = 1
    y_exact = 1 / (x_vals * 2)
    
    plt.plot(x_vals, y_vals, label='数值解')
    plt.plot(x_vals, y_exact, '--', label='解析解')
    plt.xlabel('x')
    plt.ylabel('y')
    plt.title('伯努利方程')
    plt.legend()
    plt.grid(True)
    plt.show()

bernoulli_equation()
```

### 4.7 常数变易法

**思想**：从齐次方程的通解出发，将常数变为函数

**步骤**：

1. 求齐次方程 $\frac{dy}{dx} + P(x)y = 0$ 的通解 $y_h = Ce^{-\int P(x)dx}$
2. 设非齐次方程解为 $y = C(x)e^{-\int P(x)dx}$
3. 代入原方程求 $C(x)$

**示例**：

$$
\frac{dy}{dx} + y = e^x
$$

齐次解：$y_h = Ce^{-x}$

设 $y = C(x)e^{-x}$：

$$
C'(x)e^{-x} - C(x)e^{-x} + C(x)e^{-x} = e^x
$$

$$
C'(x) = e^{2x} \Rightarrow C(x) = \frac{e^{2x}}{2}
$$

$$
y = \frac{e^{2x}}{2} \cdot e^{-x} = \frac{e^x}{2}
$$

通解：$y = \frac{e^x}{2} + Ce^{-x}$

### 4.8 线性方程组与矩阵指数

**线性常系数方程组**：

$$
\frac{d\mathbf{x}}{dt} = A\mathbf{x}
$$

**解**（通过对角化）：

$$
\mathbf{x}(t) = e^{At}\mathbf{x}_0 = P e^{Dt} P^{-1} \mathbf{x}_0
$$

其中 $A = PDP^{-1}$（特征值分解）

```python
from scipy.linalg import expm

def linear_system_ode():
    """线性方程组求解"""
    # dx/dt = Ax, A = [[0, 1], [-2, -3]]
    
    A = np.array([[0, 1], [-2, -3]], dtype=float)
    x0 = np.array([1, 0], dtype=float)
    
    # 时间序列
    t_vals = np.linspace(0, 5, 100)
    solutions = []
    
    for t in t_vals:
        # 矩阵指数
        x_t = expm(A * t) @ x0
        solutions.append(x_t)
    
    solutions = np.array(solutions)
    
    plt.plot(t_vals, solutions[:, 0], label='x₁(t)')
    plt.plot(t_vals, solutions[:, 1], label='x₂(t)')
    plt.xlabel('t')
    plt.ylabel('x')
    plt.title('线性方程组解')
    plt.legend()
    plt.grid(True)
    plt.show()
    
    # 相图
    plt.plot(solutions[:, 0], solutions[:, 1])
    plt.xlabel('x₁')
    plt.ylabel('x₂')
    plt.title('相空间轨迹')
    plt.grid(True)
    plt.show()

linear_system_ode()
```

### 4.9 应用：算法递推式求解

**递推关系转微分方程**：

$$
T(n) = 2T(n/2) + n
$$

连续化：$T(n) \to T(x)$, $T(n/2) \to T(x/2)$

$$
T(x) = 2T(x/2) + x
$$

求导：

$$
T'(x) = T'(x/2) + 1
$$

解得：$T'(x) = \log_2 x + C$

$$
T(x) = x \log_2 x + Cx + D
$$

∴ $T(n) = \Theta(n \log n)$

---

**本章完**
