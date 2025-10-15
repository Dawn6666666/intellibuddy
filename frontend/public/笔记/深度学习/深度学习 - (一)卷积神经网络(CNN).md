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

### 1.3 经典CNN架构详解

#### 1.3.1 VGGNet

```python
class VGG16:
    """
    VGG-16架构
    特点：使用小卷积核（3x3），深度网络
    """
    def __init__(self, num_classes=1000):
        self.num_classes = num_classes
        
        # VGG-16配置
        self.config = [
            # 第一组：2个3x3卷积，64通道
            ('conv', 64), ('conv', 64), ('pool',),
            # 第二组：2个3x3卷积，128通道
            ('conv', 128), ('conv', 128), ('pool',),
            # 第三组：3个3x3卷积，256通道
            ('conv', 256), ('conv', 256), ('conv', 256), ('pool',),
            # 第四组：3个3x3卷积，512通道
            ('conv', 512), ('conv', 512), ('conv', 512), ('pool',),
            # 第五组：3个3x3卷积，512通道
            ('conv', 512), ('conv', 512), ('conv', 512), ('pool',),
        ]
        
        print("VGG-16网络结构：")
        print("输入: 224x224x3")
        self._print_architecture()
    
    def _print_architecture(self):
        """打印网络结构"""
        h, w, c = 224, 224, 3
        
        for layer in self.config:
            if layer[0] == 'conv':
                c = layer[1]
                print(f"Conv3x3-{c:3d} | {h:3d}x{w:3d}x{c:3d}")
            elif layer[0] == 'pool':
                h, w = h // 2, w // 2
                print(f"MaxPool2x2 | {h:3d}x{w:3d}x{c:3d}")
        
        print(f"Flatten    | {h * w * c}")
        print(f"FC-4096    | 4096")
        print(f"FC-4096    | 4096")
        print(f"FC-{self.num_classes}      | {self.num_classes}")

# 测试
vgg = VGG16(num_classes=1000)
```

#### 1.3.2 ResNet深度残差网络

```python
class ResNetBottleneck:
    """
    ResNet瓶颈块
    1x1 -> 3x3 -> 1x1
    降低计算量
    """
    def __init__(self, in_channels, out_channels, stride=1):
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.stride = stride
        
        # 瓶颈设计
        mid_channels = out_channels // 4
        
        self.conv1 = Conv2D(mid_channels, 1)  # 1x1降维
        self.conv2 = Conv2D(mid_channels, 3, stride=stride, padding=1)  # 3x3
        self.conv3 = Conv2D(out_channels, 1)  # 1x1升维
        
        # 短路连接（如果维度不匹配）
        self.shortcut = None
        if stride != 1 or in_channels != out_channels:
            self.shortcut = Conv2D(out_channels, 1, stride=stride)
    
    def forward(self, x):
        """前向传播"""
        residual = x
        
        # 主路径
        out = self.conv1.forward(x)
        out = np.maximum(0, out)  # ReLU
        
        out = self.conv2.forward(out)
        out = np.maximum(0, out)
        
        out = self.conv3.forward(out)
        
        # 短路连接
        if self.shortcut:
            residual = self.shortcut.forward(x)
        
        out += residual
        out = np.maximum(0, out)
        
        return out

class ResNet50:
    """ResNet-50架构"""
    def __init__(self, num_classes=1000):
        # ResNet-50配置：[3, 4, 6, 3]个残差块
        self.config = {
            'conv1': (64, 7, 2),  # 7x7, stride=2
            'pool1': (3, 2),       # 3x3, stride=2
            'layer1': (256, 3),    # 3个瓶颈块
            'layer2': (512, 4),    # 4个瓶颈块
            'layer3': (1024, 6),   # 6个瓶颈块
            'layer4': (2048, 3),   # 3个瓶颈块
        }
        
        print("\nResNet-50参数量:")
        self._count_parameters()
    
    def _count_parameters(self):
        """统计参数量"""
        params = 0
        
        # Conv1: 7x7x3x64
        params += 7 * 7 * 3 * 64
        
        # 各层瓶颈块
        configs = [(256, 3), (512, 4), (1024, 6), (2048, 3)]
        for out_ch, num_blocks in configs:
            mid_ch = out_ch // 4
            # 每个瓶颈块：1x1 + 3x3 + 1x1
            block_params = (out_ch * mid_ch) + (3 * 3 * mid_ch * mid_ch) + (mid_ch * out_ch)
            params += block_params * num_blocks
        
        # 全连接层
        params += 2048 * 1000
        
        print(f"总参数量: {params:,} ({params / 1e6:.2f}M)")

resnet = ResNet50()
```

#### 1.3.3 Inception模块

```python
class InceptionModule:
    """
    Inception模块（GoogLeNet）
    多尺度特征提取
    """
    def __init__(self, in_channels, n1x1, n3x3_reduce, n3x3, n5x5_reduce, n5x5, pool_proj):
        # 1x1卷积分支
        self.branch1 = Conv2D(n1x1, 1)
        
        # 1x1 -> 3x3卷积分支
        self.branch2_1 = Conv2D(n3x3_reduce, 1)
        self.branch2_2 = Conv2D(n3x3, 3, padding=1)
        
        # 1x1 -> 5x5卷积分支
        self.branch3_1 = Conv2D(n5x5_reduce, 1)
        self.branch3_2 = Conv2D(n5x5, 5, padding=2)
        
        # 3x3池化 -> 1x1卷积分支
        self.branch4_pool = MaxPool2D(3, stride=1)  # 需要padding保持尺寸
        self.branch4_conv = Conv2D(pool_proj, 1)
    
    def forward(self, x):
        """前向传播"""
        # 分支1: 1x1卷积
        branch1 = self.branch1.forward(x)
        branch1 = np.maximum(0, branch1)
        
        # 分支2: 1x1 -> 3x3
        branch2 = self.branch2_1.forward(x)
        branch2 = np.maximum(0, branch2)
        branch2 = self.branch2_2.forward(branch2)
        branch2 = np.maximum(0, branch2)
        
        # 分支3: 1x1 -> 5x5
        branch3 = self.branch3_1.forward(x)
        branch3 = np.maximum(0, branch3)
        branch3 = self.branch3_2.forward(branch3)
        branch3 = np.maximum(0, branch3)
        
        # 分支4: pool -> 1x1
        branch4 = self.branch4_pool.forward(x)
        branch4 = self.branch4_conv.forward(branch4)
        branch4 = np.maximum(0, branch4)
        
        # 在通道维度拼接
        output = np.concatenate([branch1, branch2, branch3, branch4], axis=1)
        
        return output

# 测试Inception模块
print("\nInception模块示例:")
print("输入: 28x28x192")
print("输出通道数: 64 + 128 + 32 + 32 = 256")
```

### 1.4 卷积变种

#### 1.4.1 深度可分离卷积

```python
class DepthwiseSeparableConv:
    """
    深度可分离卷积（MobileNet）
    = 深度卷积 + 逐点卷积
    大幅减少参数量和计算量
    """
    def __init__(self, in_channels, out_channels, kernel_size=3, stride=1, padding=1):
        # 深度卷积：每个输入通道单独卷积
        self.depthwise = []
        for _ in range(in_channels):
            self.depthwise.append(Conv2D(1, kernel_size, stride, padding))
        
        # 逐点卷积：1x1卷积组合通道
        self.pointwise = Conv2D(out_channels, 1)
        
        # 参数量对比
        standard_params = in_channels * out_channels * kernel_size * kernel_size
        dw_params = in_channels * kernel_size * kernel_size + in_channels * out_channels
        
        print(f"\n参数量对比:")
        print(f"标准卷积: {standard_params:,}")
        print(f"深度可分离: {dw_params:,}")
        print(f"压缩比: {standard_params / dw_params:.2f}x")
    
    def forward(self, x):
        """前向传播"""
        # 深度卷积
        depth_outputs = []
        for i, conv in enumerate(self.depthwise):
            channel = x[:, i:i+1, :, :]
            depth_outputs.append(conv.forward(channel))
        
        depth_out = np.concatenate(depth_outputs, axis=1)
        depth_out = np.maximum(0, depth_out)
        
        # 逐点卷积
        out = self.pointwise.forward(depth_out)
        out = np.maximum(0, out)
        
        return out

# 测试
dw_conv = DepthwiseSeparableConv(in_channels=64, out_channels=128, kernel_size=3)
```

#### 1.4.2 空洞卷积（Dilated Convolution）

```python
class DilatedConv2D:
    """
    空洞卷积/膨胀卷积
    扩大感受野，不增加参数
    """
    def __init__(self, filters, kernel_size, dilation_rate=1, padding=0):
        self.filters = filters
        self.kernel_size = kernel_size
        self.dilation_rate = dilation_rate
        self.padding = padding
        
        self.weights = np.random.randn(filters, kernel_size, kernel_size) * 0.1
        self.bias = np.zeros(filters)
        
        # 有效感受野
        effective_kernel = kernel_size + (kernel_size - 1) * (dilation_rate - 1)
        print(f"\n空洞卷积参数:")
        print(f"卷积核大小: {kernel_size}x{kernel_size}")
        print(f"膨胀率: {dilation_rate}")
        print(f"有效感受野: {effective_kernel}x{effective_kernel}")
    
    def forward(self, X):
        """前向传播"""
        batch_size, height, width = X.shape
        X_padded = np.pad(X, ((0, 0), (self.padding, self.padding), 
                             (self.padding, self.padding)), mode='constant')
        
        # 计算输出尺寸
        effective_kernel = self.kernel_size + (self.kernel_size - 1) * (self.dilation_rate - 1)
        out_height = (height + 2 * self.padding - effective_kernel) + 1
        out_width = (width + 2 * self.padding - effective_kernel) + 1
        
        output = np.zeros((batch_size, self.filters, out_height, out_width))
        
        for b in range(batch_size):
            for f in range(self.filters):
                for i in range(out_height):
                    for j in range(out_width):
                        # 提取空洞感受野
                        receptive_field = np.zeros((self.kernel_size, self.kernel_size))
                        
                        for ki in range(self.kernel_size):
                            for kj in range(self.kernel_size):
                                h_idx = i + ki * self.dilation_rate
                                w_idx = j + kj * self.dilation_rate
                                receptive_field[ki, kj] = X_padded[b, h_idx, w_idx]
                        
                        output[b, f, i, j] = np.sum(receptive_field * self.weights[f]) + self.bias[f]
        
        return output

# 测试
dilated_conv = DilatedConv2D(filters=32, kernel_size=3, dilation_rate=2, padding=2)
```

#### 1.4.3 转置卷积（反卷积）

```python
class TransposeConv2D:
    """
    转置卷积/反卷积
    用于上采样（语义分割、GAN等）
    """
    def __init__(self, in_channels, out_channels, kernel_size=4, stride=2, padding=1):
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.kernel_size = kernel_size
        self.stride = stride
        self.padding = padding
        
        self.weights = np.random.randn(in_channels, out_channels, 
                                       kernel_size, kernel_size) * 0.01
        self.bias = np.zeros(out_channels)
        
        print(f"\n转置卷积参数:")
        print(f"输入通道: {in_channels}")
        print(f"输出通道: {out_channels}")
        print(f"卷积核: {kernel_size}x{kernel_size}")
        print(f"步长: {stride}")
    
    def forward(self, X):
        """
        前向传播
        输出大小 = (输入大小 - 1) * stride + kernel_size - 2 * padding
        """
        batch_size, in_ch, in_h, in_w = X.shape
        
        # 计算输出尺寸
        out_h = (in_h - 1) * self.stride + self.kernel_size - 2 * self.padding
        out_w = (in_w - 1) * self.stride + self.kernel_size - 2 * self.padding
        
        output = np.zeros((batch_size, self.out_channels, out_h, out_w))
        
        print(f"输入形状: {X.shape}")
        print(f"输出形状: {output.shape}")
        
        return output

# 测试：上采样2倍
transpose_conv = TransposeConv2D(in_channels=64, out_channels=32, 
                                  kernel_size=4, stride=2, padding=1)
X_test = np.random.randn(1, 64, 16, 16)
output = transpose_conv.forward(X_test)
```

### 1.5 CNN可视化技术

#### 1.5.1 特征图可视化

```python
class FeatureMapVisualizer:
    """卷积特征图可视化"""
    
    @staticmethod
    def visualize_filters(conv_layer, num_filters=16):
        """
        可视化卷积核
        """
        filters = conv_layer.weights[:num_filters]
        
        print("\n卷积核可视化:")
        print(f"显示前 {num_filters} 个卷积核")
        
        for i, f in enumerate(filters):
            # 归一化到 [0, 1]
            f_norm = (f - f.min()) / (f.max() - f.min() + 1e-8)
            print(f"Filter {i}: min={f.min():.3f}, max={f.max():.3f}, mean={f.mean():.3f}")
    
    @staticmethod
    def visualize_activations(feature_maps, layer_name="conv"):
        """
        可视化激活图
        """
        print(f"\n{layer_name} 激活图统计:")
        print(f"形状: {feature_maps.shape}")
        
        for i in range(min(8, feature_maps.shape[1])):
            fm = feature_maps[0, i, :, :]
            print(f"通道 {i}: min={fm.min():.3f}, max={fm.max():.3f}, "
                  f"mean={fm.mean():.3f}, std={fm.std():.3f}")

# 测试
conv = Conv2D(filters=16, kernel_size=3)
visualizer = FeatureMapVisualizer()
visualizer.visualize_filters(conv)
```

#### 1.5.2 类激活映射（CAM）

```python
class GradCAM:
    """
    Gradient-weighted Class Activation Mapping
    可视化CNN关注的区域
    """
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
    
    def save_gradient(self, grad):
        """保存梯度"""
        self.gradients = grad
    
    def forward_hook(self, module, input, output):
        """保存激活"""
        self.activations = output
    
    def generate_cam(self, input_image, target_class):
        """
        生成类激活映射
        
        步骤：
        1. 前向传播获取目标层特征图
        2. 反向传播获取梯度
        3. 全局平均池化梯度得到权重
        4. 加权求和特征图
        """
        # 前向传播
        output = self.model.forward(input_image)
        
        # 反向传播（简化示例）
        # 实际需要对目标类别计算梯度
        
        # 全局平均池化梯度
        if self.gradients is not None:
            weights = np.mean(self.gradients, axis=(2, 3))  # [batch, channels]
            
            # 加权求和
            cam = np.zeros(self.activations.shape[2:], dtype=np.float32)
            for i, w in enumerate(weights[0]):
                cam += w * self.activations[0, i, :, :]
            
            # ReLU
            cam = np.maximum(cam, 0)
            
            # 归一化
            cam = cam / (cam.max() + 1e-8)
            
            return cam
        
        return None
    
    def visualize(self, cam, original_image):
        """
        叠加CAM到原图
        """
        print("\nGrad-CAM可视化:")
        print(f"CAM形状: {cam.shape}")
        print(f"CAM范围: [{cam.min():.3f}, {cam.max():.3f}]")
        print(f"关注度最高区域坐标: {np.unravel_index(cam.argmax(), cam.shape)}")

# 示例
print("\nGrad-CAM使用示例:")
print("1. 前向传播获取特征图")
print("2. 计算目标类别的梯度")
print("3. 生成热力图")
print("4. 叠加到原图显示关注区域")
```

### 1.6 CNN实用技巧

```python
class CNNBestPractices:
    """CNN最佳实践"""
    
    @staticmethod
    def calculate_output_size(input_size, kernel_size, stride, padding):
        """
        计算卷积输出尺寸
        output = (input - kernel + 2*padding) / stride + 1
        """
        output = (input_size - kernel_size + 2 * padding) // stride + 1
        return output
    
    @staticmethod
    def calculate_receptive_field(layers_config):
        """
        计算感受野
        """
        rf = 1
        jump = 1
        
        print("\n感受野计算:")
        print(f"{'层':<15} {'卷积核':<10} {'步长':<10} {'感受野':<10} {'跳跃':<10}")
        print("-" * 60)
        
        for layer_name, kernel, stride in layers_config:
            rf = rf + (kernel - 1) * jump
            jump = jump * stride
            print(f"{layer_name:<15} {kernel:<10} {stride:<10} {rf:<10} {jump:<10}")
        
        return rf
    
    @staticmethod
    def memory_estimation(batch_size, height, width, channels, num_layers):
        """
        显存估算
        """
        # 特征图显存
        feature_memory = batch_size * height * width * channels * num_layers * 4  # 4 bytes per float32
        
        # 梯度显存（反向传播）
        gradient_memory = feature_memory
        
        # 总显存
        total_memory = feature_memory + gradient_memory
        
        print(f"\n显存估算:")
        print(f"批大小: {batch_size}")
        print(f"输入尺寸: {height}x{width}x{channels}")
        print(f"网络层数: {num_layers}")
        print(f"特征图显存: {feature_memory / 1e9:.2f} GB")
        print(f"梯度显存: {gradient_memory / 1e9:.2f} GB")
        print(f"总显存需求: {total_memory / 1e9:.2f} GB")
        
        return total_memory

# 测试最佳实践
bp = CNNBestPractices()

# 计算输出尺寸
out_size = bp.calculate_output_size(input_size=224, kernel_size=7, stride=2, padding=3)
print(f"\n卷积输出尺寸: {out_size}x{out_size}")

# 计算感受野（VGG示例）
vgg_config = [
    ("Conv1-1", 3, 1),
    ("Conv1-2", 3, 1),
    ("Pool1", 2, 2),
    ("Conv2-1", 3, 1),
    ("Conv2-2", 3, 1),
    ("Pool2", 2, 2),
]
rf = bp.calculate_receptive_field(vgg_config)

# 显存估算
bp.memory_estimation(batch_size=32, height=224, width=224, channels=64, num_layers=50)
```

### 1.7 CNN总结

```python
def cnn_summary():
    """CNN知识点总结"""
    
    print("=" * 80)
    print("卷积神经网络（CNN）知识体系")
    print("=" * 80)
    
    # 经典架构对比
    architectures = [
        ("LeNet-5", 1998, "5层", "0.06M", "手写数字识别"),
        ("AlexNet", 2012, "8层", "60M", "ImageNet突破"),
        ("VGG-16", 2014, "16层", "138M", "小卷积核堆叠"),
        ("GoogLeNet", 2014, "22层", "7M", "Inception模块"),
        ("ResNet-50", 2015, "50层", "25M", "残差连接"),
        ("MobileNet", 2017, "28层", "4.2M", "移动端轻量级"),
        ("EfficientNet", 2019, "可变", "可变", "复合缩放"),
    ]
    
    print(f"\n{'架构':<15} {'年份':<8} {'深度':<10} {'参数量':<12} {'特点':<20}")
    print("-" * 80)
    
    for name, year, depth, params, feature in architectures:
        print(f"{name:<15} {year:<8} {depth:<10} {params:<12} {feature:<20}")
    
    # 关键技术
    print("\n" + "=" * 80)
    print("关键技术总结")
    print("=" * 80)
    
    techniques = [
        ("卷积层", "特征提取", "参数共享、局部连接"),
        ("池化层", "降维", "减少参数、增强鲁棒性"),
        ("残差连接", "解决退化", "缓解梯度消失"),
        ("Inception", "多尺度", "并行提取不同尺度特征"),
        ("深度可分离", "参数压缩", "减少8-9倍参数"),
        ("空洞卷积", "扩大感受野", "不增加参数"),
        ("批归一化", "加速训练", "稳定梯度、允许更大学习率"),
    ]
    
    print(f"\n{'技术':<15} {'作用':<15} {'优势':<30}")
    print("-" * 80)
    
    for tech, purpose, advantage in techniques:
        print(f"{tech:<15} {purpose:<15} {advantage:<30}")

cnn_summary()
```

---

**本章完**
