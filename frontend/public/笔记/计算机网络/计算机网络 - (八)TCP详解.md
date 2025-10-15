# 计算机网络 - (八)TCP详解

深入理解TCP机制。

---


### 8.1 滑动窗口协议

```python
class SlidingWindow:
    """
    TCP滑动窗口
    """
    def __init__(self, window_size=4):
        self.window_size = window_size
        self.send_base = 0  # 最早未确认的序号
        self.next_seq = 0   # 下一个待发送的序号
        self.acked = set()  # 已确认的序号
    
    def can_send(self):
        """是否可以发送"""
        return self.next_seq < self.send_base + self.window_size
    
    def send_packet(self, data):
        """发送数据包"""
        if not self.can_send():
            print("窗口已满，等待ACK...")
            return False
        
        seq = self.next_seq
        print(f"发送数据包 seq={seq}: {data}")
        self.next_seq += 1
        return True
    
    def receive_ack(self, ack_num):
        """收到ACK"""
        print(f"收到ACK: {ack_num}")
        self.acked.add(ack_num)
        
        # 移动窗口
        while self.send_base in self.acked:
            self.send_base += 1
        
        print(f"窗口: [{self.send_base}, {self.send_base + self.window_size})")

# 示例
sw = SlidingWindow(window_size=3)
sw.send_packet("packet0")
sw.send_packet("packet1")
sw.send_packet("packet2")
sw.receive_ack(0)
sw.send_packet("packet3")
sw.receive_ack(1)
```

### 8.2 TCP超时重传

```python
import time

class TCPRetransmission:
    """
    TCP超时重传
    """
    def __init__(self, rto=1.0):
        self.rto = rto  # 重传超时时间
        self.packets = {}  # seq → (data, send_time)
    
    def send(self, seq, data):
        """发送数据包"""
        self.packets[seq] = (data, time.time())
        print(f"发送 seq={seq}: {data}")
    
    def check_timeout(self):
        """检查超时"""
        current_time = time.time()
        for seq, (data, send_time) in list(self.packets.items()):
            if current_time - send_time > self.rto:
                print(f"超时重传 seq={seq}")
                self.send(seq, data)
    
    def receive_ack(self, ack):
        """收到ACK"""
        if ack in self.packets:
            del self.packets[ack]
            print(f"ACK {ack} 收到，移除缓冲")
```

### 8.3 快速重传

```python
class FastRetransmit:
    """
    快速重传（收到3个重复ACK立即重传）
    """
    def __init__(self):
        self.ack_count = {}
        self.retransmitted = set()
    
    def receive_ack(self, ack):
        """收到ACK"""
        if ack not in self.ack_count:
            self.ack_count[ack] = 0
        
        self.ack_count[ack] += 1
        
        # 收到3个重复ACK
        if self.ack_count[ack] == 3 and ack not in self.retransmitted:
            print(f"收到3个重复ACK {ack}，快速重传 seq={ack+1}")
            self.retransmitted.add(ack)
```

---

**本章完**
