# 操作系统 - (八)IO系统

学习IO管理与设备驱动。

---

## 8. I/O系统

### 8.1 设备驱动框架

```python
class DeviceDriver:
    """
    通用设备驱动框架
    """
    def __init__(self, device_name):
        self.device_name = device_name
        self.is_open = False
        self.buffer = []
    
    def open(self):
        """打开设备"""
        if self.is_open:
            return False, "设备已打开"
        
        print(f"打开设备: {self.device_name}")
        self.is_open = True
        return True, "设备打开成功"
    
    def read(self, size):
        """读设备"""
        if not self.is_open:
            return None, "设备未打开"
        
        data = self.buffer[:size]
        self.buffer = self.buffer[size:]
        print(f"读取{len(data)}字节")
        return data, "读取成功"
    
    def write(self, data):
        """写设备"""
        if not self.is_open:
            return False, "设备未打开"
        
        self.buffer.extend(data)
        print(f"写入{len(data)}字节")
        return True, "写入成功"
    
    def ioctl(self, cmd, arg):
        """设备控制"""
        print(f"执行ioctl: cmd={cmd}, arg={arg}")
        # 根据cmd执行不同操作
        return True
    
    def close(self):
        """关闭设备"""
        if not self.is_open:
            return False, "设备未打开"
        
        print(f"关闭设备: {self.device_name}")
        self.is_open = False
        return True, "设备关闭成功"

# 示例
driver = DeviceDriver("/dev/mydevice")
driver.open()
driver.write(b"Hello Device")
data, _ = driver.read(5)
print(f"读到数据: {data}")
driver.close()
```

### 8.2 DMA传输

```python
class DMAController:
    """
    DMA控制器模拟
    """
    def __init__(self):
        self.channels = {}
    
    def setup_transfer(self, channel, src_addr, dst_addr, size):
        """设置DMA传输"""
        self.channels[channel] = {
            'src': src_addr,
            'dst': dst_addr,
            'size': size,
            'transferred': 0,
            'status': 'ready'
        }
        print(f"DMA通道{channel}: {src_addr} → {dst_addr}, {size}字节")
    
    def start_transfer(self, channel):
        """启动传输"""
        if channel not in self.channels:
            return False
        
        transfer = self.channels[channel]
        transfer['status'] = 'transferring'
        print(f"DMA通道{channel}开始传输...")
        
        # 模拟传输过程
        while transfer['transferred'] < transfer['size']:
            chunk_size = min(1024, transfer['size'] - transfer['transferred'])
            transfer['transferred'] += chunk_size
            
            print(f"  已传输: {transfer['transferred']}/{transfer['size']} "
                  f"({transfer['transferred']/transfer['size']*100:.1f}%)")
        
        transfer['status'] = 'completed'
        print(f"DMA通道{channel}传输完成")
        
        # 触发中断
        self.interrupt_handler(channel)
        
        return True
    
    def interrupt_handler(self, channel):
        """DMA中断处理"""
        print(f"🔔 DMA中断: 通道{channel}传输完成")

# 示例
dma = DMAController()
dma.setup_transfer(channel=0, src_addr=0x1000, dst_addr=0x2000, size=4096)
dma.start_transfer(channel=0)
```

---

**本章完**
