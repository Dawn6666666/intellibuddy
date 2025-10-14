![(七)典型题型归纳](https://via.placeholder.com/800x200?text=Typical+Problems)

# 高等数学A(上) - (七)典型题型归纳

总结常见题型和解题方法。

---


### 8.1 极限计算题型

#### 题型1：∞/∞型未定式

**解法**：抓大头法、洛必达法则

**例1**：计算 $\lim_{x \to \infty} \frac{3x^2 + 2x + 1}{5x^2 - 3x + 7}$

**解**：
$$
\begin{align}
\lim_{x \to \infty} \frac{3x^2 + 2x + 1}{5x^2 - 3x + 7} &= \lim_{x \to \infty} \frac{x^2(3 + \frac{2}{x} + \frac{1}{x^2})}{x^2(5 - \frac{3}{x} + \frac{7}{x^2})} \\
&= \lim_{x \to \infty} \frac{3 + \frac{2}{x} + \frac{1}{x^2}}{5 - \frac{3}{x} + \frac{7}{x^2}} \\
&= \frac{3}{5}
\end{align}
$$

**例2**：计算 $\lim_{x \to \infty} \frac{e^x + e^{-x}}{e^x - e^{-x}}$

**解**：
$$
\begin{align}
原式 &= \lim_{x \to \infty} \frac{e^x(1 + e^{-2x})}{e^x(1 - e^{-2x})} \\
&= \lim_{x \to \infty} \frac{1 + e^{-2x}}{1 - e^{-2x}} \\
&= \frac{1 + 0}{1 - 0} = 1
\end{align}
$$

#### 题型2：0/0型未定式

**例3**：计算 $\lim_{x \to 0} \frac{\tan x - \sin x}{x^3}$

**解法1**（泰勒展开）：
$$
\begin{align}
\tan x &= x + \frac{x^3}{3} + o(x^3) \\
\sin x &= x - \frac{x^3}{6} + o(x^3) \\
\tan x - \sin x &= \frac{x^3}{3} + \frac{x^3}{6} + o(x^3) = \frac{x^3}{2} + o(x^3) \\
原式 &= \lim_{x \to 0} \frac{\frac{x^3}{2} + o(x^3)}{x^3} = \frac{1}{2}
\end{align}
$$

**解法2**（洛必达法则，三次）：
$$
\begin{align}
原式 &= \lim_{x \to 0} \frac{\sec^2 x - \cos x}{3x^2} \\
&= \lim_{x \to 0} \frac{2\sec^2 x \tan x + \sin x}{6x} \\
&= \lim_{x \to 0} \frac{2\sec^2 x(\sec^2 x + 2\tan^2 x) + \cos x}{6} \\
&= \frac{2 + 1}{6} = \frac{1}{2}
\end{align}
$$

#### 题型3：1^∞型未定式

**重要公式**：$\lim [1 + \alpha(x)]^{\beta(x)} = e^{\lim \alpha(x) \cdot \beta(x)}$

**例4**：计算 $\lim_{x \to 0} (1 + x)^{\frac{1}{x}}$

**解**：
$$
原式 = e^{\lim_{x \to 0} x \cdot \frac{1}{x}} = e^1 = e
$$

**例5**：计算 $\lim_{x \to \infty} \left(\frac{x+1}{x-1}\right)^x$

**解**：
$$
\begin{align}
原式 &= \lim_{x \to \infty} \left(1 + \frac{2}{x-1}\right)^x \\
&= \lim_{x \to \infty} \left[\left(1 + \frac{2}{x-1}\right)^{\frac{x-1}{2}}\right]^{\frac{2x}{x-1}} \\
&= e^{\lim_{x \to \infty} \frac{2x}{x-1}} \\
&= e^2
\end{align}
$$

#### 题型4：无穷小比阶

**例6**：当 $x \to 0$ 时，比较无穷小 $\alpha = x - \sin x$ 与 $\beta = x^3$ 的阶。

**解**：
$$
\lim_{x \to 0} \frac{x - \sin x}{x^3} = \lim_{x \to 0} \frac{x - (x - \frac{x^3}{6} + o(x^3))}{x^3} = \lim_{x \to 0} \frac{\frac{x^3}{6}}{x^3} = \frac{1}{6}
$$

因此 $\alpha$ 与 $\beta$ 是**同阶无穷小**，但不是等价无穷小。

### 8.2 导数计算题型

#### 题型1：隐函数求导

**例7**：设 $x^2 + y^2 = 1$，求 $\frac{dy}{dx}$。

**解**：两边对 $x$ 求导：
$$
2x + 2y \frac{dy}{dx} = 0 \Rightarrow \frac{dy}{dx} = -\frac{x}{y}
$$

**例8**：设 $e^y + xy = e$，求 $\frac{dy}{dx}$。

**解**：
$$
e^y \frac{dy}{dx} + y + x\frac{dy}{dx} = 0 \Rightarrow \frac{dy}{dx} = -\frac{y}{e^y + x}
$$

#### 题型2：参数方程求导

**公式**：$\frac{dy}{dx} = \frac{\frac{dy}{dt}}{\frac{dx}{dt}}$，$\frac{d^2y}{dx^2} = \frac{d(\frac{dy}{dx})}{dx} = \frac{\frac{d(\frac{dy}{dx})}{dt}}{\frac{dx}{dt}}$

**例9**：设 $\begin{cases} x = a\cos t \\ y = b\sin t \end{cases}$，求 $\frac{dy}{dx}$ 和 $\frac{d^2y}{dx^2}$。

**解**：
$$
\frac{dy}{dx} = \frac{\frac{dy}{dt}}{\frac{dx}{dt}} = \frac{b\cos t}{-a\sin t} = -\frac{b}{a}\cot t
$$

$$
\frac{d^2y}{dx^2} = \frac{d(-\frac{b}{a}\cot t)}{dx} = \frac{\frac{b}{a}\csc^2 t \cdot dt}{-a\sin t \cdot dt} = -\frac{b}{a^2\sin^3 t}
$$

#### 题型3：高阶导数

**常用公式**：

| 函数 | n阶导数 |
|------|---------|
| $e^{ax}$ | $a^n e^{ax}$ |
| $\sin(ax + b)$ | $a^n \sin(ax + b + \frac{n\pi}{2})$ |
| $\cos(ax + b)$ | $a^n \cos(ax + b + \frac{n\pi}{2})$ |
| $\ln(1+x)$ | $(-1)^{n-1} \frac{(n-1)!}{(1+x)^n}$ |
| $(1+x)^\alpha$ | $\alpha(\alpha-1)\cdots(\alpha-n+1)(1+x)^{\alpha-n}$ |

**例10**：求 $y = x^2 e^{2x}$ 的 $n$ 阶导数。

**解**（莱布尼茨公式）：
$$
(uv)^{(n)} = \sum_{k=0}^{n} C_n^k u^{(k)} v^{(n-k)}
$$

$$
\begin{align}
y^{(n)} &= C_n^0 (x^2)^{(0)} (e^{2x})^{(n)} + C_n^1 (x^2)^{(1)} (e^{2x})^{(n-1)} + C_n^2 (x^2)^{(2)} (e^{2x})^{(n-2)} \\
&= x^2 \cdot 2^n e^{2x} + n \cdot 2x \cdot 2^{n-1} e^{2x} + \frac{n(n-1)}{2} \cdot 2 \cdot 2^{n-2} e^{2x} \\
&= 2^{n-2} e^{2x} [4x^2 + 4nx + n(n-1)]
\end{align}
$$

### 8.3 积分计算题型

#### 题型1：凑微分法

**例11**：$\int \frac{x}{\sqrt{1-x^2}} dx$

**解**：
$$
原式 = -\frac{1}{2} \int \frac{1}{\sqrt{1-x^2}} d(1-x^2) = -\frac{1}{2} \cdot 2\sqrt{1-x^2} + C = -\sqrt{1-x^2} + C
$$

**例12**：$\int \frac{\ln x}{x} dx$

**解**：
$$
原式 = \int \ln x \, d(\ln x) = \frac{(\ln x)^2}{2} + C
$$

#### 题型2：三角换元

**三种标准形式**：

| 被积函数含 | 换元 | 恒等式 |
|-----------|------|--------|
| $\sqrt{a^2 - x^2}$ | $x = a\sin t$ | $1 - \sin^2 t = \cos^2 t$ |
| $\sqrt{a^2 + x^2}$ | $x = a\tan t$ | $1 + \tan^2 t = \sec^2 t$ |
| $\sqrt{x^2 - a^2}$ | $x = a\sec t$ | $\sec^2 t - 1 = \tan^2 t$ |

**例13**：$\int \frac{dx}{\sqrt{1-x^2}}$

**解**：令 $x = \sin t$，$dx = \cos t \, dt$
$$
原式 = \int \frac{\cos t \, dt}{\sqrt{1-\sin^2 t}} = \int \frac{\cos t \, dt}{|\cos t|} = \int dt = t + C = \arcsin x + C
$$

**例14**：$\int \frac{dx}{(4+x^2)^2}$

**解**：令 $x = 2\tan t$，$dx = 2\sec^2 t \, dt$
$$
\begin{align}
原式 &= \int \frac{2\sec^2 t \, dt}{(4 + 4\tan^2 t)^2} = \int \frac{2\sec^2 t \, dt}{16\sec^4 t} \\
&= \frac{1}{8} \int \cos^2 t \, dt = \frac{1}{8} \int \frac{1 + \cos 2t}{2} dt \\
&= \frac{1}{16}(t + \frac{\sin 2t}{2}) + C \\
&= \frac{1}{16}\left(\arctan \frac{x}{2} + \frac{x}{4+x^2}\right) + C
\end{align}
$$

#### 题型3：分部积分法

**口诀**："反对幂指三"（优先级：反三角 > 对数 > 幂函数 > 指数 > 三角）

**例15**：$\int x e^x dx$

**解**：
$$
原式 = x e^x - \int e^x dx = x e^x - e^x + C = (x-1)e^x + C
$$

**例16**：$\int x^2 \sin x \, dx$

**解**：
$$
\begin{align}
原式 &= -x^2 \cos x + \int 2x \cos x \, dx \\
&= -x^2 \cos x + 2x \sin x - \int 2\sin x \, dx \\
&= -x^2 \cos x + 2x \sin x + 2\cos x + C
\end{align}
$$

#### 题型4：有理函数积分

**待定系数法（部分分式分解）**

**例17**：$\int \frac{x+1}{x^2 + 3x + 2} dx$

**解**：先因式分解：
$$
\frac{x+1}{x^2 + 3x + 2} = \frac{x+1}{(x+1)(x+2)} = \frac{1}{x+2}
$$

$$
原式 = \int \frac{dx}{x+2} = \ln|x+2| + C
$$

**例18**：$\int \frac{dx}{x^2(x+1)}$

**解**：设
$$
\frac{1}{x^2(x+1)} = \frac{A}{x} + \frac{B}{x^2} + \frac{C}{x+1}
$$

通分得：$1 = Ax(x+1) + B(x+1) + Cx^2$

- 令 $x = 0$：$B = 1$
- 令 $x = -1$：$C = 1$
- 令 $x = 1$：$1 = 2A + 2B + C$，得 $A = -1$

$$
原式 = -\int \frac{dx}{x} + \int \frac{dx}{x^2} + \int \frac{dx}{x+1} = -\ln|x| - \frac{1}{x} + \ln|x+1| + C
$$

### 8.4 定积分计算题型

#### 题型1：利用对称性

**奇偶函数性质**：
- 若 $f(x)$ 为奇函数：$\int_{-a}^{a} f(x) dx = 0$
- 若 $f(x)$ 为偶函数：$\int_{-a}^{a} f(x) dx = 2\int_{0}^{a} f(x) dx$

**例19**：$\int_{-1}^{1} (x^3 + x) dx$

**解**：$f(x) = x^3 + x$ 为奇函数，所以
$$
原式 = 0
$$

**例20**：$\int_{-\pi}^{\pi} \cos^2 x \, dx$

**解**：$\cos^2 x$ 为偶函数
$$
原式 = 2\int_{0}^{\pi} \cos^2 x \, dx = 2\int_{0}^{\pi} \frac{1 + \cos 2x}{2} dx = \left[x + \frac{\sin 2x}{2}\right]_0^{\pi} = \pi
$$

#### 题型2：区间再现公式

$$
\int_a^b f(x) dx = \int_a^b f(a+b-x) dx
$$

**例21**：$\int_0^{\frac{\pi}{2}} \frac{\sin x}{\sin x + \cos x} dx$

**解**：
$$
I = \int_0^{\frac{\pi}{2}} \frac{\sin x}{\sin x + \cos x} dx
$$

由区间再现：
$$
I = \int_0^{\frac{\pi}{2}} \frac{\cos x}{\sin x + \cos x} dx
$$

两式相加：
$$
2I = \int_0^{\frac{\pi}{2}} \frac{\sin x + \cos x}{\sin x + \cos x} dx = \int_0^{\frac{\pi}{2}} dx = \frac{\pi}{2}
$$

$$
I = \frac{\pi}{4}
$$

#### 题型3：华里士公式

$$
\int_0^{\frac{\pi}{2}} \sin^n x \, dx = \int_0^{\frac{\pi}{2}} \cos^n x \, dx = 
\begin{cases}
\frac{n-1}{n} \cdot \frac{n-3}{n-2} \cdots \frac{1}{2} \cdot \frac{\pi}{2} & n \text{为偶数} \\
\frac{n-1}{n} \cdot \frac{n-3}{n-2} \cdots \frac{2}{3} \cdot 1 & n \text{为奇数}
\end{cases}
$$

**例22**：$\int_0^{\frac{\pi}{2}} \sin^4 x \, dx$

**解**：
$$
原式 = \frac{3}{4} \cdot \frac{1}{2} \cdot \frac{\pi}{2} = \frac{3\pi}{16}
$$

---

## 9. 微积分应用专题