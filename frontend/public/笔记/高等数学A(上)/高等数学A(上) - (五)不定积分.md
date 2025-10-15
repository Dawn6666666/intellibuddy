# 高等数学A(上) - (五)不定积分

不定积分是求导的逆运算，是积分学的基础。

---

## 5. 不定积分

### 5.1 原函数与不定积分

**定义**：若 $F'(x) = f(x)$，则称 $F(x)$ 为 $f(x)$ 的原函数。

$f(x)$ 的全体原函数称为不定积分，记作

$$
\int f(x) \, dx = F(x) + C
$$

**性质：**

$$
\int [f(x) \pm g(x)] \, dx = \int f(x) \, dx \pm \int g(x) \, dx
$$

$$
\int kf(x) \, dx = k \int f(x) \, dx
$$

### 5.2 基本积分公式

| 被积函数 | 不定积分 |
|----------|----------|
| $k$ | $kx + C$ |
| $x^n$ $(n \neq -1)$ | $\frac{x^{n+1}}{n+1} + C$ |
| $\frac{1}{x}$ | $\ln |x| + C$ |
| $e^x$ | $e^x + C$ |
| $a^x$ | $\frac{a^x}{\ln a} + C$ |
| $\sin x$ | $-\cos x + C$ |
| $\cos x$ | $\sin x + C$ |
| $\sec^2 x$ | $\tan x + C$ |
| $\csc^2 x$ | $-\cot x + C$ |
| $\sec x \tan x$ | $\sec x + C$ |
| $\frac{1}{\sqrt{1-x^2}}$ | $\arcsin x + C$ |
| $\frac{1}{1+x^2}$ | $\arctan x + C$ |

### 5.3 换元积分法

#### 第一换元法（凑微分）

$$
\int f[\varphi(x)] \varphi'(x) \, dx = \int f(u) \, du = F(u) + C = F[\varphi(x)] + C
$$

**示例：**

$$
\int 2x e^{x^2} \, dx = \int e^{x^2} \, d(x^2) = e^{x^2} + C
$$

$$
\int \frac{1}{1 + x^2} \, dx = \arctan x + C
$$

#### 第二换元法

**三角代换：**

| 形式 | 代换 |
|------|------|
| $\sqrt{a^2 - x^2}$ | $x = a \sin t$ |
| $\sqrt{a^2 + x^2}$ | $x = a \tan t$ |
| $\sqrt{x^2 - a^2}$ | $x = a \sec t$ |

**示例：** 求 $\int \sqrt{1 - x^2} \, dx$

令 $x = \sin t$，$dx = \cos t \, dt$

$$
\int \sqrt{1 - \sin^2 t} \cos t \, dt = \int \cos^2 t \, dt
$$

使用降幂公式：$\cos^2 t = \frac{1 + \cos 2t}{2}$

$$
\int \cos^2 t \, dt = \int \frac{1 + \cos 2t}{2} \, dt = \frac{t}{2} + \frac{\sin 2t}{4} + C
$$

$$
= \frac{t}{2} + \frac{2\sin t \cos t}{4} + C = \frac{t + \sin t \cos t}{2} + C
$$

代回原变量：$t = \arcsin x$，$\sin t = x$，$\cos t = \sqrt{1-x^2}$

$$
= \frac{\arcsin x + x\sqrt{1-x^2}}{2} + C
$$

**几何意义：** 这个积分表示上半圆 $y = \sqrt{1-x^2}$ 下的面积，结果包含扇形面积和三角形面积。

**更多三角代换示例：**

**例1：** $\int \frac{1}{\sqrt{x^2 + 4}} \, dx$

令 $x = 2\tan t$，$dx = 2\sec^2 t \, dt$

$$
\int \frac{2\sec^2 t}{\sqrt{4\tan^2 t + 4}} \, dt = \int \frac{2\sec^2 t}{2\sec t} \, dt = \int \sec t \, dt
$$

$$
= \ln|\sec t + \tan t| + C = \ln|\frac{\sqrt{x^2+4}}{2} + \frac{x}{2}| + C
$$

$$
= \ln|\sqrt{x^2+4} + x| + C_1
$$

**例2：** $\int \frac{1}{x^2\sqrt{x^2-1}} \, dx$ （$x > 1$）

令 $x = \sec t$，$dx = \sec t \tan t \, dt$

$$
\int \frac{\sec t \tan t}{\sec^2 t \sqrt{\sec^2 t - 1}} \, dt = \int \frac{\sec t \tan t}{\sec^2 t \tan t} \, dt = \int \frac{1}{\sec t} \, dt = \int \cos t \, dt
$$

$$
= \sin t + C = \frac{\sqrt{x^2-1}}{x} + C
$$

### 5.4 分部积分法

$$
\int u \, dv = uv - \int v \, du
$$

**口诀**：反对幂指三

- 反：反三角函数
- 对：对数函数
- 幂：幂函数
- 指：指数函数
- 三：三角函数

**示例：**

$$
\int x e^x \, dx = x e^x - \int e^x \, dx = x e^x - e^x + C = e^x(x - 1) + C
$$

$$
\int \ln x \, dx = x \ln x - \int x \cdot \frac{1}{x} \, dx = x \ln x - x + C
$$

---

**本章完**
