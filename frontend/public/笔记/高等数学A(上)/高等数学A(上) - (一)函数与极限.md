# 高等数学A(上) - (一)函数与极限

函数与极限是微积分的基础，研究函数的性质和极限的概念。

---

## 1. 函数与极限

### 1.1 函数的概念

**定义**：设 $D$ 是非空数集，若对 $\forall x \in D$，按照某种对应法则 $f$，都有唯一确定的实数 $y$ 与之对应，则称 $f$ 为定义在 $D$ 上的函数。

记作：$y = f(x)$，$x \in D$

**函数的三要素：**
1. 定义域 $D$
2. 对应法则 $f$
3. 值域 $R = \{y | y = f(x), x \in D\}$

### 1.2 基本初等函数

| 函数类型 | 表达式 | 定义域 | 值域 |
|---------|--------|--------|------|
| 幂函数 | $y = x^\alpha$ | $(-\infty, +\infty)$ | $[0, +\infty)$ |
| 指数函数 | $y = a^x$ $(a>0, a\neq 1)$ | $(-\infty, +\infty)$ | $(0, +\infty)$ |
| 对数函数 | $y = \log_a x$ | $(0, +\infty)$ | $(-\infty, +\infty)$ |
| 三角函数 | $y = \sin x$ | $(-\infty, +\infty)$ | $[-1, 1]$ |
| 反三角函数 | $y = \arcsin x$ | $[-1, 1]$ | $[-\frac{\pi}{2}, \frac{\pi}{2}]$ |

### 1.3 极限的定义

#### 数列极限（$\epsilon-N$ 定义）

设 $\{a_n\}$ 为数列，$A$ 为常数。若对 $\forall \epsilon > 0$，$\exists N \in \mathbb{N}^+$，当 $n > N$ 时，恒有

$$
|a_n - A| < \epsilon
$$

则称数列 $\{a_n\}$ 收敛于 $A$，记作

$$
\lim_{n \to \infty} a_n = A
$$

**几何意义**：$n$ 充分大后，$a_n$ 落在 $(A-\epsilon, A+\epsilon)$ 内。

**示例：**

证明：$\lim_{n \to \infty} \frac{1}{n} = 0$

**证明**：

$$
\forall \epsilon > 0, \text{取} N = [\frac{1}{\epsilon}]
$$

当 $n > N$ 时，有

$$
|\frac{1}{n} - 0| = \frac{1}{n} < \frac{1}{N} < \epsilon
$$

#### 函数极限（$\epsilon-\delta$ 定义）

设函数 $f(x)$ 在点 $x_0$ 的某去心邻域内有定义。若对 $\forall \epsilon > 0$，$\exists \delta > 0$，当 $0 < |x - x_0| < \delta$ 时，恒有

$$
|f(x) - A| < \epsilon
$$

则称 $f(x)$ 在 $x \to x_0$ 时的极限为 $A$，记作

$$
\lim_{x \to x_0} f(x) = A
$$

### 1.4 极限的性质

**1. 唯一性**：若极限存在，则极限唯一

**2. 局部有界性**：若 $\lim_{x \to x_0} f(x) = A$，则 $f(x)$ 在 $x_0$ 的某去心邻域内有界

**3. 局部保号性**：若 $\lim_{x \to x_0} f(x) = A > 0$，则存在 $\delta > 0$，当 $0 < |x - x_0| < \delta$ 时，$f(x) > 0$

### 1.5 极限运算法则

设 $\lim f(x) = A$，$\lim g(x) = B$，则：

**1. 四则运算**

$$
\lim [f(x) \pm g(x)] = A \pm B
$$

$$
\lim [f(x) \cdot g(x)] = A \cdot B
$$

$$
\lim \frac{f(x)}{g(x)} = \frac{A}{B} \quad (B \neq 0)
$$

**2. 复合函数极限**

若 $\lim_{x \to x_0} g(x) = u_0$，$\lim_{u \to u_0} f(u) = A$，则

$$
\lim_{x \to x_0} f[g(x)] = A
$$

### 1.6 重要极限

**1. 第一重要极限**

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$

**应用示例：**

**例1：** $\lim_{x \to 0} \frac{\tan x}{x}$

$$
\lim_{x \to 0} \frac{\tan x}{x} = \lim_{x \to 0} \frac{\sin x}{x \cos x} = \lim_{x \to 0} \frac{\sin x}{x} \cdot \frac{1}{\cos x} = 1 \cdot 1 = 1
$$

**例2：** $\lim_{x \to 0} \frac{1 - \cos x}{x^2}$

**方法1（半角公式）：**
$$
1 - \cos x = 2\sin^2 \frac{x}{2}
$$

$$
\lim_{x \to 0} \frac{1 - \cos x}{x^2} = \lim_{x \to 0} \frac{2\sin^2 \frac{x}{2}}{x^2} = \lim_{x \to 0} \frac{2\sin^2 \frac{x}{2}}{4(\frac{x}{2})^2} = \frac{2}{4} \cdot 1 = \frac{1}{2}
$$

**方法2（洛必达法则）：**
$$
\lim_{x \to 0} \frac{1 - \cos x}{x^2} = \lim_{x \to 0} \frac{\sin x}{2x} = \frac{1}{2}
$$

**例3：** $\lim_{x \to 0} \frac{\sin 3x}{\sin 5x}$

$$
\lim_{x \to 0} \frac{\sin 3x}{\sin 5x} = \lim_{x \to 0} \frac{\sin 3x}{3x} \cdot \frac{5x}{\sin 5x} \cdot \frac{3x}{5x} = 1 \cdot 1 \cdot \frac{3}{5} = \frac{3}{5}
$$

**几何直观理解：**

当 $x$ 很小时，扇形面积 ≈ 三角形面积，即：
$$
\frac{1}{2} \cdot 1^2 \cdot x \approx \frac{1}{2} \cdot 1 \cdot \sin x
$$

因此 $\sin x \approx x$，这就是第一重要极限的几何背景。

**2. 第二重要极限**

$$
\lim_{x \to \infty} (1 + \frac{1}{x})^x = e
$$

或等价形式：

$$
\lim_{x \to 0} (1 + x)^{\frac{1}{x}} = e
$$

**推广形式：**

$$
\lim_{x \to \infty} (1 + \frac{k}{x})^x = e^k
$$

**应用示例：**

**例1：** $\lim_{x \to \infty} (1 + \frac{2}{x})^x$

$$
\lim_{x \to \infty} (1 + \frac{2}{x})^x = e^2
$$

**例2：** $\lim_{x \to \infty} (\frac{x+1}{x})^x$

$$
\lim_{x \to \infty} (\frac{x+1}{x})^x = \lim_{x \to \infty} (1 + \frac{1}{x})^x = e
$$

**例3：** $\lim_{x \to 0} (1 + 3x)^{\frac{1}{x}}$

令 $t = \frac{1}{3x}$，当 $x \to 0$ 时，$t \to \infty$

$$
\lim_{x \to 0} (1 + 3x)^{\frac{1}{x}} = \lim_{t \to \infty} (1 + \frac{1}{t})^{3t} = [\lim_{t \to \infty} (1 + \frac{1}{t})^t]^3 = e^3
$$

**实际应用：复利计算**

银行存款年利率为 $r$，一年内复利 $n$ 次，本金为 $P$，则一年后金额为：

$$
A = P(1 + \frac{r}{n})^n
$$

当 $n \to \infty$（连续复利）时：

$$
A = P \lim_{n \to \infty} (1 + \frac{r}{n})^n = Pe^r
$$

### 1.7 函数的性质

#### 有界性

**定义**：若存在 $M > 0$，使得 $|f(x)| \leq M$ 对所有 $x \in D$ 成立，则称 $f(x)$ 在 $D$ 上有界。

**示例：**

**例1**：$f(x) = \sin x$ 在 $(-\infty, +\infty)$ 上有界，$M = 1$

**例2**：$f(x) = x^2$ 在 $(-\infty, +\infty)$ 上无界

#### 单调性

**定义**：设 $f(x)$ 在区间 $I$ 上有定义

- 若对 $\forall x_1, x_2 \in I$，当 $x_1 < x_2$ 时，有 $f(x_1) \leq f(x_2)$，则称 $f(x)$ 在 $I$ 上**单调递增**
- 若对 $\forall x_1, x_2 \in I$，当 $x_1 < x_2$ 时，有 $f(x_1) \geq f(x_2)$，则称 $f(x)$ 在 $I$ 上**单调递减**

#### 奇偶性

**定义**：设 $f(x)$ 的定义域关于原点对称

- 若 $f(-x) = f(x)$，则称 $f(x)$ 为**偶函数**（图像关于 $y$ 轴对称）
- 若 $f(-x) = -f(x)$，则称 $f(x)$ 为**奇函数**（图像关于原点对称）

**性质：**

1. 奇函数 ± 奇函数 = 奇函数
2. 偶函数 ± 偶函数 = 偶函数
3. 奇函数 × 奇函数 = 偶函数
4. 偶函数 × 偶函数 = 偶函数
5. 奇函数 × 偶函数 = 奇函数

#### 周期性

**定义**：若存在 $T > 0$，使得对所有 $x \in D$，都有 $f(x + T) = f(x)$，则称 $f(x)$ 为**周期函数**，$T$ 称为周期。

**示例：**

- $\sin x$，$\cos x$ 的周期为 $2\pi$
- $\tan x$，$\cot x$ 的周期为 $\pi$

### 1.8 数列极限

#### 数列极限的定义

设 $\{a_n\}$ 为数列，$A$ 为常数。若对 $\forall \epsilon > 0$，$\exists N \in \mathbb{N}^+$，当 $n > N$ 时，恒有

$$
|a_n - A| < \epsilon
$$

则称数列 $\{a_n\}$ 收敛于 $A$，记作

$$
\lim_{n \to \infty} a_n = A
$$

**几何意义**：当 $n$ 充分大后，所有 $a_n$ 都落在 $(A - \epsilon, A + \epsilon)$ 区间内。

#### 用定义证明极限

**例1**：证明 $\lim_{n \to \infty} \frac{1}{n^2} = 0$

**证明**：

对 $\forall \epsilon > 0$，要使

$$
|\frac{1}{n^2} - 0| = \frac{1}{n^2} < \epsilon
$$

即 $n > \frac{1}{\sqrt{\epsilon}}$

取 $N = [\frac{1}{\sqrt{\epsilon}}]$，当 $n > N$ 时，

$$
|\frac{1}{n^2} - 0| = \frac{1}{n^2} < \frac{1}{N^2} < \epsilon
$$

所以 $\lim_{n \to \infty} \frac{1}{n^2} = 0$

**例2**：证明 $\lim_{n \to \infty} \frac{n}{n+1} = 1$

**证明**：

$$
|\frac{n}{n+1} - 1| = |\frac{n - (n+1)}{n+1}| = \frac{1}{n+1} < \frac{1}{n}
$$

对 $\forall \epsilon > 0$，取 $N = [\frac{1}{\epsilon}]$，当 $n > N$ 时，

$$
|\frac{n}{n+1} - 1| < \frac{1}{n} < \epsilon
$$

所以 $\lim_{n \to \infty} \frac{n}{n+1} = 1$

#### 数列极限的性质

**1. 唯一性**：若数列 $\{a_n\}$ 收敛，则极限唯一

**2. 有界性**：若 $\lim_{n \to \infty} a_n = A$，则 $\{a_n\}$ 有界

**3. 保号性**：若 $\lim_{n \to \infty} a_n = A > 0$，则存在 $N$，当 $n > N$ 时，$a_n > 0$

**4. 夹逼定理**：若 $a_n \leq b_n \leq c_n$ 且 $\lim a_n = \lim c_n = A$，则 $\lim b_n = A$

**夹逼定理应用示例：**

**例3**：求 $\lim_{n \to \infty} \frac{1 + 2 + 3 + \cdots + n}{n^2}$

**解**：

$$
\frac{n(n+1)}{2n^2} = \frac{n+1}{2n} = \frac{1}{2} + \frac{1}{2n}
$$

当 $n \to \infty$ 时，

$$
\lim_{n \to \infty} \frac{1 + 2 + 3 + \cdots + n}{n^2} = \frac{1}{2}
$$

**例4**：求 $\lim_{n \to \infty} (\frac{1}{\sqrt{n^2+1}} + \frac{1}{\sqrt{n^2+2}} + \cdots + \frac{1}{\sqrt{n^2+n}})$

**解**：

$$
\frac{n}{\sqrt{n^2+n}} \leq \sum_{k=1}^{n} \frac{1}{\sqrt{n^2+k}} \leq \frac{n}{\sqrt{n^2+1}}
$$

$$
\lim_{n \to \infty} \frac{n}{\sqrt{n^2+n}} = \lim_{n \to \infty} \frac{1}{\sqrt{1+\frac{1}{n}}} = 1
$$

$$
\lim_{n \to \infty} \frac{n}{\sqrt{n^2+1}} = \lim_{n \to \infty} \frac{1}{\sqrt{1+\frac{1}{n^2}}} = 1
$$

由夹逼定理，原极限 $= 1$

### 1.9 函数极限的性质

#### 函数极限与数列极限的关系（海涅定理）

**定理**：$\lim_{x \to x_0} f(x) = A$ 的充要条件是：对任意满足 $\lim_{n \to \infty} x_n = x_0$（且 $x_n \neq x_0$）的数列 $\{x_n\}$，都有 $\lim_{n \to \infty} f(x_n) = A$

**应用：**

1. 用数列极限证明函数极限
2. 用数列极限否定函数极限的存在性

**例5**：证明 $\lim_{x \to 0} \sin \frac{1}{x}$ 不存在

**证明**：

取 $x_n = \frac{1}{2n\pi}$，则 $\lim_{n \to \infty} x_n = 0$

$$
f(x_n) = \sin(2n\pi) = 0 \to 0
$$

取 $y_n = \frac{1}{2n\pi + \frac{\pi}{2}}$，则 $\lim_{n \to \infty} y_n = 0$

$$
f(y_n) = \sin(2n\pi + \frac{\pi}{2}) = 1 \to 1
$$

由于两个数列的函数值极限不同，所以 $\lim_{x \to 0} \sin \frac{1}{x}$ 不存在。

### 1.10 无穷小与无穷大

#### 无穷小

**定义**：若 $\lim f(x) = 0$，则称 $f(x)$ 为无穷小。

**性质：**

1. 有限个无穷小的和仍是无穷小
2. 有界函数与无穷小的乘积是无穷小
3. 无穷小与无穷小的乘积是无穷小
4. 常数与无穷小的乘积是无穷小（常数 $\neq 0$）

**注意**：无穷小是变量，不是一个很小的数！

#### 无穷大

**定义**：若对 $\forall M > 0$，$\exists \delta > 0$，当 $0 < |x - x_0| < \delta$ 时，有 $|f(x)| > M$，则称 $f(x)$ 为当 $x \to x_0$ 时的无穷大，记作

$$
\lim_{x \to x_0} f(x) = \infty
$$

**无穷小与无穷大的关系：**

在同一极限过程中，若 $f(x)$ 为无穷大，则 $\frac{1}{f(x)}$ 为无穷小；反之亦然。

**例6**：$\lim_{x \to 0} \frac{1}{x^2} = \infty$，$\lim_{x \to \infty} \frac{1}{x} = 0$

#### 无穷小的比较

设 $\alpha, \beta$ 均为无穷小，且 $\beta \neq 0$：

**1. 高阶无穷小**：若 $\lim \frac{\alpha}{\beta} = 0$，记作 $\alpha = o(\beta)$

读作："$\alpha$ 是 $\beta$ 的高阶无穷小"

**2. 低阶无穷小**：若 $\lim \frac{\alpha}{\beta} = \infty$

**3. 同阶无穷小**：若 $\lim \frac{\alpha}{\beta} = C \neq 0$

**4. 等价无穷小**：若 $\lim \frac{\alpha}{\beta} = 1$，记作 $\alpha \sim \beta$

读作："$\alpha$ 与 $\beta$ 等价"

**5. k阶无穷小**：若 $\lim \frac{\alpha}{\beta^k} = C \neq 0$（$k > 0$），则称 $\alpha$ 是 $\beta$ 的 $k$ 阶无穷小

**常用等价无穷小**（$x \to 0$）：

$$
\sin x \sim x
$$

$$
\tan x \sim x
$$

$$
\arcsin x \sim x
$$

$$
\arctan x \sim x
$$

$$
1 - \cos x \sim \frac{x^2}{2}
$$

$$
e^x - 1 \sim x
$$

$$
\ln(1 + x) \sim x
$$

$$
(1 + x)^\alpha - 1 \sim \alpha x
$$

$$
a^x - 1 \sim x \ln a
$$

$$
\sqrt[n]{1+x} - 1 \sim \frac{x}{n}
$$

**等价无穷小的应用技巧：**

**例1：** $\lim_{x \to 0} \frac{\tan x - \sin x}{x^3}$

**方法1（泰勒展开）：**
$$
\tan x = x + \frac{x^3}{3} + o(x^3), \quad \sin x = x - \frac{x^3}{6} + o(x^3)
$$

$$
\lim_{x \to 0} \frac{\tan x - \sin x}{x^3} = \lim_{x \to 0} \frac{(x + \frac{x^3}{3}) - (x - \frac{x^3}{6})}{x^3} = \lim_{x \to 0} \frac{\frac{x^3}{3} + \frac{x^3}{6}}{x^3} = \frac{1}{2}
$$

**方法2（等价无穷小）：**
$$
\tan x - \sin x = \sin x(\frac{1}{\cos x} - 1) = \sin x \cdot \frac{1 - \cos x}{\cos x}
$$

当 $x \to 0$ 时：$\sin x \sim x$，$1 - \cos x \sim \frac{x^2}{2}$，$\cos x \to 1$

$$
\lim_{x \to 0} \frac{\tan x - \sin x}{x^3} = \lim_{x \to 0} \frac{x \cdot \frac{x^2}{2}}{x^3} = \frac{1}{2}
$$

**例2：** $\lim_{x \to 0} \frac{e^x - 1 - x}{x^2}$

由于 $e^x - 1 \sim x$，但这里需要更精确的展开：
$$
e^x = 1 + x + \frac{x^2}{2} + o(x^2)
$$

$$
\lim_{x \to 0} \frac{e^x - 1 - x}{x^2} = \lim_{x \to 0} \frac{\frac{x^2}{2}}{x^2} = \frac{1}{2}
$$

**例3：** $\lim_{x \to 0} \frac{\sqrt{1+x} - 1}{x}$

使用 $(1+x)^{\alpha} - 1 \sim \alpha x$：
$$
\sqrt{1+x} - 1 = (1+x)^{\frac{1}{2}} - 1 \sim \frac{1}{2}x
$$

$$
\lim_{x \to 0} \frac{\sqrt{1+x} - 1}{x} = \frac{1}{2}
$$

**等价无穷小使用原则：**

✅ **可以替换的情况**：
1. 乘除因子中可以替换
2. 幂指数中可以替换

❌ **不能替换的情况**：
1. 加减运算中不能直接替换（需展开）
2. 被积函数中要谨慎使用

**常用等价无穷小表（$x \to 0$）：**

| 函数 | 等价无穷小 | 函数 | 等价无穷小 |
|------|------------|------|------------|
| $\sin x$ | $x$ | $\tan x$ | $x$ |
| $\arcsin x$ | $x$ | $\arctan x$ | $x$ |
| $1 - \cos x$ | $\frac{x^2}{2}$ | $\sec x - 1$ | $\frac{x^2}{2}$ |
| $e^x - 1$ | $x$ | $a^x - 1$ | $x \ln a$ |
| $\ln(1+x)$ | $x$ | $\log_a(1+x)$ | $\frac{x}{\ln a}$ |
| $(1+x)^{\alpha} - 1$ | $\alpha x$ | $\sqrt[n]{1+x} - 1$ | $\frac{x}{n}$ |
| $x - \sin x$ | $\frac{x^3}{6}$ | $\arcsin x - x$ | $\frac{x^3}{6}$ |
| $\tan x - x$ | $\frac{x^3}{3}$ | $x - \arctan x$ | $\frac{x^3}{3}$ |
| $x - \ln(1+x)$ | $\frac{x^2}{2}$ | $\ln(1+x) - x$ | $-\frac{x^2}{2}$ |

### 1.11 连续性

#### 连续的定义

**定义1**（$\epsilon-\delta$ 语言）：设函数 $f(x)$ 在点 $x_0$ 的某邻域内有定义，若对 $\forall \epsilon > 0$，$\exists \delta > 0$，当 $|x - x_0| < \delta$ 时，有

$$
|f(x) - f(x_0)| < \epsilon
$$

则称 $f(x)$ 在点 $x_0$ 处连续。

**定义2**（极限语言）：若

$$
\lim_{x \to x_0} f(x) = f(x_0)
$$

则称 $f(x)$ 在点 $x_0$ 处连续。

**定义3**（增量语言）：令 $\Delta x = x - x_0$，$\Delta y = f(x) - f(x_0)$，若

$$
\lim_{\Delta x \to 0} \Delta y = 0
$$

则称 $f(x)$ 在点 $x_0$ 处连续。

**三个定义等价**，都要求：
1. $f(x_0)$ 有定义
2. $\lim_{x \to x_0} f(x)$ 存在
3. $\lim_{x \to x_0} f(x) = f(x_0)$

#### 间断点及其分类

若 $f(x)$ 在点 $x_0$ 处不连续，则称 $x_0$ 为 $f(x)$ 的**间断点**。

**第一类间断点**：左右极限都存在

1. **可去间断点**：$\lim_{x \to x_0^-} f(x) = \lim_{x \to x_0^+} f(x) \neq f(x_0)$

**例**：$f(x) = \frac{\sin x}{x}$ 在 $x = 0$ 处（如果 $f(0)$ 无定义或不等于 $1$）

2. **跳跃间断点**：$\lim_{x \to x_0^-} f(x) \neq \lim_{x \to x_0^+} f(x)$

**例**：$f(x) = \text{sign}(x) = \begin{cases} 1, & x > 0 \\ 0, & x = 0 \\ -1, & x < 0 \end{cases}$ 在 $x = 0$ 处

**第二类间断点**：左右极限至少有一个不存在

1. **无穷间断点**：$\lim_{x \to x_0} f(x) = \infty$

**例**：$f(x) = \frac{1}{x}$ 在 $x = 0$ 处

2. **振荡间断点**：函数在点附近振荡

**例**：$f(x) = \sin \frac{1}{x}$ 在 $x = 0$ 处

#### 连续函数的性质

**1. 连续函数的四则运算**

若 $f(x)$，$g(x)$ 在点 $x_0$ 处连续，则 $f \pm g$，$f \cdot g$，$\frac{f}{g}$（$g(x_0) \neq 0$）在 $x_0$ 处连续。

**2. 复合函数的连续性**

若 $u = g(x)$ 在 $x_0$ 处连续，$g(x_0) = u_0$，且 $y = f(u)$ 在 $u_0$ 处连续，则复合函数 $y = f[g(x)]$ 在 $x_0$ 处连续。

**3. 初等函数的连续性**

**基本初等函数**在其定义域内都是连续的。

**初等函数**在其定义区间内都是连续的。

**注意**："定义区间"不一定等于"定义域"！

**例**：$f(x) = \frac{1}{x-1}$ 的定义域为 $(-\infty, 1) \cup (1, +\infty)$，在 $(-\infty, 1)$ 和 $(1, +\infty)$ 两个定义区间内分别连续。

#### 闭区间上连续函数的性质

设 $f(x)$ 在 $[a, b]$ 上连续，则：

**1. 有界性定理**：$f(x)$ 在 $[a, b]$ 上有界

即存在 $M > 0$，使得 $|f(x)| \leq M$ 对所有 $x \in [a, b]$ 成立。

**2. 最值定理**：$f(x)$ 在 $[a, b]$ 上有最大值和最小值

即存在 $x_1, x_2 \in [a, b]$，使得对所有 $x \in [a, b]$，有

$$
f(x_1) \leq f(x) \leq f(x_2)
$$

**3. 介值定理**：若 $f(a) \neq f(b)$，则对 $\forall \mu$ 介于 $f(a)$ 和 $f(b)$ 之间，至少存在一点 $\xi \in (a, b)$，使得

$$
f(\xi) = \mu
$$

**4. 零点定理**（介值定理的特殊情况）：若 $f(a) \cdot f(b) < 0$，则至少存在一点 $\xi \in (a, b)$，使得

$$
f(\xi) = 0
$$

**零点定理应用示例：**

**例7**：证明方程 $x^3 - 3x + 1 = 0$ 在 $(0, 1)$ 内至少有一个根。

**证明**：

令 $f(x) = x^3 - 3x + 1$，$f(x)$ 在 $[0, 1]$ 上连续。

$$
f(0) = 1 > 0, \quad f(1) = -1 < 0
$$

$$
f(0) \cdot f(1) < 0
$$

由零点定理，至少存在 $\xi \in (0, 1)$，使得 $f(\xi) = 0$。

所以方程在 $(0, 1)$ 内至少有一个根。

**例8**：证明方程 $\sin x = x - 1$ 有唯一实根。

**证明**：

令 $f(x) = \sin x - x + 1$，$f(x)$ 在 $\mathbb{R}$ 上连续。

$$
f(0) = 1 > 0, \quad f(\pi) = -\pi + 1 < 0
$$

由零点定理，至少存在一个根 $\xi \in (0, \pi)$。

又因为 $f'(x) = \cos x - 1 \leq 0$，所以 $f(x)$ 单调递减，至多一个根。

综上，方程有唯一实根。

### 1.12 极限计算综合技巧

#### 技巧1：抓大头法（$x \to \infty$）

当 $x \to \infty$ 时，多项式、指数函数中**抓主导项**。

**例9**：$\lim_{x \to \infty} \frac{2x^3 + 5x - 1}{3x^3 - 2x^2 + 7}$

**解**：

$$
原式 = \lim_{x \to \infty} \frac{2x^3(1 + \frac{5}{2x^2} - \frac{1}{2x^3})}{3x^3(1 - \frac{2}{3x} + \frac{7}{3x^3})} = \frac{2}{3}
$$

**例10**：$\lim_{x \to \infty} \frac{e^x + x^{100}}{e^x + x^{1000}}$

**解**：指数函数 $e^x$ 增长速度远大于多项式，所以

$$
原式 = \lim_{x \to \infty} \frac{e^x(1 + \frac{x^{100}}{e^x})}{e^x(1 + \frac{x^{1000}}{e^x})} = \frac{1}{1} = 1
$$

#### 技巧2：分子分母有理化

**例11**：$\lim_{x \to 0} \frac{\sqrt{1+x} - 1}{x}$

**解**：

$$
原式 = \lim_{x \to 0} \frac{(\sqrt{1+x} - 1)(\sqrt{1+x} + 1)}{x(\sqrt{1+x} + 1)} = \lim_{x \to 0} \frac{x}{x(\sqrt{1+x} + 1)} = \frac{1}{2}
$$

**例12**：$\lim_{x \to 0} \frac{\sqrt{1+x^2} - \sqrt{1-x^2}}{x^2}$

**解**：

$$
原式 = \lim_{x \to 0} \frac{(1+x^2) - (1-x^2)}{x^2(\sqrt{1+x^2} + \sqrt{1-x^2})} = \lim_{x \to 0} \frac{2x^2}{x^2 \cdot 2} = 1
$$

#### 技巧3：变量代换

**例13**：$\lim_{x \to 1} \frac{\sqrt{x} - 1}{\sqrt[3]{x} - 1}$

**解**：令 $t = \sqrt[6]{x}$，当 $x \to 1$ 时，$t \to 1$

$$
\sqrt{x} = t^3, \quad \sqrt[3]{x} = t^2
$$

$$
原式 = \lim_{t \to 1} \frac{t^3 - 1}{t^2 - 1} = \lim_{t \to 1} \frac{(t-1)(t^2+t+1)}{(t-1)(t+1)} = \lim_{t \to 1} \frac{t^2+t+1}{t+1} = \frac{3}{2}
$$

#### 技巧4：洛必达法则的灵活运用

**例14**：$\lim_{x \to 0} \frac{x - \sin x}{x^3}$

**解**（连用三次洛必达）：

$$
\begin{align}
原式 &= \lim_{x \to 0} \frac{1 - \cos x}{3x^2} \quad (\frac{0}{0}) \\
&= \lim_{x \to 0} \frac{\sin x}{6x} \quad (\frac{0}{0}) \\
&= \lim_{x \to 0} \frac{\cos x}{6} = \frac{1}{6}
\end{align}
$$

#### 技巧5：泰勒展开（麦克劳林公式）

当 $x \to 0$ 时，常用泰勒展开：

$$
e^x = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + o(x^3)
$$

$$
\sin x = x - \frac{x^3}{3!} + \frac{x^5}{5!} + o(x^5)
$$

$$
\cos x = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} + o(x^4)
$$

$$
\ln(1+x) = x - \frac{x^2}{2} + \frac{x^3}{3} + o(x^3)
$$

$$
(1+x)^\alpha = 1 + \alpha x + \frac{\alpha(\alpha-1)}{2}x^2 + o(x^2)
$$

**例15**：$\lim_{x \to 0} \frac{e^x - 1 - x - \frac{x^2}{2}}{x^3}$

**解**：

$$
e^x = 1 + x + \frac{x^2}{2} + \frac{x^3}{6} + o(x^3)
$$

$$
e^x - 1 - x - \frac{x^2}{2} = \frac{x^3}{6} + o(x^3)
$$

$$
原式 = \lim_{x \to 0} \frac{\frac{x^3}{6} + o(x^3)}{x^3} = \frac{1}{6}
$$

### 1.13 极限存在准则

#### 单调有界准则

**定理**：单调有界数列必有极限。

具体地：
- 单调递增有上界 ⟹ 数列收敛
- 单调递减有下界 ⟹ 数列收敛

**应用示例：**

**例16**：证明数列 $a_n = (1 + \frac{1}{n})^n$ 收敛。

**证明**：

1. **单调性**：可以证明 $a_n < a_{n+1}$（单调递增）
2. **有界性**：可以证明 $a_n < 3$（有上界）

由单调有界准则，$\{a_n\}$ 收敛，其极限记为 $e$。

#### 夹逼准则

已在1.8节介绍，这里补充一个经典例题：

**例17**：求 $\lim_{n \to \infty} \sqrt[n]{a_1^n + a_2^n + \cdots + a_k^n}$（$a_1, a_2, \ldots, a_k > 0$）

**解**：

设 $a_{\max} = \max\{a_1, a_2, \ldots, a_k\}$

$$
a_{\max} = \sqrt[n]{a_{\max}^n} \leq \sqrt[n]{a_1^n + a_2^n + \cdots + a_k^n} \leq \sqrt[n]{k \cdot a_{\max}^n} = \sqrt[n]{k} \cdot a_{\max}
$$

当 $n \to \infty$ 时，$\sqrt[n]{k} \to 1$

由夹逼准则：

$$
\lim_{n \to \infty} \sqrt[n]{a_1^n + a_2^n + \cdots + a_k^n} = a_{\max}
$$

---

**本章完**
