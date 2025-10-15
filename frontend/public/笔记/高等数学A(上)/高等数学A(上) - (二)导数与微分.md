# 高等数学A(上) - (二)导数与微分

导数描述函数的变化率，微分用于近似计算。

---

## 2. 导数与微分

### 2.1 导数的定义

**定义**：设函数 $y = f(x)$ 在点 $x_0$ 的某邻域内有定义，若极限

$$
\lim_{\Delta x \to 0} \frac{f(x_0 + \Delta x) - f(x_0)}{\Delta x}
$$

存在，则称 $f(x)$ 在 $x_0$ 处可导，该极限值称为 $f(x)$ 在 $x_0$ 处的导数，记作

$$
f'(x_0) \quad \text{或} \quad \frac{dy}{dx}\bigg|_{x=x_0}
$$

**等价形式：**

$$
f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}
$$

$$
f'(x_0) = \lim_{x \to x_0} \frac{f(x) - f(x_0)}{x - x_0}
$$

**几何意义**：导数是曲线 $y = f(x)$ 在点 $(x_0, f(x_0))$ 处的切线斜率。

**物理意义**：
- 位移函数 $s(t)$ 的导数是瞬时速度 $v(t) = s'(t)$
- 速度函数 $v(t)$ 的导数是瞬时加速度 $a(t) = v'(t) = s''(t)$

**实际应用示例：**

**例1：自由落体运动**

物体从高度 $h$ 自由下落，位移函数为：
$$
s(t) = \frac{1}{2}gt^2
$$

瞬时速度：$v(t) = s'(t) = gt$

瞬时加速度：$a(t) = v'(t) = g$

**例2：经济学中的边际概念**

成本函数 $C(x)$ 表示生产 $x$ 单位产品的总成本，则：
- 边际成本 = $C'(x)$（生产第 $x+1$ 单位产品的额外成本）
- 平均成本 = $\frac{C(x)}{x}$

**可导与连续的关系：**

1. 可导 ⟹ 连续（可导必连续）
2. 连续 ⟹ 可导（连续不一定可导）

**反例：** $f(x) = |x|$ 在 $x = 0$ 处连续但不可导

$$
f'_-(0) = \lim_{h \to 0^-} \frac{|h| - 0}{h} = \lim_{h \to 0^-} \frac{-h}{h} = -1
$$

$$
f'_+(0) = \lim_{h \to 0^+} \frac{|h| - 0}{h} = \lim_{h \to 0^+} \frac{h}{h} = 1
$$

由于左导数 ≠ 右导数，所以 $f(x) = |x|$ 在 $x = 0$ 处不可导。

### 2.2 基本导数公式

| 函数 | 导数 |
|------|------|
| $C$ （常数） | $0$ |
| $x^n$ | $nx^{n-1}$ |
| $\sin x$ | $\cos x$ |
| $\cos x$ | $-\sin x$ |
| $\tan x$ | $\sec^2 x$ |
| $\cot x$ | $-\csc^2 x$ |
| $e^x$ | $e^x$ |
| $a^x$ | $a^x \ln a$ |
| $\ln x$ | $\frac{1}{x}$ |
| $\log_a x$ | $\frac{1}{x \ln a}$ |
| $\arcsin x$ | $\frac{1}{\sqrt{1-x^2}}$ |
| $\arccos x$ | $-\frac{1}{\sqrt{1-x^2}}$ |
| $\arctan x$ | $\frac{1}{1+x^2}$ |

### 2.3 求导法则

**1. 四则运算**

$$
(u \pm v)' = u' \pm v'
$$

$$
(uv)' = u'v + uv'
$$

$$
(\frac{u}{v})' = \frac{u'v - uv'}{v^2} \quad (v \neq 0)
$$

**2. 复合函数求导（链式法则）**

设 $y = f(u)$，$u = g(x)$，则

$$
\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}
$$

**示例：**

$$
y = \sin(2x + 1)
$$

$$
y' = \cos(2x + 1) \cdot 2 = 2\cos(2x + 1)
$$

**3. 反函数求导**

若 $y = f(x)$ 的反函数为 $x = \varphi(y)$，则

$$
\frac{dx}{dy} = \frac{1}{\frac{dy}{dx}}
$$

**示例：**

$$
y = \arcsin x \Rightarrow x = \sin y
$$

$$
\frac{dx}{dy} = \cos y = \sqrt{1 - \sin^2 y} = \sqrt{1 - x^2}
$$

$$
\frac{dy}{dx} = \frac{1}{\sqrt{1 - x^2}}
$$

**4. 隐函数求导**

**示例：** 求 $x^2 + y^2 = 1$ 的导数

两边对 $x$ 求导：

$$
2x + 2y \cdot y' = 0
$$

$$
y' = -\frac{x}{y}
$$

**5. 参数方程求导**

若 $\begin{cases} x = \varphi(t) \\ y = \psi(t) \end{cases}$，则

$$
\frac{dy}{dx} = \frac{\frac{dy}{dt}}{\frac{dx}{dt}} = \frac{\psi'(t)}{\varphi'(t)}
$$

**6. 对数求导法**

适用于幂指函数 $y = u(x)^{v(x)}$

**步骤：**
1. 两边取对数：$\ln y = v(x) \ln u(x)$
2. 两边对 $x$ 求导：$\frac{y'}{y} = v'(x) \ln u(x) + v(x) \frac{u'(x)}{u(x)}$
3. 解出 $y'$

**示例：** 求 $y = x^x$ 的导数

$$
\ln y = x \ln x
$$

$$
\frac{y'}{y} = \ln x + x \cdot \frac{1}{x} = \ln x + 1
$$

$$
y' = x^x (\ln x + 1)
$$

**更多对数求导法示例：**

**例1：** 求 $y = x^{\sin x}$ 的导数

$$
\ln y = \sin x \ln x
$$

$$
\frac{y'}{y} = \cos x \ln x + \sin x \cdot \frac{1}{x}
$$

$$
y' = x^{\sin x} (\cos x \ln x + \frac{\sin x}{x})
$$

**例2：** 求 $y = \frac{x^2 \sqrt{x+1}}{(x-1)^3}$ 的导数

取对数：
$$
\ln y = 2\ln x + \frac{1}{2}\ln(x+1) - 3\ln(x-1)
$$

两边求导：
$$
\frac{y'}{y} = \frac{2}{x} + \frac{1}{2(x+1)} - \frac{3}{x-1}
$$

$$
y' = \frac{x^2 \sqrt{x+1}}{(x-1)^3} \left(\frac{2}{x} + \frac{1}{2(x+1)} - \frac{3}{x-1}\right)
$$

**综合求导练习：**

**例3：** 求 $y = e^{x^2} \sin(3x+1)$ 的导数

使用乘积法则和复合函数求导：
$$
y' = (e^{x^2})' \sin(3x+1) + e^{x^2} [\sin(3x+1)]'
$$

$$
= e^{x^2} \cdot 2x \cdot \sin(3x+1) + e^{x^2} \cdot \cos(3x+1) \cdot 3
$$

$$
= e^{x^2}[2x\sin(3x+1) + 3\cos(3x+1)]
$$

**例4：** 求 $y = \arctan(\frac{x}{1+x^2})$ 的导数

设 $u = \frac{x}{1+x^2}$，则 $y = \arctan u$

$$
\frac{dy}{dx} = \frac{1}{1+u^2} \cdot \frac{du}{dx}
$$

$$
\frac{du}{dx} = \frac{(1+x^2) \cdot 1 - x \cdot 2x}{(1+x^2)^2} = \frac{1-x^2}{(1+x^2)^2}
$$

$$
1 + u^2 = 1 + \frac{x^2}{(1+x^2)^2} = \frac{(1+x^2)^2 + x^2}{(1+x^2)^2} = \frac{1+2x^2+x^4+x^2}{(1+x^2)^2} = \frac{(1+x^2)^2}{(1+x^2)^2} = 1
$$

等等，让我重新计算：
$$
1 + u^2 = 1 + \frac{x^2}{(1+x^2)^2} = \frac{(1+x^2)^2 + x^2}{(1+x^2)^2}
$$

$$
= \frac{1+2x^2+x^4+x^2}{(1+x^2)^2} = \frac{1+3x^2+x^4}{(1+x^2)^2}
$$

实际上，更简单的方法是直接计算：
$$
y' = \frac{1}{1+(\frac{x}{1+x^2})^2} \cdot \frac{1-x^2}{(1+x^2)^2} = \frac{(1+x^2)^2}{(1+x^2)^2+x^2} \cdot \frac{1-x^2}{(1+x^2)^2} = \frac{1-x^2}{(1+x^2)^2+x^2}
$$

### 2.4 高阶导数

**定义**：$f(x)$ 的导数 $f'(x)$ 的导数称为二阶导数，记作

$$
f''(x), \quad \frac{d^2y}{dx^2}, \quad y''
$$

**n阶导数**：

$$
f^{(n)}(x) = [f^{(n-1)}(x)]'
$$

**常见函数的n阶导数：**

| 函数 | n阶导数 |
|------|---------|
| $e^x$ | $e^x$ |
| $a^x$ | $a^x (\ln a)^n$ |
| $\sin x$ | $\sin(x + \frac{n\pi}{2})$ |
| $\cos x$ | $\cos(x + \frac{n\pi}{2})$ |
| $\ln(1+x)$ | $(-1)^{n-1} \frac{(n-1)!}{(1+x)^n}$ |

**莱布尼茨公式**（乘积的n阶导数）：

$$
(uv)^{(n)} = \sum_{k=0}^{n} C_n^k u^{(k)} v^{(n-k)}
$$

---

**本章完**
