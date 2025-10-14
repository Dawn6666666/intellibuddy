# C++面向对象编程 - (六)模板编程

学习C++泛型编程的核心—模板。

---

## 6.1 函数模板

```cpp
// 泛型函数
template <typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}

// 使用
int x = max(10, 20);           // T = int
double y = max(3.14, 2.71);    // T = double
std::string s = max(std::string("hello"), std::string("world"));  // T = std::string
```

### 6.2 类模板

```cpp
template <typename T>
class Stack {
private:
    std::vector<T> elements;

public:
    void push(const T& elem) {
        elements.push_back(elem);
    }
    
    void pop() {
        if (!elements.empty()) {
            elements.pop_back();
        }
    }
    
    T top() const {
        return elements.back();
    }
    
    bool empty() const {
        return elements.empty();
    }
};

// 使用
Stack<int> intStack;
intStack.push(10);
intStack.push(20);
std::cout << intStack.top();  // 20

Stack<std::string> strStack;
strStack.push("Hello");
```

### 6.3 STL标准模板库

**容器**：

```cpp
#include <vector>
#include <list>
#include <map>
#include <set>

// vector（动态数组）
std::vector<int> vec{1, 2, 3};
vec.push_back(4);

// map（红黑树）
std::map<std::string, int> ages;
ages["Alice"] = 25;
ages["Bob"] = 30;

// unordered_map（哈希表）
std::unordered_map<std::string, int> hash_ages;
hash_ages["Charlie"] = 35;

// set（集合）
std::set<int> nums{1, 2, 3, 3};  // 自动去重
```

**算法**：

```cpp
#include <algorithm>

std::vector<int> vec{5, 2, 8, 1, 9};

// 排序
std::sort(vec.begin(), vec.end());

// 查找
auto it = std::find(vec.begin(), vec.end(), 8);

// 反转
std::reverse(vec.begin(), vec.end());

// 统计
int count = std::count_if(vec.begin(), vec.end(), [](int x) { return x > 5; });
```

**Java对比**：
```java
// Java泛型（类型擦除）
List<Integer> list = new ArrayList<>();
list.add(10);

Map<String, Integer> map = new HashMap<>();
map.put("Alice", 25);
```

---

**本章完**
