# 微积分II - (三)无穷级数

学习级数的收敛性判定和应用。

---

## 3. 无穷级数

### 3.1 数项级数

**定义**：

$$
\sum_{n=1}^{\infty} a_n = \lim_{N \to \infty} \sum_{n=1}^{N} a_n
$$

**收敛性判别法：**

| 方法 | 条件 | 结论 |
|------|------|------|
| 比值判别法 | $\lim \frac{a_{n+1}}{a_n} = \rho$ | $\rho < 1$ 收敛，$\rho > 1$ 发散 |
| 根值判别法 | $\lim \sqrt[n]{a_n} = \rho$ | $\rho < 1$ 收敛，$\rho > 1$ 发散 |
| 积分判别法 | $f(x)$ 递减 | $\sum a_n$ 与 $\int f(x) dx$ 同敛散 |

**示例：几何级数**

$$
\sum_{n=0}^{\infty} ar^n = \begin{cases}
\frac{a}{1-r}, & |r| < 1 \\
\text{发散}, & |r| \geq 1
\end{cases}
$$

**应用：算法复杂度分析**

```python
# 快速幂算法复杂度
# T(n) = T(n/2) + O(1)
# 展开：O(1) + O(1) + ... (log n项)
# = O(log n)（几何级数求和）
```

### 3.2 泰勒级数

**泰勒展开**：

$$
f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x - a)^n
$$

**常用级数**：

$$
e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!}
$$

$$
\sin x = \sum_{n=0}^{\infty} \frac{(-1)^n x^{2n+1}}{(2n+1)!}
$$

$$
\cos x = \sum_{n=0}^{\infty} \frac{(-1)^n x^{2n}}{(2n)!}
$$

$$
\ln(1+x) = \sum_{n=1}^{\infty} \frac{(-1)^{n-1} x^n}{n} \quad (|x| < 1)
$$

**Python实现（数值逼近）：**

```python
def taylor_exp(x, n_terms=20):
    """泰勒级数计算 e^x"""
    result = 0
    for n in range(n_terms):
        result += x**n / np.math.factorial(n)
    return result

def taylor_sin(x, n_terms=20):
    """泰勒级数计算 sin(x)"""
    result = 0
    for n in range(n_terms):
        result += (-1)**n * x**(2*n+1) / np.math.factorial(2*n+1)
    return result

x = 1.0
print(f"e^{x} (Taylor): {taylor_exp(x):.10f}")
print(f"e^{x} (NumPy):  {np.exp(x):.10f}")

x = np.pi / 4
print(f"sin({x}) (Taylor): {taylor_sin(x):.10f}")
print(f"sin({x}) (NumPy):  {np.sin(x):.10f}")
```

### 3.3 傅里叶级数

**周期函数展开**：

$$
f(x) = \frac{a_0}{2} + \sum_{n=1}^{\infty} \left( a_n \cos(nx) + b_n \sin(nx) \right)
$$

其中：

$$
a_n = \frac{1}{\pi} \int_{-\pi}^{\pi} f(x) \cos(nx) \, dx
$$

$$
b_n = \frac{1}{\pi} \int_{-\pi}^{\pi} f(x) \sin(nx) \, dx
$$

**应用：信号处理**

```python
def fourier_series(f, L, n_terms=10):
    """
    计算傅里叶级数系数
    f: 周期函数
    L: 半周期
    """
    from scipy.integrate import quad
    
    # a0
    a0, _ = quad(lambda x: f(x), -L, L)
    a0 = a0 / L
    
    # an, bn
    an = []
    bn = []
    for n in range(1, n_terms + 1):
        an_val, _ = quad(lambda x: f(x) * np.cos(n * np.pi * x / L), -L, L)
        bn_val, _ = quad(lambda x: f(x) * np.sin(n * np.pi * x / L), -L, L)
        an.append(an_val / L)
        bn.append(bn_val / L)
    
    return a0, an, bn

def fourier_reconstruct(x, a0, an, bn, L):
    """重构信号"""
    result = a0 / 2
    for n in range(len(an)):
        result += an[n] * np.cos((n+1) * np.pi * x / L)
        result += bn[n] * np.sin((n+1) * np.pi * x / L)
    return result

# 示例：方波
def square_wave(x):
    return 1 if x % (2*np.pi) < np.pi else -1

L = np.pi
a0, an, bn = fourier_series(square_wave, L, n_terms=20)

x = np.linspace(-np.pi, np.pi, 1000)
y_original = [square_wave(xi) for xi in x]
y_approx = [fourier_reconstruct(xi, a0, an, bn, L) for xi in x]

plt.plot(x, y_original, label='原始信号')
plt.plot(x, y_approx, label='傅里叶逼近')
plt.legend()
plt.title('方波的傅里叶级数逼近')
plt.show()
```

### 3.4 交错级数

**定义**：形如 $\sum_{n=1}^{\infty} (-1)^{n-1} a_n$ 的级数

**莱布尼茨判别法**：

若：
1. $a_n > 0$
2. $a_n$ 单调递减
3. $\lim_{n \to \infty} a_n = 0$

则交错级数收敛。

**示例**：

$$
\sum_{n=1}^{\infty} \frac{(-1)^{n-1}}{n} = 1 - \frac{1}{2} + \frac{1}{3} - \frac{1}{4} + \cdots = \ln 2
$$

```python
def alternating_series():
    """交错级数收敛演示"""
    n_terms = [10, 50, 100, 500]
    
    for n in n_terms:
        partial_sum = sum((-1)**(k-1) / k for k in range(1, n+1))
        error = abs(partial_sum - np.log(2))
        print(f"n={n:3d}: 部分和={partial_sum:.6f}, 误差={error:.6e}")
    
    print(f"\n理论值: ln(2) = {np.log(2):.6f}")

alternating_series()
```

### 3.5 绝对收敛与条件收敛

**绝对收敛**：$\sum |a_n|$ 收敛

**条件收敛**：$\sum a_n$ 收敛但 $\sum |a_n|$ 发散

**性质**：
- 绝对收敛 $\Rightarrow$ 收敛
- 绝对收敛的级数可以任意重排
- 条件收敛的级数重排后可能改变和

**示例**：

$$
\sum_{n=1}^{\infty} \frac{(-1)^{n-1}}{n} \text{ 条件收敛}
$$

$$
\sum_{n=1}^{\infty} \frac{(-1)^{n-1}}{n^2} \text{ 绝对收敛}
$$

```python
def convergence_types():
    """绝对收敛vs条件收敛"""
    
    # 条件收敛：∑(-1)^(n-1)/n
    n = 1000
    conditional = sum((-1)**(k-1) / k for k in range(1, n+1))
    absolute_test = sum(1 / k for k in range(1, n+1))
    
    print("条件收敛示例：∑(-1)^(n-1)/n")
    print(f"  级数和: {conditional:.6f}")
    print(f"  绝对值级数: {absolute_test:.6f} (发散)")
    
    # 绝对收敛：∑(-1)^(n-1)/n²
    abs_conv = sum((-1)**(k-1) / k**2 for k in range(1, n+1))
    abs_test = sum(1 / k**2 for k in range(1, n+1))
    
    print("\n绝对收敛示例：∑(-1)^(n-1)/n²")
    print(f"  级数和: {abs_conv:.6f}")
    print(f"  绝对值级数: {abs_test:.6f} (π²/6 = {np.pi**2/6:.6f})")

convergence_types()
```

### 3.6 幂级数及其运算

**幂级数**：

$$
\sum_{n=0}^{\infty} a_n (x - x_0)^n
$$

**收敛半径**（比值法）：

$$
R = \lim_{n \to \infty} \left| \frac{a_n}{a_{n+1}} \right|
$$

**性质**：

1. **逐项求导**：

$$
f(x) = \sum a_n x^n \Rightarrow f'(x) = \sum n a_n x^{n-1}
$$

2. **逐项积分**：

$$
\int f(x) dx = \sum \frac{a_n}{n+1} x^{n+1} + C
$$

**示例：求级数和**

```python
def power_series_operations():
    """幂级数运算"""
    
    # 1. 求 ∑ n·x^n 的和函数
    # 已知：∑ x^n = 1/(1-x), |x|<1
    # 逐项求导：∑ n·x^(n-1) = 1/(1-x)²
    # 因此：∑ n·x^n = x/(1-x)²
    
    x = 0.5
    n_terms = 50
    
    # 数值计算
    numerical = sum(n * x**n for n in range(1, n_terms))
    # 解析解
    analytical = x / (1 - x)**2
    
    print(f"∑ n·x^n (x={x})")
    print(f"  数值: {numerical:.6f}")
    print(f"  解析: {analytical:.6f}")
    
    # 2. 求 ∑ x^n/n 的和函数
    # 已知：∑ x^n = 1/(1-x)
    # 逐项积分：∑ x^(n+1)/(n+1) = -ln(1-x) + C
    # 因此：∑ x^n/n = -ln(1-x)
    
    x = 0.5
    numerical2 = sum(x**n / n for n in range(1, n_terms))
    analytical2 = -np.log(1 - x)
    
    print(f"\n∑ x^n/n (x={x})")
    print(f"  数值: {numerical2:.6f}")
    print(f"  解析: {analytical2:.6f}")

power_series_operations()
```

### 3.7 函数的幂级数展开

**常用展开**：

$$
(1 + x)^\alpha = 1 + \alpha x + \frac{\alpha(\alpha-1)}{2!}x^2 + \cdots \quad (|x| < 1)
$$

$$
\frac{1}{1-x} = \sum_{n=0}^{\infty} x^n \quad (|x| < 1)
$$

$$
\arctan x = \sum_{n=0}^{\infty} \frac{(-1)^n x^{2n+1}}{2n+1} \quad (|x| \leq 1)
$$

**应用：计算π**

$$
\arctan(1) = \frac{\pi}{4} = 1 - \frac{1}{3} + \frac{1}{5} - \frac{1}{7} + \cdots
$$

```python
def compute_pi_leibniz():
    """莱布尼茨公式计算π"""
    n_terms = [10, 100, 1000, 10000]
    
    for n in n_terms:
        pi_approx = 4 * sum((-1)**k / (2*k + 1) for k in range(n))
        error = abs(pi_approx - np.pi)
        print(f"n={n:5d}: π≈{pi_approx:.10f}, 误差={error:.2e}")
    
    # 更快的公式（Machin公式）
    # π/4 = 4·arctan(1/5) - arctan(1/239)
    def arctan_series(x, n_terms=50):
        return sum((-1)**k * x**(2*k+1) / (2*k+1) for k in range(n_terms))
    
    pi_machin = 4 * (4 * arctan_series(1/5) - arctan_series(1/239))
    print(f"\nMachin公式: π≈{pi_machin:.15f}")
    print(f"NumPy: π={np.pi:.15f}")

compute_pi_leibniz()
```

### 3.8 傅里叶级数的应用

**矩形波的傅里叶展开**：

$$
f(x) = \frac{4}{\pi} \left( \sin x + \frac{\sin 3x}{3} + \frac{\sin 5x}{5} + \cdots \right)
$$

**应用：信号处理与频谱分析**

```python
def fourier_signal_analysis():
    """傅里叶级数信号分析"""
    
    # 合成信号：f(t) = sin(2π·50t) + 0.5·sin(2π·120t)
    fs = 1000  # 采样率
    t = np.linspace(0, 1, fs, endpoint=False)
    signal = np.sin(2 * np.pi * 50 * t) + 0.5 * np.sin(2 * np.pi * 120 * t)
    
    # FFT分析
    fft_result = np.fft.fft(signal)
    frequencies = np.fft.fftfreq(len(signal), 1/fs)
    
    # 绘制
    plt.figure(figsize=(12, 5))
    
    plt.subplot(121)
    plt.plot(t[:200], signal[:200])
    plt.xlabel('时间 (s)')
    plt.ylabel('幅值')
    plt.title('时域信号')
    plt.grid(True)
    
    plt.subplot(122)
    plt.plot(frequencies[:fs//2], np.abs(fft_result)[:fs//2])
    plt.xlabel('频率 (Hz)')
    plt.ylabel('幅度谱')
    plt.title('频域分析（FFT）')
    plt.xlim(0, 200)
    plt.grid(True)
    
    plt.tight_layout()
    plt.show()
    
    # 找出主要频率分量
    peaks = np.where(np.abs(fft_result[:fs//2]) > 100)[0]
    print("主要频率分量:")
    for peak in peaks:
        print(f"  频率: {frequencies[peak]:.1f} Hz, 幅度: {np.abs(fft_result[peak]):.1f}")

fourier_signal_analysis()
```

---

**本章完**
