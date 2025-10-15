# 深度学习 - (三)Transformer架构

学习注意力机制。

---

## 3. Transformer架构

### 3.1 注意力机制

```python
class MultiHeadAttention:
    def __init__(self, d_model, num_heads):
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        # 权重矩阵
        self.W_q = np.random.randn(d_model, d_model) * 0.01
        self.W_k = np.random.randn(d_model, d_model) * 0.01
        self.W_v = np.random.randn(d_model, d_model) * 0.01
        self.W_o = np.random.randn(d_model, d_model) * 0.01
    
    def scaled_dot_product_attention(self, Q, K, V, mask=None):
        """缩放点积注意力"""
        # 计算注意力分数
        scores = np.matmul(Q, K.transpose(-1, -2)) / np.sqrt(self.d_k)
        
        # 应用掩码
        if mask is not None:
            scores += mask * -1e9
        
        # Softmax
        attention_weights = self.softmax(scores)
        
        # 加权求和
        output = np.matmul(attention_weights, V)
        
        return output, attention_weights
    
    def softmax(self, x):
        """Softmax函数"""
        exp_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
        return exp_x / np.sum(exp_x, axis=-1, keepdims=True)
    
    def forward(self, query, key, value, mask=None):
        """多头注意力前向传播"""
        batch_size, seq_len, _ = query.shape
        
        # 线性变换
        Q = np.matmul(query, self.W_q)
        K = np.matmul(key, self.W_k)
        V = np.matmul(value, self.W_v)
        
        # 重塑为多头
        Q = Q.reshape(batch_size, seq_len, self.num_heads, self.d_k).transpose(0, 2, 1, 3)
        K = K.reshape(batch_size, seq_len, self.num_heads, self.d_k).transpose(0, 2, 1, 3)
        V = V.reshape(batch_size, seq_len, self.num_heads, self.d_k).transpose(0, 2, 1, 3)
        
        # 计算注意力
        attention_output, attention_weights = self.scaled_dot_product_attention(Q, K, V, mask)
        
        # 拼接多头
        attention_output = attention_output.transpose(0, 2, 1, 3).reshape(batch_size, seq_len, self.d_model)
        
        # 输出投影
        output = np.matmul(attention_output, self.W_o)
        
        return output

class TransformerBlock:
    def __init__(self, d_model, num_heads, d_ff):
        self.attention = MultiHeadAttention(d_model, num_heads)
        
        # 前馈网络
        self.W1 = np.random.randn(d_model, d_ff) * 0.01
        self.b1 = np.zeros((1, d_ff))
        self.W2 = np.random.randn(d_ff, d_model) * 0.01
        self.b2 = np.zeros((1, d_model))
    
    def layer_norm(self, x, eps=1e-6):
        """层归一化"""
        mean = np.mean(x, axis=-1, keepdims=True)
        std = np.std(x, axis=-1, keepdims=True)
        return (x - mean) / (std + eps)
    
    def relu(self, x):
        return np.maximum(0, x)
    
    def feed_forward(self, x):
        """前馈网络"""
        x = np.matmul(x, self.W1) + self.b1
        x = self.relu(x)
        x = np.matmul(x, self.W2) + self.b2
        return x
    
    def forward(self, x, mask=None):
        """Transformer块前向传播"""
        # 多头注意力 + 残差连接
        attention_output = self.attention.forward(x, x, x, mask)
        x = self.layer_norm(x + attention_output)
        
        # 前馈网络 + 残差连接
        ff_output = self.feed_forward(x)
        x = self.layer_norm(x + ff_output)
        
        return x

# 测试
batch_size, seq_len, d_model = 2, 10, 512
x = np.random.randn(batch_size, seq_len, d_model)

transformer = TransformerBlock(d_model=512, num_heads=8, d_ff=2048)
output = transformer.forward(x)
print(f"输入形状: {x.shape}")
print(f"输出形状: {output.shape}")
```

---

**本章完**
