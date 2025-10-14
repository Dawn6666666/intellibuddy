# 微积分II - (四)微分方程

掌握常微分方程的求解方法。

---

## 4. 微分方程

### 4.1 一阶微分方程

**可分离变量**：

$$
\frac{dy}{dx} = g(x) h(y) \Rightarrow \frac{dy}{h(y)} = g(x) dx
$$

**示例**：

$$
\frac{dy}{dx} = xy \Rightarrow \frac{dy}{y} = x dx \Rightarrow \ln|y| = \frac{x^2}{2} + C
$$

$$
y = Ae^{x^2/2}
$$

**一阶线性微分方程**：

$$
\frac{dy}{dx} + P(x)y = Q(x)
$$

**通解公式**：

$$
y = e^{-\int P(x) dx} \left( \int Q(x) e^{\int P(x) dx} dx + C \right)
$$

### 4.2 二阶常系数线性微分方程

**齐次方程**：

$$
y'' + py' + qy = 0
$$

**特征方程**：

$$
r^2 + pr + q = 0
$$

**通解**：

| 判别式 | 根 | 通解 |
|--------|-----|------|
| $\Delta > 0$ | $r_1, r_2$ 实根 | $y = C_1 e^{r_1 x} + C_2 e^{r_2 x}$ |
| $\Delta = 0$ | $r$ 重根 | $y = (C_1 + C_2 x) e^{rx}$ |
| $\Delta < 0$ | $r = \alpha \pm \beta i$ | $y = e^{\alpha x}(C_1 \cos \beta x + C_2 \sin \beta x)$ |

**示例**：

$$
y'' - 3y' + 2y = 0
$$

特征方程：$r^2 - 3r + 2 = 0 \Rightarrow r_1 = 1, r_2 = 2$

通解：$y = C_1 e^x + C_2 e^{2x}$

### 4.3 数值解法

#### 欧拉法

```python
def euler_method(f, y0, t0, t_end, h):
    """
    欧拉法求解 dy/dt = f(t, y)
    y0: 初值
    t0, t_end: 时间范围
    h: 步长
    """
    t = np.arange(t0, t_end + h, h)
    y = np.zeros(len(t))
    y[0] = y0
    
    for i in range(len(t) - 1):
        y[i+1] = y[i] + h * f(t[i], y[i])
    
    return t, y

# 示例：dy/dt = -y, y(0) = 1（解析解：y = e^(-t)）
def f(t, y):
    return -y

t, y = euler_method(f, y0=1.0, t0=0, t_end=5, h=0.1)
y_exact = np.exp(-t)

plt.plot(t, y, 'o-', label='欧拉法')
plt.plot(t, y_exact, label='精确解')
plt.legend()
plt.title('微分方程数值解')
plt.show()
```

#### 龙格-库塔法（RK4）

```python
def rk4(f, y0, t0, t_end, h):
    """四阶龙格-库塔法"""
    t = np.arange(t0, t_end + h, h)
    y = np.zeros(len(t))
    y[0] = y0
    
    for i in range(len(t) - 1):
        k1 = f(t[i], y[i])
        k2 = f(t[i] + h/2, y[i] + h*k1/2)
        k3 = f(t[i] + h/2, y[i] + h*k2/2)
        k4 = f(t[i] + h, y[i] + h*k3)
        
        y[i+1] = y[i] + h * (k1 + 2*k2 + 2*k3 + k4) / 6
    
    return t, y

t, y = rk4(f, y0=1.0, t0=0, t_end=5, h=0.1)
y_exact = np.exp(-t)

print(f"RK4误差: {np.max(np.abs(y - y_exact)):.10f}")
```

### 4.4 应用：算法递推式求解

**递推关系转微分方程**：

$$
T(n) = 2T(n/2) + n
$$

连续化：$T(n) \to T(x)$, $T(n/2) \to T(x/2)$

$$
T(x) = 2T(x/2) + x
$$

求导：

$$
T'(x) = T'(x/2) + 1
$$

解得：$T'(x) = \log_2 x + C$

$$
T(x) = x \log_2 x + Cx + D
$$

∴ $T(n) = \Theta(n \log n)$

---

## 📚 实践应用

### 神经网络反向传播

**链式法则（多元）**：

$$
\frac{\partial L}{\partial w} = \frac{\partial L}{\partial y} \cdot \frac{\partial y}{\partial z} \cdot \frac{\partial z}{\partial w}
$$

```python
class SimpleNeuralNet:
    def __init__(self):
        self.w1 = np.random.randn(2, 3)
        self.w2 = np.random.randn(3, 1)
    
    def sigmoid(self, x):
        return 1 / (1 + np.exp(-x))
    
    def sigmoid_derivative(self, x):
        return x * (1 - x)
    
    def forward(self, X):
        self.z1 = X @ self.w1
        self.a1 = self.sigmoid(self.z1)
        self.z2 = self.a1 @ self.w2
        self.a2 = self.sigmoid(self.z2)
        return self.a2
    
    def backward(self, X, y, learning_rate=0.1):
        """反向传播（偏导数链式法则）"""
        m = X.shape[0]
        
        # 输出层梯度
        dz2 = self.a2 - y
        dw2 = (self.a1.T @ dz2) / m
        
        # 隐藏层梯度
        dz1 = (dz2 @ self.w2.T) * self.sigmoid_derivative(self.a1)
        dw1 = (X.T @ dz1) / m
        
        # 更新权重
        self.w1 -= learning_rate * dw1
        self.w2 -= learning_rate * dw2

# 训练
X = np.array([[0,0], [0,1], [1,0], [1,1]])
y = np.array([[0], [1], [1], [0]])  # XOR

nn = SimpleNeuralNet()
for _ in range(10000):
    output = nn.forward(X)
    nn.backward(X, y)

print(nn.forward(X))
```

---

## 📚 学习建议

### 重点难点

1. **梯度与方向导数** - 理解几何意义
2. **重积分计算** - 掌握坐标变换
3. **级数收敛性** - 熟练判别法
4. **傅里叶级数** - 信号分解思想

### 编程实践

- 实现梯度下降优化器
- 蒙特卡洛积分应用
- 傅里叶变换信号处理
- 微分方程数值求解器

### 推荐资源

📖 **教材：**
- 《高等数学》（同济版）
- 《微积分学教程》（菲赫金哥尔茨）

💻 **工具：**
- SymPy（符号计算）
- SciPy（数值计算）
- Matplotlib（可视化）

---

**本章完**
