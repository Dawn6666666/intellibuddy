![(八)LR语法分析](https://via.placeholder.com/800x200?text=LR+Parsing)

# 编译原理 - (八)LR语法分析

掌握LR分析算法。

---


### 8.1 LR(0)项目集

```python
class LRItem:
    """LR项目"""
    def __init__(self, production, dot_pos):
        self.production = production  # (lhs, rhs)
        self.dot_pos = dot_pos
    
    def __repr__(self):
        lhs, rhs = self.production
        rhs_with_dot = list(rhs)
        rhs_with_dot.insert(self.dot_pos, '·')
        return f"{lhs} → {''.join(rhs_with_dot)}"
    
    def __eq__(self, other):
        return (self.production == other.production and 
                self.dot_pos == other.dot_pos)
    
    def __hash__(self):
        return hash((self.production, self.dot_pos))
    
    def next_symbol(self):
        """点后的符号"""
        _, rhs = self.production
        if self.dot_pos < len(rhs):
            return rhs[self.dot_pos]
        return None
    
    def advance(self):
        """点向前移动"""
        return LRItem(self.production, self.dot_pos + 1)

class LR0Parser:
    """LR(0)分析器"""
    def __init__(self, grammar):
        self.grammar = grammar  # {non_terminal: [productions]}
        self.start_symbol = list(grammar.keys())[0]
        self.items = self.build_items()
    
    def closure(self, items):
        """计算闭包"""
        closure_set = set(items)
        changed = True
        
        while changed:
            changed = False
            new_items = set()
            
            for item in closure_set:
                symbol = item.next_symbol()
                if symbol and symbol in self.grammar:
                    for production in self.grammar[symbol]:
                        new_item = LRItem((symbol, production), 0)
                        if new_item not in closure_set:
                            new_items.add(new_item)
                            changed = True
            
            closure_set.update(new_items)
        
        return closure_set
    
    def goto(self, items, symbol):
        """GOTO函数"""
        next_items = set()
        
        for item in items:
            if item.next_symbol() == symbol:
                next_items.add(item.advance())
        
        return self.closure(next_items)
    
    def build_items(self):
        """构造所有项目集"""
        # 增广文法
        augmented_start = self.start_symbol + "'"
        initial_item = LRItem((augmented_start, (self.start_symbol,)), 0)
        
        initial_set = self.closure({initial_item})
        items = [initial_set]
        unmarked = [initial_set]
        
        while unmarked:
            current = unmarked.pop()
            
            # 收集所有可能的符号
            symbols = set()
            for item in current:
                symbol = item.next_symbol()
                if symbol:
                    symbols.add(symbol)
            
            # 对每个符号计算GOTO
            for symbol in symbols:
                next_set = self.goto(current, symbol)
                if next_set and next_set not in items:
                    items.append(next_set)
                    unmarked.append(next_set)
        
        return items

# 示例文法：E → E+T | T, T → T*F | F, F → (E) | id
grammar = {
    'E': [('E', '+', 'T'), ('T',)],
    'T': [('T', '*', 'F'), ('F',)],
    'F': [('(', 'E', ')'), ('id',)]
}

parser = LR0Parser(grammar)
for i, item_set in enumerate(parser.items):
    print(f"I{i}:")
    for item in item_set:
        print(f"  {item}")
```

---

## 9. 语义分析深入