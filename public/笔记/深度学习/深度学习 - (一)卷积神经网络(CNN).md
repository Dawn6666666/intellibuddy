# 深度学习 - (一)卷积神经网络(CNN)

深入学习卷积神经网络。

---

## 1. 卷积神经网络（CNN）

### 1.1 卷积层实现

```python
import numpy as np

class Conv2D:
    def __init__(self, filters, kernel_size, stride=1, padding=0):
        self.filters = filters
        self.kernel_size = kernel_size
        self.stride = stride
        self.padding = padding
        
        # 初始化权重
        self.weights = np.random.randn(filters, kernel_size, kernel_size) * 0.1
        self.bias = np.zeros(filters)
    
    def add_padding(self, X):
        """添加填充"""
        if self.padding == 0:
            return X
        
        return np.pad(X, ((0, 0), (self.padding, self.padding), 
                         (self.padding, self.padding)), mode='constant')
    
    def forward(self, X):
        """前向传播"""
        batch_size, height, width = X.shape
        X_padded = self.add_padding(X)
        
        # 计算输出尺寸
        out_height = (height + 2 * self.padding - self.kernel_size) // self.stride + 1
        out_width = (width + 2 * self.padding - self.kernel_size) // self.stride + 1
        
        output = np.zeros((batch_size, self.filters, out_height, out_width))
        
        for b in range(batch_size):
            for f in range(self.filters):
                for i in range(out_height):
                    for j in range(out_width):
                        # 提取感受野
                        h_start = i * self.stride
                        h_end = h_start + self.kernel_size
                        w_start = j * self.stride
                        w_end = w_start + self.kernel_size
                        
                        receptive_field = X_padded[b, h_start:h_end, w_start:w_end]
                        
                        # 卷积操作
                        output[b, f, i, j] = np.sum(receptive_field * self.weights[f]) + self.bias[f]
        
        return output

class MaxPool2D:
    def __init__(self, pool_size=2, stride=2):
        self.pool_size = pool_size
        self.stride = stride
    
    def forward(self, X):
        """最大池化"""
        batch_size, channels, height, width = X.shape
        
        out_height = height // self.stride
        out_width = width // self.stride
        
        output = np.zeros((batch_size, channels, out_height, out_width))
        
        for b in range(batch_size):
            for c in range(channels):
                for i in range(out_height):
                    for j in range(out_width):
                        h_start = i * self.stride
                        h_end = h_start + self.pool_size
                        w_start = j * self.stride
                        w_end = w_start + self.pool_size
                        
                        pool_region = X[b, c, h_start:h_end, w_start:w_end]
                        output[b, c, i, j] = np.max(pool_region)
        
        return output

# CNN模型
class SimpleCNN:
    def __init__(self):
        self.conv1 = Conv2D(filters=32, kernel_size=3, padding=1)
        self.pool1 = MaxPool2D(pool_size=2)
        self.conv2 = Conv2D(filters=64, kernel_size=3, padding=1)
        self.pool2 = MaxPool2D(pool_size=2)
    
    def relu(self, x):
        return np.maximum(0, x)
    
    def forward(self, X):
        # 第一层卷积+池化
        x = self.conv1.forward(X)
        x = self.relu(x)
        x = self.pool1.forward(x)
        
        # 第二层卷积+池化
        x = self.conv2.forward(x)
        x = self.relu(x)
        x = self.pool2.forward(x)
        
        return x

# 测试
X = np.random.randn(1, 28, 28)  # 单张28x28图像
cnn = SimpleCNN()
output = cnn.forward(X)
print(f"输入形状: {X.shape}")
print(f"输出形状: {output.shape}")
```

### 1.2 经典CNN架构

```python
# LeNet-5架构
class LeNet5:
    def __init__(self, num_classes=10):
        self.layers = [
            Conv2D(6, 5),      # 28x28 -> 24x24
            MaxPool2D(2),      # 24x24 -> 12x12
            Conv2D(16, 5),     # 12x12 -> 8x8
            MaxPool2D(2),      # 8x8 -> 4x4
            # 全连接层
            # Flatten: 16*4*4 = 256
            # FC: 256 -> 120 -> 84 -> 10
        ]
    
    def forward(self, x):
        # 卷积层
        for layer in self.layers:
            x = layer.forward(x)
            if isinstance(layer, Conv2D):
                x = np.maximum(0, x)  # ReLU
        
        # 展平
        x = x.reshape(x.shape[0], -1)
        
        # 全连接层（简化）
        return x

# ResNet残差块
class ResidualBlock:
    def __init__(self, filters):
        self.conv1 = Conv2D(filters, 3, padding=1)
        self.conv2 = Conv2D(filters, 3, padding=1)
    
    def forward(self, x):
        residual = x
        
        out = self.conv1.forward(x)
        out = np.maximum(0, out)  # ReLU
        
        out = self.conv2.forward(out)
        
        # 残差连接
        out += residual
        out = np.maximum(0, out)  # ReLU
        
        return out
```

---

**本章完**
