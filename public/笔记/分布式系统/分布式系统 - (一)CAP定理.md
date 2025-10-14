![(一)CAP定理](https://via.placeholder.com/800x200?text=CAP+Theorem)

# 分布式系统 - (一)CAP定理

理解分布式系统基础理论。

---

# 分布式系统

> 💡 **课程信息**
> - 学习时长：160小时
> - 难度等级：⭐⭐⭐⭐⭐ (极高)
> - **大规模系统设计核心**

---

## 📚 分布式系统挑战

```
网络分区 + 节点故障 + 并发控制 + 数据一致性 + 性能扩展
```

---

## 1. CAP定理

### 1.1 理论基础

**CAP三要素：**
- **Consistency（一致性）** - 所有节点同时看到相同数据
- **Availability（可用性）** - 系统持续可用
- **Partition Tolerance（分区容错）** - 网络分区时系统继续工作

**只能同时满足两个！**

```python
class CAPExample:
    """CAP定理示例"""
    
    def __init__(self, mode='CP'):  # CP, AP, CA
        self.mode = mode
        self.nodes = {'A': {'data': 0}, 'B': {'data': 0}}
        self.partition = False
    
    def write(self, node, value):
        """写操作"""
        if self.mode == 'CP':  # 强一致性
            if self.partition:
                return False, "网络分区，拒绝写入保证一致性"
            
            # 同步写入所有节点
            for n in self.nodes:
                self.nodes[n]['data'] = value
            return True, f"写入成功: {value}"
        
        elif self.mode == 'AP':  # 高可用
            # 只写入当前节点
            self.nodes[node]['data'] = value
            return True, f"写入节点{node}: {value}"
    
    def read(self, node):
        """读操作"""
        return self.nodes[node]['data']
    
    def simulate_partition(self):
        """模拟网络分区"""
        self.partition = True
        print("⚠️  网络分区发生")

# 测试
cap = CAPExample(mode='CP')
print(cap.write('A', 100))
cap.simulate_partition()
print(cap.write('A', 200))  # CP模式下会失败

cap_ap = CAPExample(mode='AP')
cap_ap.simulate_partition()
print(cap_ap.write('A', 300))  # AP模式下会成功
```

---

## 2. 一致性模型