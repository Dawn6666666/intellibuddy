# 编译原理 - (七)正则表达式与DFA

深入理解有限自动机。

---

## 7. 正则表达式与DFA

### 7.1 正则表达式转NFA

```python
class NFAState:
    """NFA状态"""
    def __init__(self, is_final=False):
        self.transitions = {}  # symbol → [states]
        self.epsilon_transitions = []  # ε转换
        self.is_final = is_final

class NFA:
    """非确定性有限自动机"""
    def __init__(self, start, end):
        self.start = start
        self.end = end
    
    @staticmethod
    def from_char(char):
        """从单个字符构造NFA"""
        start = NFAState()
        end = NFAState(is_final=True)
        start.transitions[char] = [end]
        return NFA(start, end)
    
    @staticmethod
    def concat(nfa1, nfa2):
        """连接操作"""
        nfa1.end.is_final = False
        nfa1.end.epsilon_transitions.append(nfa2.start)
        return NFA(nfa1.start, nfa2.end)
    
    @staticmethod
    def union(nfa1, nfa2):
        """并操作"""
        start = NFAState()
        end = NFAState(is_final=True)
        
        start.epsilon_transitions = [nfa1.start, nfa2.start]
        nfa1.end.epsilon_transitions.append(end)
        nfa2.end.epsilon_transitions.append(end)
        nfa1.end.is_final = False
        nfa2.end.is_final = False
        
        return NFA(start, end)
    
    @staticmethod
    def closure(nfa):
        """闭包操作（*）"""
        start = NFAState()
        end = NFAState(is_final=True)
        
        start.epsilon_transitions = [nfa.start, end]
        nfa.end.epsilon_transitions = [nfa.start, end]
        nfa.end.is_final = False
        
        return NFA(start, end)
```

### 7.2 NFA转DFA（子集构造法）

```python
class DFAState:
    """DFA状态"""
    def __init__(self, nfa_states, is_final=False):
        self.nfa_states = frozenset(nfa_states)  # NFA状态集合
        self.transitions = {}
        self.is_final = is_final

class DFA:
    """确定性有限自动机"""
    def __init__(self, start_state):
        self.start = start_state
        self.states = {start_state}
    
    @staticmethod
    def epsilon_closure(states):
        """计算ε闭包"""
        closure = set(states)
        stack = list(states)
        
        while stack:
            state = stack.pop()
            for next_state in state.epsilon_transitions:
                if next_state not in closure:
                    closure.add(next_state)
                    stack.append(next_state)
        
        return closure
    
    @staticmethod
    def from_nfa(nfa):
        """NFA转DFA"""
        start_closure = DFA.epsilon_closure([nfa.start])
        start_dfa_state = DFAState(start_closure, nfa.end in start_closure)
        
        dfa = DFA(start_dfa_state)
        unmarked = [start_dfa_state]
        state_map = {start_dfa_state.nfa_states: start_dfa_state}
        
        while unmarked:
            current = unmarked.pop()
            
            # 收集所有可能的输入符号
            symbols = set()
            for nfa_state in current.nfa_states:
                symbols.update(nfa_state.transitions.keys())
            
            # 对每个符号构造转换
            for symbol in symbols:
                next_states = set()
                for nfa_state in current.nfa_states:
                    if symbol in nfa_state.transitions:
                        next_states.update(nfa_state.transitions[symbol])
                
                next_closure = DFA.epsilon_closure(next_states)
                
                if next_closure not in state_map:
                    new_state = DFAState(next_closure, nfa.end in next_closure)
                    state_map[next_closure] = new_state
                    dfa.states.add(new_state)
                    unmarked.append(new_state)
                
                current.transitions[symbol] = state_map[next_closure]
        
        return dfa
```

---

**本章完**
