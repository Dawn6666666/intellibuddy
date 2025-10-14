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

---

**本章完**
