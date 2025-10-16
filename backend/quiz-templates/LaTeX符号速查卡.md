# 📐 LaTeX 符号速查卡

> 快速参考：在题库中使用 LaTeX 公式

## 🎯 基本格式

### 在 TypeScript 中

```typescript
{
  question: '函数 $f(x) = x^2$ 的导数是？',
  explanation: '根据公式：\n\n$$\nf\'(x) = 2x\n$$\n\n因此...'
}
```

### 在 JSON 中

```json
{
  "question": "函数 $f(x) = x^2$ 的导数是？",
  "explanation": "根据公式：\\n\\n$$\\nf'(x) = 2x\\n$$\\n\\n因此..."
}
```

**⚠️ 关键区别**：JSON 中反斜杠必须转义！`\` → `\\`

---

## 📊 常用符号表

### 基础运算

| 符号 | LaTeX | 示例 |
|------|-------|------|
| 分数 | `\frac{分子}{分母}` | `$\frac{1}{2}$` → $\frac{1}{2}$ |
| 根号 | `\sqrt{x}` | `$\sqrt{16}$` → $\sqrt{16}$ |
| n次根 | `\sqrt[n]{x}` | `$\sqrt[3]{8}$` → $\sqrt[3]{8}$ |
| 上标 | `x^{n}` | `$x^{2}$` → $x^{2}$ |
| 下标 | `x_{i}` | `$x_{i}$` → $x_{i}$ |
| 上下标 | `x_{i}^{2}` | `$x_{i}^{2}$` → $x_{i}^{2}$ |

### 微积分

| 符号 | LaTeX | 示例 |
|------|-------|------|
| 导数 | `f'(x)` 或 `\frac{d}{dx}` | `$f'(x)$` 或 `$\frac{dy}{dx}$` |
| 偏导 | `\frac{\partial f}{\partial x}` | `$\frac{\partial f}{\partial x}$` |
| 积分 | `\int f(x) \, dx` | `$\int x^2 \, dx$` |
| 定积分 | `\int_{a}^{b} f(x) \, dx` | `$\int_{0}^{1} x^2 \, dx$` |
| 二重积分 | `\iint` | `$\iint f(x,y) \, dx \, dy$` |
| 环路积分 | `\oint` | `$\oint \vec{E} \cdot d\vec{l}$` |
| 极限 | `\lim_{x \to a}` | `$\lim_{x \to 0} \frac{\sin x}{x}$` |
| 无穷 | `\infty` | `$\lim_{x \to \infty}$` |

### 求和与连乘

| 符号 | LaTeX | 示例 |
|------|-------|------|
| 求和 | `\sum_{i=1}^{n}` | `$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$` |
| 连乘 | `\prod_{i=1}^{n}` | `$\prod_{i=1}^{n} i = n!$` |

### 希腊字母

| 小写 | LaTeX | 大写 | LaTeX |
|------|-------|------|-------|
| α | `\alpha` | A | `A` |
| β | `\beta` | B | `B` |
| γ | `\gamma` | Γ | `\Gamma` |
| δ | `\delta` | Δ | `\Delta` |
| ε | `\epsilon` | E | `E` |
| θ | `\theta` | Θ | `\Theta` |
| λ | `\lambda` | Λ | `\Lambda` |
| μ | `\mu` | M | `M` |
| π | `\pi` | Π | `\Pi` |
| σ | `\sigma` | Σ | `\Sigma` |
| ω | `\omega` | Ω | `\Omega` |

### 关系符号

| 符号 | LaTeX | 含义 |
|------|-------|------|
| ≤ | `\leq` | 小于等于 |
| ≥ | `\geq` | 大于等于 |
| ≠ | `\neq` | 不等于 |
| ≈ | `\approx` | 约等于 |
| ≡ | `\equiv` | 恒等于 |
| ∝ | `\propto` | 正比于 |
| → | `\to` 或 `\rightarrow` | 趋向于 |
| ⇒ | `\Rightarrow` | 推出 |
| ⇔ | `\Leftrightarrow` | 等价于 |

### 集合符号

| 符号 | LaTeX | 含义 |
|------|-------|------|
| ∈ | `\in` | 属于 |
| ∉ | `\notin` | 不属于 |
| ⊂ | `\subset` | 真子集 |
| ⊆ | `\subseteq` | 子集 |
| ∪ | `\cup` | 并集 |
| ∩ | `\cap` | 交集 |
| ∅ | `\emptyset` | 空集 |
| ∀ | `\forall` | 任意 |
| ∃ | `\exists` | 存在 |

### 逻辑符号

| 符号 | LaTeX | 含义 |
|------|-------|------|
| ¬ | `\neg` | 非 |
| ∧ | `\land` | 且 |
| ∨ | `\lor` | 或 |

### 线性代数

| 符号 | LaTeX | 示例 |
|------|-------|------|
| 向量 | `\vec{v}` | `$\vec{v} = (x, y, z)$` |
| 粗体向量 | `\mathbf{v}` | `$\mathbf{v}$` |
| 点乘 | `\cdot` | `$\vec{a} \cdot \vec{b}$` |
| 叉乘 | `\times` | `$\vec{a} \times \vec{b}$` |
| 矩阵 | `\begin{bmatrix}...\end{bmatrix}` | 见下方 |
| 行列式 | `\begin{vmatrix}...\end{vmatrix}` | 见下方 |

**矩阵示例**：
```latex
$$
A = \begin{bmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{bmatrix}
$$
```

**行列式示例**：
```latex
$$
\det(A) = \begin{vmatrix}
a & b \\
c & d
\end{vmatrix} = ad - bc
$$
```

### 函数

| 符号 | LaTeX | 示例 |
|------|-------|------|
| 正弦 | `\sin` | `$\sin(\theta)$` |
| 余弦 | `\cos` | `$\cos(\theta)$` |
| 正切 | `\tan` | `$\tan(\theta)$` |
| 自然对数 | `\ln` | `$\ln(x)$` |
| 对数 | `\log` | `$\log_{10}(x)$` |
| 指数 | `e^{x}` | `$e^{x}$` |
| 绝对值 | `|x|` | `$|x|$` |
| 取整 | `\lfloor x \rfloor` | `$\lfloor 3.7 \rfloor = 3$` |
| 上取整 | `\lceil x \rceil` | `$\lceil 3.2 \rceil = 4$` |

### 特殊字体

| 样式 | LaTeX | 示例 |
|------|-------|------|
| 粗体 | `\mathbf{ABC}` | `$\mathbf{ABC}$` |
| 斜体 | `\mathit{ABC}` | `$\mathit{ABC}$` |
| 黑板粗体 | `\mathbb{R}` | `$\mathbb{R}$` (实数集) |
| 花体 | `\mathcal{L}` | `$\mathcal{L}$` |
| 哥特体 | `\mathfrak{g}` | `$\mathfrak{g}$` |

### 括号

| 符号 | LaTeX | 示例 |
|------|-------|------|
| 小括号 | `(...)` | `$(a+b)$` |
| 中括号 | `[...]` | `$[0, 1]$` |
| 大括号 | `\{...\}` | `$\{x \mid x > 0\}$` |
| 尖括号 | `\langle...\rangle` | `$\langle x, y \rangle$` |
| 自适应 | `\left(...\right)` | `$\left(\frac{1}{2}\right)$` |

---

## 🎯 实用示例

### 示例 1：二次方程

**题目**：
```json
"question": "二次方程 $ax^2 + bx + c = 0$ 的求根公式是？"
```

**选项**：
```json
"options": [
  "$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$",
  "$x = \\frac{b \\pm \\sqrt{b^2 - 4ac}}{2a}$",
  "$x = \\frac{-b \\pm \\sqrt{b^2 + 4ac}}{2a}$",
  "$x = \\frac{-b}{2a} \\pm \\sqrt{\\frac{b^2 - 4ac}{4a^2}}$"
]
```

### 示例 2：泰勒级数

**解析**：
```json
"explanation": "函数 $f(x)$ 在 $x=a$ 处的泰勒展开式为：\\n\\n$$\\nf(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n\\n$$\\n\\n其中 $f^{(n)}(a)$ 表示 $f$ 在 $a$ 处的 $n$ 阶导数。"
```

### 示例 3：物理公式

**题目**：
```json
"question": "爱因斯坦质能方程是？",
"options": [
  "$E = mc^2$",
  "$E = \\frac{1}{2}mv^2$",
  "$E = mgh$",
  "$E = h\\nu$"
]
```

**解析**：
```json
"explanation": "爱因斯坦质能方程：\\n\\n$$\\nE = mc^2\\n$$\\n\\n其中：\\n- $E$ 是能量（焦耳）\\n- $m$ 是质量（千克）\\n- $c$ 是光速 ($3 \\times 10^8$ m/s)"
```

### 示例 4：概率论

**题目**：
```json
"question": "正态分布的概率密度函数是？"
```

**解析**：
```json
"explanation": "正态分布 $N(\\mu, \\sigma^2)$ 的概率密度函数为：\\n\\n$$\\nf(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}\\n$$\\n\\n其中 $\\mu$ 是均值，$\\sigma$ 是标准差。"
```

---

## 💡 快速技巧

### 1. 多行公式对齐

```latex
$$
\begin{aligned}
f(x) &= x^2 + 2x + 1 \\
     &= (x+1)^2 \\
     &= (x+1)(x+1)
\end{aligned}
$$
```

在 JSON 中：
```json
"explanation": "化简过程：\\n\\n$$\\n\\begin{aligned}\\nf(x) &= x^2 + 2x + 1 \\\\\\n     &= (x+1)^2\\n\\end{aligned}\\n$$"
```

### 2. 分段函数

```latex
$$
f(x) = \begin{cases}
x^2, & x \geq 0 \\
-x^2, & x < 0
\end{cases}
$$
```

### 3. 上下标组合

```latex
$x_1^2 + x_2^2 = r^2$
```

### 4. 文本插入

```latex
$E = mc^2 \text{ (质能方程)}$
```

在 JSON 中使用 `\\text{}`：
```json
"$E = mc^2 \\text{ (质能方程)}$"
```

---

## ⚠️ 常见错误

### ❌ 错误 1：JSON 中忘记转义

```json
❌ "question": "$\frac{1}{2}$"
✅ "question": "$\\frac{1}{2}$"
```

### ❌ 错误 2：块级公式缺少换行

```json
❌ "explanation": "公式：$$F = ma$$说明..."
✅ "explanation": "公式：\\n\\n$$\\nF = ma\\n$$\\n\\n说明..."
```

### ❌ 错误 3：使用禁用格式

```json
❌ "question": "\\(f(x) = x^2\\)"
✅ "question": "$f(x) = x^2$"
```

### ❌ 错误 4：大括号未转义

```json
❌ "$\{x | x > 0\}$"
✅ "$\\{x \\mid x > 0\\}$"
```

---

## 🔗 参考资源

- **详细文档**：`题库模板说明.md`
- **完整指南**：`快速开始.md`
- **技术规范**：`../../LaTeX 公式规范.md`
- **在线测试**：[KaTeX 官网](https://katex.org/)

---

**提示**：打印本页作为快速参考！📋


