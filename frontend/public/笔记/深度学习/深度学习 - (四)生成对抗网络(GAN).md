# 深度学习 - (四)生成对抗网络(GAN)

理解生成模型原理。

---

## 4. 生成对抗网络（GAN）

### 4.1 基础GAN

```python
class Generator:
    def __init__(self, noise_dim, output_dim):
        self.W1 = np.random.randn(noise_dim, 128) * 0.01
        self.b1 = np.zeros((1, 128))
        self.W2 = np.random.randn(128, 256) * 0.01
        self.b2 = np.zeros((1, 256))
        self.W3 = np.random.randn(256, output_dim) * 0.01
        self.b3 = np.zeros((1, output_dim))
    
    def relu(self, x):
        return np.maximum(0, x)
    
    def tanh(self, x):
        return np.tanh(x)
    
    def forward(self, z):
        """生成器前向传播"""
        x = np.matmul(z, self.W1) + self.b1
        x = self.relu(x)
        
        x = np.matmul(x, self.W2) + self.b2
        x = self.relu(x)
        
        x = np.matmul(x, self.W3) + self.b3
        x = self.tanh(x)  # 输出范围[-1, 1]
        
        return x

class Discriminator:
    def __init__(self, input_dim):
        self.W1 = np.random.randn(input_dim, 256) * 0.01
        self.b1 = np.zeros((1, 256))
        self.W2 = np.random.randn(256, 128) * 0.01
        self.b2 = np.zeros((1, 128))
        self.W3 = np.random.randn(128, 1) * 0.01
        self.b3 = np.zeros((1, 1))
    
    def leaky_relu(self, x, alpha=0.2):
        return np.where(x > 0, x, alpha * x)
    
    def sigmoid(self, x):
        return 1 / (1 + np.exp(-np.clip(x, -250, 250)))
    
    def forward(self, x):
        """判别器前向传播"""
        x = np.matmul(x, self.W1) + self.b1
        x = self.leaky_relu(x)
        
        x = np.matmul(x, self.W2) + self.b2
        x = self.leaky_relu(x)
        
        x = np.matmul(x, self.W3) + self.b3
        x = self.sigmoid(x)  # 输出概率
        
        return x

class GAN:
    def __init__(self, noise_dim, data_dim):
        self.generator = Generator(noise_dim, data_dim)
        self.discriminator = Discriminator(data_dim)
        self.noise_dim = noise_dim
    
    def generate_noise(self, batch_size):
        """生成噪声"""
        return np.random.randn(batch_size, self.noise_dim)
    
    def train_step(self, real_data, learning_rate=0.0002):
        """训练一步"""
        batch_size = real_data.shape[0]
        
        # 训练判别器
        # 真实数据
        real_output = self.discriminator.forward(real_data)
        d_loss_real = -np.mean(np.log(real_output + 1e-8))
        
        # 生成数据
        noise = self.generate_noise(batch_size)
        fake_data = self.generator.forward(noise)
        fake_output = self.discriminator.forward(fake_data)
        d_loss_fake = -np.mean(np.log(1 - fake_output + 1e-8))
        
        d_loss = d_loss_real + d_loss_fake
        
        # 训练生成器
        noise = self.generate_noise(batch_size)
        fake_data = self.generator.forward(noise)
        fake_output = self.discriminator.forward(fake_data)
        g_loss = -np.mean(np.log(fake_output + 1e-8))
        
        return d_loss, g_loss

# 测试
gan = GAN(noise_dim=100, data_dim=784)  # 28x28图像展平
real_data = np.random.randn(32, 784)  # 批次大小32

d_loss, g_loss = gan.train_step(real_data)
print(f"判别器损失: {d_loss:.4f}")
print(f"生成器损失: {g_loss:.4f}")
```

---

**本章完**
