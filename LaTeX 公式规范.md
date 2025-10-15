### LaTeX 公式规范（重要！）⭐

**前端使用 KaTeX + marked-katex-extension 渲染，必须遵循以下格式：**

#### 基本语法

1. **行内公式**：使用单个 `$` 包裹
   ```markdown
   函数 $f(x) = x^2$ 的导数是 $f'(x) = 2x$
   ```

2. **块级公式**：使用双 `$$` 包裹，前后必须空行
   ```markdown
   牛顿第二定律：
   
   $$
   F = ma
   $$
   
   其中 $F$ 是力...
   ```

3. **多行公式对齐**：
   ```markdown
   $$
   \begin{aligned}
   \frac{dy}{dx} &= 2x \\
   \int y \, dx &= x^2 + C
   \end{aligned}
   $$
   ```

4. **矩阵**：
   ```markdown
   $$
   A = \begin{bmatrix}
   a_{11} & a_{12} \\
   a_{21} & a_{22}
   \end{bmatrix}
   $$
   ```

5. **表格中的公式**（已优化显示）：
   ```markdown
   | 函数 | 导数 | 积分 |
   |------|------|------|
   | $x^n$ | $nx^{n-1}$ | $\frac{x^{n+1}}{n+1} + C$ |
   | $e^x$ | $e^x$ | $e^x + C$ |
   | $\ln x$ | $\frac{1}{x}$ | $x \ln x - x + C$ |
   ```

#### 配置要点（技术实现）

**核心配置（LearningView.vue）：**
```javascript
// 1. KaTeX 扩展必须在 marked.setOptions() 之前注册
marked.use(markedKatex({
  throwOnError: false,  // 公式错误时不抛异常，显示错误信息
  output: 'html',
  nonStandard: true,    // 启用 \color 等扩展命令
  strict: false,        // 不使用严格模式，允许更多语法
  trust: true          // 信任输入，支持 \href、\includegraphics 等命令
}));

// 2. 然后才设置 marked 选项
marked.setOptions({
  renderer,
  gfm: true,
  pedantic: false,
  breaks: false,
});
```

**关键点说明：**
- ⭐ **加载顺序很重要**：KaTeX 扩展必须先于 marked.setOptions() 注册
- ⭐ **nonStandard: true**：支持更多非标准 LaTeX 命令（如希腊字母）
- ⭐ **strict: false**：宽松模式，提高兼容性
- ⭐ **trust: true**：允许更多高级功能

**表格样式优化：**
```css
/* 表格边框和结构 */
.markdown-body :deep(table) {
  border-collapse: collapse;
  border: 1px solid var(--card-border);
}

/* 表格中的公式优化 */
.markdown-body :deep(td .katex),
.markdown-body :deep(th .katex) {
  font-size: 1em;
  vertical-align: middle;
}
```

#### ⚠️ 禁止使用的格式

- ❌ `\( 公式 \)` （LaTeX 原生行内公式）
- ❌ `\[ 公式 \]` （LaTeX 原生块级公式）
- ❌ 公式内换行（块级公式除外）
- ❌ 公式前后不加空格（可能导致解析失败）

#### 常用符号速查

**基础运算：**
- 分数：`\frac{a}{b}` → $\frac{a}{b}$
- 根号：`\sqrt{x}`, `\sqrt[n]{x}` → $\sqrt{x}$, $\sqrt[n]{x}$
- 上下标：`x^2`, `x_i`, `x_i^2` → $x^2$, $x_i$, $x_i^2$

**微积分：**
- 求和：`\sum_{i=1}^{n}` → $\sum_{i=1}^{n}$
- 积分：`\int_{a}^{b} f(x) \, dx` → $\int_{a}^{b} f(x) \, dx$
- 极限：`\lim_{x \to \infty}` → $\lim_{x \to \infty}$
- 偏导：`\frac{\partial f}{\partial x}` → $\frac{\partial f}{\partial x}$
- 导数：`\frac{d}{dx}`, `f'(x)`, `\dot{x}` → $\frac{d}{dx}$, $f'(x)$, $\dot{x}$

**希腊字母（已测试可用）：**
- 小写：`\alpha, \beta, \gamma, \delta, \epsilon, \theta, \lambda, \mu, \pi, \sigma, \omega`
  → $\alpha, \beta, \gamma, \delta, \epsilon, \theta, \lambda, \mu, \pi, \sigma, \omega$
- 大写：`\Gamma, \Delta, \Theta, \Lambda, \Sigma, \Omega`
  → $\Gamma, \Delta, \Theta, \Lambda, \Sigma, \Omega$

**线性代数：**
- 向量：`\vec{v}`, `\mathbf{v}` → $\vec{v}$, $\mathbf{v}$
- 矩阵：`\begin{bmatrix}...\end{bmatrix}`, `\begin{pmatrix}...\end{pmatrix}`
- 行列式：`\begin{vmatrix}...\end{vmatrix}` → $\begin{vmatrix}a & b \\ c & d\end{vmatrix}$
- 点乘：`\cdot` → $\cdot$
- 叉乘：`\times` → $\times$

**集合与逻辑：**
- 属于：`\in, \notin` → $\in, \notin$
- 包含：`\subset, \subseteq, \supset, \supseteq` → $\subset, \subseteq, \supset, \supseteq$
- 交并：`\cap, \cup` → $\cap, \cup$
- 逻辑：`\forall, \exists, \neg, \land, \lor` → $\forall, \exists, \neg, \land, \lor$

**特殊符号：**
- 无穷：`\infty` → $\infty$
- 约等于：`\approx` → $\approx$
- 不等于：`\neq` → $\neq$
- 小于等于：`\leq, \geq` → $\leq, \geq$
- 箭头：`\to, \leftarrow, \rightarrow, \Rightarrow` → $\to, \leftarrow, \rightarrow, \Rightarrow$

#### 常见问题与解决方案

1. **公式不渲染**：
   - 检查是否使用了 `$...$` 或 `$$...$$` 格式
   - 块级公式前后是否有空行
   - 公式中特殊字符是否正确转义

2. **希腊字母显示问题**：
   - ✅ 已解决：确保 `nonStandard: true` 和 `strict: false`
   - 常用希腊字母都可正常渲染

3. **表格中公式显示异常**：
   - ✅ 已优化：表格自动添加边框和样式
   - 公式自动垂直居中对齐

4. **公式与文本间距**：
   - 行内公式：前后建议加空格 `这是 $公式$ 示例`
   - 块级公式：前后必须空行

### 代码风格要求

1. **语言选择**：根据课程特点选择Python/Java/C++/C
2. **注释规范**：关键步骤必须注释
3. **变量命名**：使用有意义的名称
4. **代码格式**：遵循语言标准
5. **运行结果**：提供输出示例