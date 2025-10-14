![(五)CPU控制器](https://via.placeholder.com/800x200?text=CPU+Controller)

# 计算机组成原理 - (五)CPU控制器

理解CPU控制单元的工作机制。

---


### 5.1 指令周期

```
取指(IF) → 译码(ID) → 执行(EX) → 访存(MEM) → 写回(WB)
```

### 5.2 流水线（Pipeline）

**5级流水线：**

```
时钟周期:  1    2    3    4    5    6    7
指令1:    IF   ID   EX  MEM   WB
指令2:         IF   ID   EX  MEM   WB
指令3:              IF   ID   EX  MEM   WB
```

**理想加速比：**$n$级流水线 → $n$倍加速

**流水线冒险：**

1. **结构冒险**：资源冲突
2. **数据冒险**：指令间依赖
   ```assembly
   ADD R1, R2, R3  # R1 = R2 + R3
   SUB R4, R1, R5  # R4 = R1 - R5（依赖R1）
   ```
3. **控制冒险**：分支指令

**解决方法：**
- **数据前推（Forwarding）**
- **流水线暂停（Stall）**
- **分支预测**

```python
class PipelineCPU:
    def __init__(self):
        self.stages = ['IF', 'ID', 'EX', 'MEM', 'WB']
        self.pipeline = [None] * 5
        self.clock = 0
        self.stalls = 0
    
    def tick(self, new_instruction=None):
        """时钟周期"""
        # 从后往前推进
        for i in range(4, 0, -1):
            if self.pipeline[i-1] and not self._has_hazard(i):
                self.pipeline[i] = self.pipeline[i-1]
                self.pipeline[i-1] = None
        
        # 取新指令
        if new_instruction and not self.pipeline[0]:
            self.pipeline[0] = new_instruction
        
        self.clock += 1
        self._print_state()
    
    def _has_hazard(self, stage):
        """简化的冒险检测"""
        # 这里简化处理，实际需要复杂的依赖分析
        return False
    
    def _print_state(self):
        print(f"Clock {self.clock}: ", end="")
        for i, stage in enumerate(self.stages):
            instr = self.pipeline[i] if self.pipeline[i] else "----"
            print(f"{stage}:{instr:8}", end=" ")
        print()

# 模拟
cpu = PipelineCPU()
instructions = ["ADD", "SUB", "MUL", "DIV", "AND"]

for instr in instructions:
    cpu.tick(instr)

# 清空流水线
for _ in range(5):
    cpu.tick()
```

---

## 6. 总线与I/O