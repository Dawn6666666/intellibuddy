![(二)UML设计](https://via.placeholder.com/800x200?text=UML+Design)

# 软件工程 - (二)UML设计

学习UML建模语言。

---


### 2.1 用例图

```
Actor(用户) ---> Use Case(登录)
               ---> Use Case(查看订单)
```

### 2.2 类图

```python
class Order:
    """订单类"""
    def __init__(self):
        self.items = []  # 组合关系
        self.customer = None  # 关联关系
    
    def add_item(self, item):
        self.items.append(item)

class Customer:
    """客户类"""
    def __init__(self, name):
        self.name = name
        self.orders = []
    
    def place_order(self, order):
        self.orders.append(order)
        order.customer = self
```

---

## 3. 设计模式