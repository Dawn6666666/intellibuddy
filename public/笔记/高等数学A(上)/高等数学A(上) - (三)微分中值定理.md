![(三)微分中值定理](https://via.placeholder.com/800x200?text=Mean+Value+Theorem)

# 高等数学A(上) - (三)微分中值定理

微分中值定理是微分学的核心定理，揭示了函数整体与局部的关系。

---


### 3.1 罗尔定理（Rolle）

**定理**：若函数 $f(x)$ 满足：
1. 在闭区间 $[a, b]$ 上连续
2. 在开区间 $(a, b)$ 内可导
3. $f(a) = f(b)$

则至少存在一点 $\xi \in (a, b)$，使得

$$
f'(\xi) = 0
$$

**几何意义**：曲线上至少有一点的切线平行于 $x$ 轴。

### 3.2 拉格朗日中值定理（Lagrange）

**定理**：若函数 $f(x)$ 满足：
1. 在 $[a, b]$ 上连续
2. 在 $(a, b)$ 内可导

则至少存在一点 $\xi \in (a, b)$，使得

$$
f(b) - f(a) = f'(\xi)(b - a)
$$

或写成：

$$
f'(\xi) = \frac{f(b) - f(a)}{b - a}
$$

**几何意义**：曲线上至少有一点的切线平行于弦 $AB$。

**推论**：若在 $(a, b)$ 内 $f'(x) = 0$，则 $f(x) = C$（常数）

### 3.3 柯西中值定理（Cauchy）

**定理**：若 $f(x), g(x)$ 满足：
1. 在 $[a, b]$ 上连续
2. 在 $(a, b)$ 内可导
3. $g'(x) \neq 0$

则存在 $\xi \in (a, b)$，使得

$$
\frac{f(b) - f(a)}{g(b) - g(a)} = \frac{f'(\xi)}{g'(\xi)}
$$

### 3.4 洛必达法则（L'Hospital）

**定理**：若：
1. $\lim f(x) = 0, \lim g(x) = 0$ （或 $\infty, \infty$）
2. $f'(x), g'(x)$ 存在且 $g'(x) \neq 0$
3. $\lim \frac{f'(x)}{g'(x)}$ 存在（或为 $\infty$）

则

$$
\lim \frac{f(x)}{g(x)} = \lim \frac{f'(x)}{g'(x)}
$$

**应用示例：**

**1. $\frac{0}{0}$ 型**

$$
\lim_{x \to 0} \frac{\sin x}{x} = \lim_{x \to 0} \frac{\cos x}{1} = 1
$$

**2. $\frac{\infty}{\infty}$ 型**

$$
\lim_{x \to +\infty} \frac{x^2}{e^x} = \lim_{x \to +\infty} \frac{2x}{e^x} = \lim_{x \to +\infty} \frac{2}{e^x} = 0
$$

**3. $0 \cdot \infty$ 型**（化为 $\frac{0}{0}$ 或 $\frac{\infty}{\infty}$）

$$
\lim_{x \to 0^+} x \ln x = \lim_{x \to 0^+} \frac{\ln x}{\frac{1}{x}} = \lim_{x \to 0^+} \frac{\frac{1}{x}}{-\frac{1}{x^2}} = \lim_{x \to 0^+} (-x) = 0
$$

**4. $1^\infty, 0^0, \infty^0$ 型**（取对数后用洛必达）

$$
\lim_{x \to 0^+} x^x = \lim_{x \to 0^+} e^{x \ln x} = e^0 = 1
$$

---

## 4. 导数的应用