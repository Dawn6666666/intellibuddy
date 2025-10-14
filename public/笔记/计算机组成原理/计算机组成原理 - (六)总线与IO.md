![(六)总线与IO](https://via.placeholder.com/800x200?text=Bus+and+IO)

# 计算机组成原理 - (六)总线与IO

学习总线和输入输出系统。

---


### 6.1 总线分类

- **数据总线**：传输数据（双向）
- **地址总线**：指定地址（单向）
- **控制总线**：控制信号（双向）

**总线带宽：**

$$
\text{带宽} = \text{总线宽度} \times \text{总线频率}
$$

示例：64位总线，800MHz → $64 \times 800 = 51.2 \text{Gb/s} = 6.4 \text{GB/s}$

### 6.2 I/O控制方式

| 方式 | 特点 | 应用 |
|------|------|------|
| 程序查询 | CPU不断轮询 | 简单设备 |
| 中断 | 设备主动通知CPU | 键盘、鼠标 |
| DMA | 直接访问内存 | 硬盘、网卡 |

**中断处理流程：**

```python
class InterruptController:
    def __init__(self):
        self.interrupt_vector = {}  # 中断向量表
        self.enabled = True
    
    def register_handler(self, irq, handler):
        """注册中断处理程序"""
        self.interrupt_vector[irq] = handler
    
    def trigger(self, irq):
        """触发中断"""
        if not self.enabled:
            return
        
        if irq in self.interrupt_vector:
            print(f"Interrupt {irq} triggered!")
            # 保存上下文
            self._save_context()
            # 调用处理程序
            self.interrupt_vector[irq]()
            # 恢复上下文
            self._restore_context()
    
    def _save_context(self):
        print("Saving CPU context...")
    
    def _restore_context(self):
        print("Restoring CPU context...")

# 示例
ic = InterruptController()

def keyboard_handler():
    print("Handling keyboard input...")

def timer_handler():
    print("Timer tick!")

ic.register_handler(1, keyboard_handler)
ic.register_handler(0, timer_handler)

ic.trigger(1)  # 键盘中断
ic.trigger(0)  # 定时器中断
```

---

## 8. 汇编语言编程实例