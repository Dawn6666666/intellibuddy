# 微积分II - (二)重积分

掌握二重积分、三重积分的计算。

---

## 2. 重积分

### 2.1 二重积分

**定义**：

$$
\iint_D f(x, y) \, dA = \lim_{n \to \infty} \sum_{i=1}^{n} f(x_i^*, y_i^*) \Delta A_i
$$

**计算方法**（直角坐标）：

$$
\iint_D f(x, y) \, dx \, dy = \int_a^b \int_{g_1(x)}^{g_2(x)} f(x, y) \, dy \, dx
$$

**极坐标变换**：

$$
x = r \cos \theta, \quad y = r \sin \theta
$$

$$
\iint_D f(x, y) \, dx \, dy = \iint_{D'} f(r\cos\theta, r\sin\theta) \cdot r \, dr \, d\theta
$$

**示例**：计算圆 $x^2 + y^2 \leq 1$ 上 $f(x, y) = e^{-(x^2+y^2)}$ 的积分

$$
\iint_D e^{-(x^2+y^2)} \, dx \, dy = \int_0^{2\pi} \int_0^1 e^{-r^2} \cdot r \, dr \, d\theta
$$

$$
= 2\pi \int_0^1 r e^{-r^2} \, dr = 2\pi \left[ -\frac{1}{2}e^{-r^2} \right]_0^1 = \pi(1 - e^{-1})
$$

**Python实现（数值积分）：**

```python
from scipy.integrate import dblquad
import numpy as np

def double_integral_example():
    """二重积分数值计算"""
    # 计算 ∫∫_D e^(-(x²+y²)) dA，D: x²+y² ≤ 1
    
    def integrand(y, x):
        return np.exp(-(x**2 + y**2))
    
    def y_lower(x):
        return -np.sqrt(1 - x**2)
    
    def y_upper(x):
        return np.sqrt(1 - x**2)
    
    result, error = dblquad(integrand, -1, 1, y_lower, y_upper)
    print(f"积分结果: {result:.6f}")
    print(f"理论值: {np.pi * (1 - np.exp(-1)):.6f}")

double_integral_example()
```

### 2.2 蒙特卡洛积分

**原理**：用随机采样估计积分值

$$
\int_D f(x) \, dx \approx \frac{V(D)}{N} \sum_{i=1}^{N} f(x_i)
$$

其中 $x_i$ 是 $D$ 中的随机点

```python
def monte_carlo_integration(f, bounds, n_samples=100000):
    """
    蒙特卡洛积分
    f: 被积函数
    bounds: [(x_min, x_max), (y_min, y_max), ...]
    """
    dim = len(bounds)
    volume = np.prod([b[1] - b[0] for b in bounds])
    
    # 生成随机样本
    samples = np.random.uniform(
        low=[b[0] for b in bounds],
        high=[b[1] for b in bounds],
        size=(n_samples, dim)
    )
    
    # 计算函数值
    values = np.array([f(s) for s in samples])
    
    # 估计积分
    integral = volume * np.mean(values)
    error = volume * np.std(values) / np.sqrt(n_samples)
    
    return integral, error

# 示例：计算圆的面积（π的估计）
def indicator(x):
    return 1 if x[0]**2 + x[1]**2 <= 1 else 0

bounds = [(-1, 1), (-1, 1)]
integral, error = monte_carlo_integration(indicator, bounds, n_samples=1000000)
print(f"π估计: {integral:.6f} ± {error:.6f}")
print(f"真实值: {np.pi:.6f}")
```

### 2.3 三重积分

**定义**：

$$
\iiint_\Omega f(x, y, z) \, dV = \lim \sum f(x_i, y_i, z_i) \Delta V_i
$$

**直角坐标计算**：

$$
\iiint_\Omega f(x, y, z) \, dV = \int_a^b \int_{g_1(x)}^{g_2(x)} \int_{h_1(x,y)}^{h_2(x,y)} f(x, y, z) \, dz \, dy \, dx
$$

**示例：计算立方体的质量**

```python
from scipy.integrate import tplquad

def triple_integral_example():
    """三重积分：计算密度非均匀物体的质量"""
    # 密度函数 ρ(x,y,z) = x² + y² + z²
    def density(z, y, x):  # 注意：scipy参数顺序是 z, y, x
        return x**2 + y**2 + z**2
    
    # 积分区域：0 ≤ x,y,z ≤ 1
    result, error = tplquad(
        density,
        0, 1,  # x范围
        0, 1,  # y范围
        0, 1   # z范围
    )
    
    print(f"质量: {result:.6f}")
    print(f"误差: {error:.2e}")
    
    # 解析解：∫∫∫(x²+y²+z²)dV = 3∫₀¹∫₀¹∫₀¹x²dxdydz = 3·(1/3)·1·1 = 1
    print(f"理论值: 1.000000")

triple_integral_example()
```

### 2.4 柱坐标系

**坐标变换**：

$$
\begin{cases}
x = r \cos \theta \\
y = r \sin \theta \\
z = z
\end{cases}
$$

**体积元**：$dV = r \, dr \, d\theta \, dz$

**示例：圆柱体积**

$$
V = \iiint_\Omega dV = \int_0^{2\pi} \int_0^R \int_0^h r \, dz \, dr \, d\theta = \pi R^2 h
$$

```python
def cylindrical_coordinates():
    """柱坐标系积分示例"""
    # 计算圆柱 x²+y²≤R², 0≤z≤h 的体积
    R, h = 2, 3
    
    def integrand(z, r, theta):
        return r  # 体积元的r
    
    result, _ = tplquad(
        integrand,
        0, 2*np.pi,  # θ
        0, R,         # r
        0, h          # z
    )
    
    print(f"圆柱体积: {result:.6f}")
    print(f"理论值: {np.pi * R**2 * h:.6f}")

cylindrical_coordinates()
```

### 2.5 球坐标系

**坐标变换**：

$$
\begin{cases}
x = r \sin \phi \cos \theta \\
y = r \sin \phi \sin \theta \\
z = r \cos \phi
\end{cases}
$$

**体积元**：$dV = r^2 \sin \phi \, dr \, d\phi \, d\theta$

- $r \in [0, +\infty)$ - 半径
- $\phi \in [0, \pi]$ - 极角（与z轴夹角）
- $\theta \in [0, 2\pi]$ - 方位角

**示例：球的体积和转动惯量**

```python
def spherical_coordinates():
    """球坐标系积分"""
    R = 2
    
    # 1. 球的体积
    def volume_integrand(r, phi, theta):
        return r**2 * np.sin(phi)
    
    volume, _ = tplquad(
        volume_integrand,
        0, 2*np.pi,  # θ
        0, np.pi,     # φ
        0, R          # r
    )
    
    print(f"球的体积: {volume:.6f}")
    print(f"理论值: {4/3 * np.pi * R**3:.6f}")
    
    # 2. 转动惯量（绕z轴，密度=1）
    # I_z = ∫∫∫ (x²+y²) dV = ∫∫∫ r²sin²φ · r²sinφ dr dφ dθ
    def inertia_integrand(r, phi, theta):
        return r**4 * np.sin(phi)**3
    
    inertia, _ = tplquad(
        inertia_integrand,
        0, 2*np.pi,
        0, np.pi,
        0, R
    )
    
    print(f"转动惯量: {inertia:.6f}")
    print(f"理论值: {8/15 * np.pi * R**5:.6f}")

spherical_coordinates()
```

### 2.6 第一类曲线积分（对弧长）

**定义**：

$$
\int_L f(x, y) \, ds = \int_a^b f(x(t), y(t)) \sqrt{(x'(t))^2 + (y'(t))^2} \, dt
$$

**应用**：计算曲线质量（线密度 $\rho(x, y)$）

$$
m = \int_L \rho(x, y) \, ds
$$

```python
def first_type_curve_integral():
    """第一类曲线积分：求曲线的质心"""
    from scipy.integrate import quad
    
    # 曲线：圆 x²+y²=1，密度 ρ=x²+y²=1
    # 参数方程：x=cos(t), y=sin(t), t∈[0,2π]
    
    def arc_length_element(t):
        # ds/dt = √((dx/dt)²+(dy/dt)²) = √(sin²t + cos²t) = 1
        return 1
    
    def integrand(t):
        x, y = np.cos(t), np.sin(t)
        rho = x**2 + y**2  # =1
        return rho * arc_length_element(t)
    
    mass, _ = quad(integrand, 0, 2*np.pi)
    print(f"总质量: {mass:.6f}")  # = 2π
    
    # 质心x坐标
    def x_moment(t):
        x = np.cos(t)
        return x * integrand(t)
    
    Mx, _ = quad(x_moment, 0, 2*np.pi)
    x_center = Mx / mass
    print(f"质心: ({x_center:.6f}, 0)")  # 对称性，y=0

first_type_curve_integral()
```

### 2.7 第二类曲线积分（对坐标）

**定义**：

$$
\int_L P \, dx + Q \, dy = \int_a^b [P(x(t), y(t)) x'(t) + Q(x(t), y(t)) y'(t)] \, dt
$$

**格林公式**（重要）：

$$
\oint_L P \, dx + Q \, dy = \iint_D \left( \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} \right) dA
$$

**应用**：计算功、通量

```python
def greens_theorem_example():
    """格林公式验证"""
    # 计算 ∮ (x²-y²)dx + 2xy dy，L是圆 x²+y²=1 的正向边界
    
    # 方法1：直接计算曲线积分
    from scipy.integrate import quad
    
    def curve_integral():
        def integrand(t):
            x, y = np.cos(t), np.sin(t)
            dx_dt, dy_dt = -np.sin(t), np.cos(t)
            P, Q = x**2 - y**2, 2*x*y
            return P * dx_dt + Q * dy_dt
        
        result, _ = quad(integrand, 0, 2*np.pi)
        return result
    
    # 方法2：格林公式
    def greens_formula():
        # ∂Q/∂x - ∂P/∂y = 2y - (-2y) = 4y
        def integrand(y, x):
            return 4 * y
        
        from scipy.integrate import dblquad
        
        def y_lower(x):
            return -np.sqrt(1 - x**2)
        
        def y_upper(x):
            return np.sqrt(1 - x**2)
        
        result, _ = dblquad(integrand, -1, 1, y_lower, y_upper)
        return result
    
    I1 = curve_integral()
    I2 = greens_formula()
    
    print(f"曲线积分: {I1:.6f}")
    print(f"格林公式: {I2:.6f}")
    print(f"理论值: 0.000000 (由对称性)")

greens_theorem_example()
```

### 2.8 第一类曲面积分

**定义**：

$$
\iint_S f(x, y, z) \, dS
$$

**计算**（$z = z(x, y)$）：

$$
\iint_S f(x, y, z) \, dS = \iint_D f(x, y, z(x, y)) \sqrt{1 + (z_x)^2 + (z_y)^2} \, dA
$$

**应用**：计算曲面质量

```python
def surface_integral_example():
    """曲面积分：计算球面的表面积"""
    from scipy.integrate import dblquad
    
    # 上半球面 z = √(R²-x²-y²)
    R = 2
    
    def surface_element(y, x):
        z = np.sqrt(R**2 - x**2 - y**2)
        z_x = -x / z
        z_y = -y / z
        return np.sqrt(1 + z_x**2 + z_y**2)
    
    def y_lower(x):
        return -np.sqrt(R**2 - x**2)
    
    def y_upper(x):
        return np.sqrt(R**2 - x**2)
    
    area_half, _ = dblquad(surface_element, -R, R, y_lower, y_upper)
    area_total = 2 * area_half  # 上下半球
    
    print(f"球面面积: {area_total:.6f}")
    print(f"理论值: {4 * np.pi * R**2:.6f}")

surface_integral_example()
```

### 2.9 第二类曲面积分（高斯公式）

**高斯公式**（散度定理）：

$$
\iint_S P \, dydz + Q \, dzdx + R \, dxdy = \iiint_\Omega \left( \frac{\partial P}{\partial x} + \frac{\partial Q}{\partial y} + \frac{\partial R}{\partial z} \right) dV
$$

**斯托克斯公式**（环流量与旋度）：

$$
\oint_L P \, dx + Q \, dy + R \, dz = \iint_S (\text{rot } \mathbf{F}) \cdot \mathbf{n} \, dS
$$

**应用**：流体力学、电磁学

```python
def divergence_theorem():
    """高斯公式：通量计算"""
    # 向量场 F = (x, y, z)
    # 计算通过球面 x²+y²+z²=R² 的通量
    
    R = 2
    
    # 方法1：直接计算曲面积分（太复杂）
    # 方法2：高斯公式
    # div F = ∂x/∂x + ∂y/∂y + ∂z/∂z = 3
    
    def integrand(r, phi, theta):
        return 3 * r**2 * np.sin(phi)  # div F · dV（球坐标）
    
    flux, _ = tplquad(
        integrand,
        0, 2*np.pi,
        0, np.pi,
        0, R
    )
    
    print(f"通量: {flux:.6f}")
    print(f"理论值: {3 * 4/3 * np.pi * R**3:.6f}")  # 3 · 体积

divergence_theorem()
```

---

**本章完**
