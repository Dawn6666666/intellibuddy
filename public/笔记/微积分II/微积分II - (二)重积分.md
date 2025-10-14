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

---

**本章完**
