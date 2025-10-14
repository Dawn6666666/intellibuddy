![(一)函数与极限](https://via.placeholder.com/800x200?text=Function+and+Limit)

# 高等数学A(上) - (一)函数与极限

函数与极限是微积分的基础，研究函数的性质和极限的概念。

---

# 高等数学A(上)

> 💡 **课程信息**
> - 学习时长：120小时
> - 难度等级：⭐⭐⭐ (中等)
> - 前置课程：高中数学

---

## 📚 课程概述

### 高等数学的重要性

高等数学是理工科学生的核心基础课程，为后续的专业课程（如物理、概率统计、算法分析等）提供必要的数学工具。

**应用领域：**
- 📊 **数据科学**：梯度下降、损失函数优化
- 🤖 **机器学习**：微分求导、多元函数极值
- 🎮 **图形学**：曲线绘制、空间变换
- 💰 **金融工程**：连续复利、期权定价

### 学习路线图

```
第1-3周：极限理论
    ↓
第4-6周：导数与微分
    ↓
第7-9周：微分中值定理与导数应用
    ↓
第10-12周：不定积分与定积分
```

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

### 1.7 无穷小与无穷大

#### 无穷小

**定义**：若 $\lim f(x) = 0$，则称 $f(x)$ 为无穷小。

**性质：**
1. 有限个无穷小的和仍是无穷小
2. 有界函数与无穷小的乘积是无穷小
3. 无穷小与无穷小的乘积是无穷小

#### 无穷小的比较

设 $\alpha, \beta$ 均为无穷小，且 $\beta \neq 0$：

**1. 高阶无穷小**：若 $\lim \frac{\alpha}{\beta} = 0$，记作 $\alpha = o(\beta)$

**2. 低阶无穷小**：若 $\lim \frac{\alpha}{\beta} = \infty$

**3. 同阶无穷小**：若 $\lim \frac{\alpha}{\beta} = C \neq 0$

**4. 等价无穷小**：若 $\lim \frac{\alpha}{\beta} = 1$，记作 $\alpha \sim \beta$

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

**常用等价无穷小表（$x \to 0$）：**

| 函数 | 等价无穷小 | 函数 | 等价无穷小 |
|------|------------|------|------------|
| $\sin x$ | $x$ | $\tan x$ | $x$ |
| $\arcsin x$ | $x$ | $\arctan x$ | $x$ |
| $1 - \cos x$ | $\frac{x^2}{2}$ | $\sec x - 1$ | $\frac{x^2}{2}$ |
| $e^x - 1$ | $x$ | $a^x - 1$ | $x \ln a$ |
| $\ln(1+x)$ | $x$ | $\log_a(1+x)$ | $\frac{x}{\ln a}$ |
| $(1+x)^{\alpha} - 1$ | $\alpha x$ | $\sqrt[n]{1+x} - 1$ | $\frac{x}{n}$ |

---

## 2. 导数与微分