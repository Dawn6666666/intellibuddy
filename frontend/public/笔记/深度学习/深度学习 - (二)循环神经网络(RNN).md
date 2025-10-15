# 深度学习 - (二)循环神经网络(RNN)

掌握序列建模技术。

---

## 2. 循环神经网络（RNN）

### 2.1 基础RNN

```python
class SimpleRNN:
    def __init__(self, input_size, hidden_size, output_size):
        self.hidden_size = hidden_size
        
        # 权重初始化
        self.Wxh = np.random.randn(input_size, hidden_size) * 0.01
        self.Whh = np.random.randn(hidden_size, hidden_size) * 0.01
        self.Why = np.random.randn(hidden_size, output_size) * 0.01
        
        self.bh = np.zeros((1, hidden_size))
        self.by = np.zeros((1, output_size))
    
    def tanh(self, x):
        return np.tanh(x)
    
    def softmax(self, x):
        exp_x = np.exp(x - np.max(x, axis=1, keepdims=True))
        return exp_x / np.sum(exp_x, axis=1, keepdims=True)
    
    def forward(self, inputs):
        """前向传播"""
        h = np.zeros((1, self.hidden_size))
        outputs = []
        
        for x in inputs:
            x = x.reshape(1, -1)
            h = self.tanh(np.dot(x, self.Wxh) + np.dot(h, self.Whh) + self.bh)
            y = np.dot(h, self.Why) + self.by
            outputs.append(y)
        
        return outputs, h

# LSTM单元
class LSTMCell:
    def __init__(self, input_size, hidden_size):
        self.input_size = input_size
        self.hidden_size = hidden_size
        
        # 遗忘门
        self.Wf = np.random.randn(input_size + hidden_size, hidden_size) * 0.01
        self.bf = np.zeros((1, hidden_size))
        
        # 输入门
        self.Wi = np.random.randn(input_size + hidden_size, hidden_size) * 0.01
        self.bi = np.zeros((1, hidden_size))
        
        # 候选值
        self.Wc = np.random.randn(input_size + hidden_size, hidden_size) * 0.01
        self.bc = np.zeros((1, hidden_size))
        
        # 输出门
        self.Wo = np.random.randn(input_size + hidden_size, hidden_size) * 0.01
        self.bo = np.zeros((1, hidden_size))
    
    def sigmoid(self, x):
        return 1 / (1 + np.exp(-np.clip(x, -250, 250)))
    
    def tanh(self, x):
        return np.tanh(x)
    
    def forward(self, x, h_prev, c_prev):
        """LSTM前向传播"""
        # 拼接输入
        combined = np.hstack([x, h_prev])
        
        # 遗忘门
        f = self.sigmoid(np.dot(combined, self.Wf) + self.bf)
        
        # 输入门
        i = self.sigmoid(np.dot(combined, self.Wi) + self.bi)
        
        # 候选值
        c_tilde = self.tanh(np.dot(combined, self.Wc) + self.bc)
        
        # 更新细胞状态
        c = f * c_prev + i * c_tilde
        
        # 输出门
        o = self.sigmoid(np.dot(combined, self.Wo) + self.bo)
        
        # 隐藏状态
        h = o * self.tanh(c)
        
        return h, c

class LSTM:
    def __init__(self, input_size, hidden_size, output_size):
        self.cell = LSTMCell(input_size, hidden_size)
        self.hidden_size = hidden_size
        
        # 输出层
        self.Wy = np.random.randn(hidden_size, output_size) * 0.01
        self.by = np.zeros((1, output_size))
    
    def forward(self, inputs):
        """LSTM前向传播"""
        h = np.zeros((1, self.hidden_size))
        c = np.zeros((1, self.hidden_size))
        outputs = []
        
        for x in inputs:
            x = x.reshape(1, -1)
            h, c = self.cell.forward(x, h, c)
            y = np.dot(h, self.Wy) + self.by
            outputs.append(y)
        
        return outputs

# 测试
inputs = [np.random.randn(10) for _ in range(5)]  # 序列长度5，特征维度10
lstm = LSTM(input_size=10, hidden_size=20, output_size=5)
outputs = lstm.forward(inputs)
print(f"输出序列长度: {len(outputs)}")
print(f"每个输出形状: {outputs[0].shape}")
```

---

**本章完**
