# 微积分II - (五)典型例题详解

总结常见题型和解题方法。

---

## 5. 典型例题详解

### 5.1 多元函数微分学

**例题1：求偏导数**

求 $f(x, y) = x^3 + 2x^2y - y^3$ 的偏导数。

**解：**

$$
\frac{\partial f}{\partial x} = 3x^2 + 4xy
$$

$$
\frac{\partial f}{\partial y} = 2x^2 - 3y^2
$$

**例题2：求全微分**

求 $z = e^{xy} + \ln(x+y)$ 的全微分。

**解：**

$$
\frac{\partial z}{\partial x} = ye^{xy} + \frac{1}{x+y}
$$

$$
\frac{\partial z}{\partial y} = xe^{xy} + \frac{1}{x+y}
$$

$$
dz = \left(ye^{xy} + \frac{1}{x+y}\right)dx + \left(xe^{xy} + \frac{1}{x+y}\right)dy
$$

**例题3：求极值**

求 $f(x, y) = x^2 + y^2 - 2x - 4y + 5$ 的极值。

**解：**

1. 求驻点：

$$
\frac{\partial f}{\partial x} = 2x - 2 = 0 \Rightarrow x = 1
$$

$$
\frac{\partial f}{\partial y} = 2y - 4 = 0 \Rightarrow y = 2
$$

驻点为 $(1, 2)$。

2. 判断极值性质：

$$
A = \frac{\partial^2 f}{\partial x^2} = 2, \quad B = \frac{\partial^2 f}{\partial x \partial y} = 0, \quad C = \frac{\partial^2 f}{\partial y^2} = 2
$$

$$
\Delta = AC - B^2 = 4 > 0, \quad A > 0
$$

因此 $(1, 2)$ 是极小值点，$f(1, 2) = 1 + 4 - 2 - 8 + 5 = 0$。

**例题4：条件极值（拉格朗日乘数法）**

求 $f(x, y) = x^2 + y^2$ 在约束 $x + y = 1$ 下的极值。

**解：**

构造拉格朗日函数：

$$
L(x, y, \lambda) = x^2 + y^2 + \lambda(x + y - 1)
$$

求偏导并令其为零：

$$
\frac{\partial L}{\partial x} = 2x + \lambda = 0
$$

$$
\frac{\partial L}{\partial y} = 2y + \lambda = 0
$$

$$
\frac{\partial L}{\partial \lambda} = x + y - 1 = 0
$$

由前两式得 $x = y$，代入第三式得 $x = y = \frac{1}{2}$。

极值为 $f\left(\frac{1}{2}, \frac{1}{2}\right) = \frac{1}{4} + \frac{1}{4} = \frac{1}{2}$。

### 5.2 重积分计算

**例题5：二重积分（直角坐标）**

计算 $\iint_D xy \, dA$，其中 $D = \{(x,y) | 0 \leq x \leq 1, 0 \leq y \leq x\}$。

**解：**

$$
\begin{aligned}
\iint_D xy \, dA &= \int_0^1 \int_0^x xy \, dy \, dx \\
&= \int_0^1 x \left[ \frac{y^2}{2} \right]_0^x dx \\
&= \int_0^1 \frac{x^3}{2} dx \\
&= \left[ \frac{x^4}{8} \right]_0^1 = \frac{1}{8}
\end{aligned}
$$

**例题6：二重积分（极坐标）**

计算 $\iint_D e^{x^2+y^2} \, dA$，其中 $D$ 是圆盘 $x^2 + y^2 \leq 1$。

**解：**

使用极坐标 $x = r\cos\theta, y = r\sin\theta$：

$$
\begin{aligned}
\iint_D e^{x^2+y^2} \, dA &= \int_0^{2\pi} \int_0^1 e^{r^2} \cdot r \, dr \, d\theta \\
&= 2\pi \int_0^1 re^{r^2} dr \\
&= 2\pi \left[ \frac{e^{r^2}}{2} \right]_0^1 \\
&= \pi(e - 1)
\end{aligned}
$$

**例题7：三重积分**

计算 $\iiint_\Omega xyz \, dV$，其中 $\Omega = \{(x,y,z) | 0 \leq x \leq 1, 0 \leq y \leq 1, 0 \leq z \leq 1\}$。

**解：**

$$
\begin{aligned}
\iiint_\Omega xyz \, dV &= \int_0^1 \int_0^1 \int_0^1 xyz \, dz \, dy \, dx \\
&= \int_0^1 \int_0^1 xy \left[ \frac{z^2}{2} \right]_0^1 dy \, dx \\
&= \frac{1}{2} \int_0^1 \int_0^1 xy \, dy \, dx \\
&= \frac{1}{2} \int_0^1 x \left[ \frac{y^2}{2} \right]_0^1 dx \\
&= \frac{1}{4} \int_0^1 x \, dx = \frac{1}{8}
\end{aligned}
$$

**例题8：球坐标系**

计算球 $x^2 + y^2 + z^2 \leq R^2$ 的体积。

**解：**

使用球坐标 $x = r\sin\phi\cos\theta, y = r\sin\phi\sin\theta, z = r\cos\phi$，雅可比行列式 $J = r^2\sin\phi$：

$$
\begin{aligned}
V &= \iiint_\Omega dV \\
&= \int_0^{2\pi} \int_0^\pi \int_0^R r^2\sin\phi \, dr \, d\phi \, d\theta \\
&= 2\pi \int_0^\pi \sin\phi \left[ \frac{r^3}{3} \right]_0^R d\phi \\
&= \frac{2\pi R^3}{3} \int_0^\pi \sin\phi \, d\phi \\
&= \frac{2\pi R^3}{3} \cdot 2 = \frac{4\pi R^3}{3}
\end{aligned}
$$

### 5.3 线积分与面积分

**例题9：第一类曲线积分**

计算 $\int_L (x^2 + y^2) ds$，其中 $L$ 是从 $(0,0)$ 到 $(1,1)$ 的直线段。

**解：**

参数方程：$x = t, y = t, \quad 0 \leq t \leq 1$。

$$
ds = \sqrt{(dx)^2 + (dy)^2} = \sqrt{1 + 1} dt = \sqrt{2} dt
$$

$$
\begin{aligned}
\int_L (x^2 + y^2) ds &= \int_0^1 2t^2 \cdot \sqrt{2} dt \\
&= 2\sqrt{2} \int_0^1 t^2 dt \\
&= 2\sqrt{2} \left[ \frac{t^3}{3} \right]_0^1 = \frac{2\sqrt{2}}{3}
\end{aligned}
$$

**例题10：格林公式**

计算 $\oint_L (x^2 - y^2)dx + 2xy dy$，其中 $L$ 是圆 $x^2 + y^2 = R^2$ 的正向边界。

**解：**

应用格林公式：

$$
P = x^2 - y^2, \quad Q = 2xy
$$

$$
\frac{\partial Q}{\partial x} = 2y, \quad \frac{\partial P}{\partial y} = -2y
$$

$$
\begin{aligned}
\oint_L P dx + Q dy &= \iint_D \left( \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} \right) dA \\
&= \iint_D (2y + 2y) dA \\
&= 4 \iint_D y \, dA
\end{aligned}
$$

由对称性，$\iint_D y \, dA = 0$（圆关于x轴对称）。

因此 $\oint_L P dx + Q dy = 0$。

**例题11：高斯公式**

计算 $\iint_S x \, dydz + y \, dzdx + z \, dxdy$，其中 $S$ 是球面 $x^2 + y^2 + z^2 = R^2$ 的外侧。

**解：**

应用高斯公式：

$$
P = x, Q = y, R = z
$$

$$
\frac{\partial P}{\partial x} + \frac{\partial Q}{\partial y} + \frac{\partial R}{\partial z} = 1 + 1 + 1 = 3
$$

$$
\begin{aligned}
\iint_S P \, dydz + Q \, dzdx + R \, dxdy &= \iiint_\Omega 3 \, dV \\
&= 3 \cdot \frac{4\pi R^3}{3} \\
&= 4\pi R^3
\end{aligned}
$$

### 5.4 级数

**例题12：判断级数收敛性**

判断级数 $\sum_{n=1}^\infty \frac{1}{n^2}$ 的收敛性。

**解：**

使用p级数判别法：$\sum_{n=1}^\infty \frac{1}{n^p}$ 当 $p > 1$ 时收敛。

这里 $p = 2 > 1$，所以级数收敛。

事实上，$\sum_{n=1}^\infty \frac{1}{n^2} = \frac{\pi^2}{6}$（巴塞尔问题）。

**例题13：幂级数收敛域**

求幂级数 $\sum_{n=0}^\infty \frac{x^n}{n!}$ 的收敛域。

**解：**

使用比值判别法：

$$
\rho = \lim_{n \to \infty} \left| \frac{a_{n+1}}{a_n} \right| = \lim_{n \to \infty} \frac{x^{n+1}/(n+1)!}{x^n/n!} = \lim_{n \to \infty} \frac{|x|}{n+1} = 0 < 1
$$

对所有 $x \in \mathbb{R}$ 成立，所以收敛域为 $(-\infty, +\infty)$。

这个级数的和函数是 $e^x$。

**例题14：泰勒级数展开**

将 $f(x) = \sin x$ 在 $x = 0$ 处展开为泰勒级数。

**解：**

$$
f(x) = \sin x, \quad f(0) = 0
$$

$$
f'(x) = \cos x, \quad f'(0) = 1
$$

$$
f''(x) = -\sin x, \quad f''(0) = 0
$$

$$
f'''(x) = -\cos x, \quad f'''(0) = -1
$$

$$
f^{(4)}(x) = \sin x, \quad f^{(4)}(0) = 0
$$

泰勒展开式：

$$
\sin x = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \frac{x^7}{7!} + \cdots = \sum_{n=0}^\infty \frac{(-1)^n x^{2n+1}}{(2n+1)!}
$$

**例题15：傅里叶级数**

将周期为 $2\pi$ 的函数 $f(x) = x, \quad -\pi < x < \pi$ 展开为傅里叶级数。

**解：**

$$
a_0 = \frac{1}{\pi} \int_{-\pi}^\pi x \, dx = 0 \quad \text{（奇函数）}
$$

$$
a_n = \frac{1}{\pi} \int_{-\pi}^\pi x \cos(nx) dx = 0 \quad \text{（奇函数）}
$$

$$
\begin{aligned}
b_n &= \frac{1}{\pi} \int_{-\pi}^\pi x \sin(nx) dx \\
&= \frac{2}{\pi} \int_0^\pi x \sin(nx) dx \quad \text{（偶函数）} \\
&= \frac{2}{\pi} \left[ -\frac{x\cos(nx)}{n} + \frac{\sin(nx)}{n^2} \right]_0^\pi \\
&= \frac{2}{\pi} \cdot \frac{-\pi\cos(n\pi)}{n} \\
&= \frac{-2\cos(n\pi)}{n} = \frac{2(-1)^{n+1}}{n}
\end{aligned}
$$

傅里叶级数：

$$
x = 2\sum_{n=1}^\infty \frac{(-1)^{n+1}}{n} \sin(nx) = 2\left( \sin x - \frac{\sin 2x}{2} + \frac{\sin 3x}{3} - \cdots \right)
$$

### 5.5 微分方程

**例题16：一阶可分离变量方程**

求解 $\frac{dy}{dx} = \frac{y}{x}$。

**解：**

分离变量：

$$
\frac{dy}{y} = \frac{dx}{x}
$$

两边积分：

$$
\ln|y| = \ln|x| + C
$$

$$
y = Cx
$$

**例题17：一阶线性方程**

求解 $\frac{dy}{dx} + y = e^x$。

**解：**

标准形式：$\frac{dy}{dx} + P(x)y = Q(x)$，其中 $P(x) = 1, Q(x) = e^x$。

通解公式：

$$
y = e^{-\int P(x)dx} \left( \int Q(x) e^{\int P(x)dx} dx + C \right)
$$

$$
\begin{aligned}
y &= e^{-x} \left( \int e^x \cdot e^x dx + C \right) \\
&= e^{-x} \left( \int e^{2x} dx + C \right) \\
&= e^{-x} \left( \frac{e^{2x}}{2} + C \right) \\
&= \frac{e^x}{2} + Ce^{-x}
\end{aligned}
$$

**例题18：二阶常系数齐次方程**

求解 $y'' - 3y' + 2y = 0$。

**解：**

特征方程：$r^2 - 3r + 2 = 0$。

$$(r-1)(r-2) = 0 \Rightarrow r_1 = 1, r_2 = 2$$

通解：

$$
y = C_1 e^x + C_2 e^{2x}
$$

**例题19：二阶常系数非齐次方程**

求解 $y'' - 3y' + 2y = e^{3x}$。

**解：**

齐次方程通解：$y_h = C_1 e^x + C_2 e^{2x}$。

设特解 $y_p = Ae^{3x}$，代入原方程：

$$
9Ae^{3x} - 9Ae^{3x} + 2Ae^{3x} = e^{3x}
$$

$$
2A = 1 \Rightarrow A = \frac{1}{2}
$$

通解：

$$
y = C_1 e^x + C_2 e^{2x} + \frac{1}{2} e^{3x}
$$

**例题20：欧拉方程**

求解 $x^2y'' + xy' - y = 0$。

**解：**

设 $y = x^r$，则：

$$
y' = rx^{r-1}, \quad y'' = r(r-1)x^{r-2}
$$

代入方程：

$$
x^2 \cdot r(r-1)x^{r-2} + x \cdot rx^{r-1} - x^r = 0
$$

$$
r(r-1)x^r + rx^r - x^r = 0
$$

$$
[r(r-1) + r - 1]x^r = 0
$$

$$
r^2 - 1 = 0 \Rightarrow r_1 = 1, r_2 = -1
$$

通解：

$$
y = C_1 x + \frac{C_2}{x}
$$

---

**本章完**
