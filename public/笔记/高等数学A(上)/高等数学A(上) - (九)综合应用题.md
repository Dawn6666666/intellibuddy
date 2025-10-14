![(九)综合应用题](https://via.placeholder.com/800x200?text=Comprehensive+Problems)

# 高等数学A(上) - (九)综合应用题

综合运用微积分知识解决复杂问题。

---


### 10.1 最值问题

**例30**：要做一个底为正方形、容积为 $V$ 的长方体无盖水箱，问底边长为多少时用料最省？

**解**：设底边长为 $x$，高为 $h$，则 $V = x^2 h$，即 $h = \frac{V}{x^2}$

表面积：
$$
S = x^2 + 4xh = x^2 + \frac{4V}{x}
$$

求 $S$ 的最小值：
$$
S' = 2x - \frac{4V}{x^2} = 0 \Rightarrow x^3 = 2V \Rightarrow x = \sqrt[3]{2V}
$$

$$
S'' = 2 + \frac{8V}{x^3} > 0
$$

所以当 $x = \sqrt[3]{2V}$ 时用料最省。

### 10.2 变化率问题

**例31**：一盏路灯距地面8米。一个身高1.6米的人以每秒1.5米的速度离开路灯。问人影的顶端移动速度是多少？

**解**：设人距路灯 $x$ 米，影长 $y$ 米。

由相似三角形：
$$
\frac{8}{x+y} = \frac{1.6}{y} \Rightarrow 8y = 1.6(x+y) \Rightarrow y = \frac{x}{4}
$$

人影顶端距路灯距离：$s = x + y = \frac{5x}{4}$

$$
\frac{ds}{dt} = \frac{5}{4} \cdot \frac{dx}{dt} = \frac{5}{4} \times 1.5 = 1.875 \text{ 米/秒}
$$

### 10.3 微分方程初步

#### 可分离变量

**例32**：求解 $\frac{dy}{dx} = \frac{y}{x}$

**解**：
$$
\frac{dy}{y} = \frac{dx}{x} \Rightarrow \int \frac{dy}{y} = \int \frac{dx}{x}
$$

$$
\ln|y| = \ln|x| + C_1 \Rightarrow y = Cx
$$

#### 一阶线性微分方程

标准形式：$\frac{dy}{dx} + P(x)y = Q(x)$

通解公式：
$$
y = e^{-\int P(x)dx} \left[\int Q(x)e^{\int P(x)dx} dx + C\right]
$$

**例33**：求解 $\frac{dy}{dx} + y = e^x$

**解**：这里 $P(x) = 1$，$Q(x) = e^x$

$$
\int P(x)dx = \int dx = x
$$

$$
y = e^{-x}\left[\int e^x \cdot e^x dx + C\right] = e^{-x}\left[\frac{e^{2x}}{2} + C\right] = \frac{e^x}{2} + Ce^{-x}
$$

---

## 11. 常见错误与易错点