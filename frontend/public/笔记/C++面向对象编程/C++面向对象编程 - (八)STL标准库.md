# C++面向对象编程 - (八)STL标准库

学习C++标准模板库的使用。

---

## 8. STL标准库

### 8.1 STL容器深入

### vector - 动态数组

```cpp
#include <vector>
#include <algorithm>
#include <iostream>

void vector_demo() {
    // 创建和初始化
    std::vector<int> vec1;                    // 空vector
    std::vector<int> vec2(5);                 // 5个元素，默认值0
    std::vector<int> vec3(5, 10);             // 5个元素，值为10
    std::vector<int> vec4{1, 2, 3, 4, 5};     // 列表初始化
    
    // 添加元素
    vec1.push_back(10);
    vec1.emplace_back(20);  // 更高效，直接构造
    
    // 访问元素
    std::cout << vec4[0] << std::endl;        // 不检查边界
    std::cout << vec4.at(0) << std::endl;     // 检查边界，更安全
    std::cout << vec4.front() << std::endl;   // 第一个元素
    std::cout << vec4.back() << std::endl;    // 最后一个元素
    
    // 遍历
    for (int val : vec4) {
        std::cout << val << " ";
    }
    std::cout << "\n";
    
    // 使用迭代器
    for (auto it = vec4.begin(); it != vec4.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << "\n";
    
    // 容量管理
    std::cout << "size: " << vec4.size() << std::endl;
    std::cout << "capacity: " << vec4.capacity() << std::endl;
    vec4.reserve(100);  // 预分配空间，避免重新分配
    
    // 删除元素
    vec4.pop_back();                          // 删除最后一个
    vec4.erase(vec4.begin());                 // 删除第一个
    vec4.erase(vec4.begin(), vec4.begin()+2); // 删除前两个
    vec4.clear();                             // 清空
    
    // 算法操作
    std::vector<int> nums{5, 2, 8, 1, 9, 3};
    
    std::sort(nums.begin(), nums.end());      // 排序
    std::reverse(nums.begin(), nums.end());   // 反转
    
    auto it = std::find(nums.begin(), nums.end(), 8);
    if (it != nums.end()) {
        std::cout << "Found: " << *it << std::endl;
    }
    
    // 二维vector
    std::vector<std::vector<int>> matrix(3, std::vector<int>(4, 0));
    matrix[0][0] = 1;
}
```

### map与unordered_map

```cpp
#include <map>
#include <unordered_map>
#include <string>

void map_demo() {
    // map - 有序，基于红黑树
    std::map<std::string, int> scores;
    
    // 插入
    scores["Alice"] = 95;
    scores["Bob"] = 88;
    scores.insert({"Charlie", 92});
    scores.emplace("Diana", 90);
    
    // 访问
    std::cout << scores["Alice"] << std::endl;  // 如果不存在会创建
    std::cout << scores.at("Bob") << std::endl; // 如果不存在抛异常
    
    // 检查是否存在
    if (scores.count("Alice") > 0) {
        std::cout << "Alice exists" << std::endl;
    }
    
    if (scores.find("Eve") != scores.end()) {
        std::cout << "Eve exists" << std::endl;
    }
    
    // 遍历（按key排序）
    for (const auto& [name, score] : scores) {  // C++17结构化绑定
        std::cout << name << ": " << score << std::endl;
    }
    
    // 删除
    scores.erase("Bob");
    
    // unordered_map - 无序，基于哈希表，查找O(1)
    std::unordered_map<std::string, int> fast_map;
    fast_map["key1"] = 100;
    fast_map["key2"] = 200;
    
    // 性能对比
    // map: 插入/查找/删除 O(log n)，有序
    // unordered_map: 插入/查找/删除 O(1)平均，无序
}
```

### set与unordered_set

```cpp
#include <set>
#include <unordered_set>

void set_demo() {
    // set - 有序，元素唯一
    std::set<int> s;
    
    s.insert(5);
    s.insert(2);
    s.insert(8);
    s.insert(2);  // 重复，不会插入
    
    // 遍历（自动排序）
    for (int val : s) {
        std::cout << val << " ";  // 2 5 8
    }
    std::cout << "\n";
    
    // 查找
    if (s.find(5) != s.end()) {
        std::cout << "5 exists" << std::endl;
    }
    
    // 范围查询
    auto lower = s.lower_bound(3);  // 第一个>=3的元素
    auto upper = s.upper_bound(7);  // 第一个>7的元素
    
    // unordered_set - 无序，哈希表实现
    std::unordered_set<std::string> words;
    words.insert("hello");
    words.insert("world");
    
    // 实际应用：去重
    std::vector<int> nums{1, 2, 2, 3, 3, 4, 5, 5};
    std::set<int> unique_nums(nums.begin(), nums.end());
    std::cout << "Unique count: " << unique_nums.size() << std::endl;
}
```

## 8.2 STL算法

```cpp
#include <algorithm>
#include <vector>
#include <numeric>
#include <functional>

void algorithm_demo() {
    std::vector<int> nums{5, 2, 8, 1, 9, 3, 7, 4, 6};
    
    // 排序算法
    std::sort(nums.begin(), nums.end());  // 升序
    std::sort(nums.begin(), nums.end(), std::greater<int>());  // 降序
    
    // 自定义排序
    std::vector<std::pair<std::string, int>> students{
        {"Alice", 85}, {"Bob", 90}, {"Charlie", 78}
    };
    std::sort(students.begin(), students.end(),
        [](const auto& a, const auto& b) {
            return a.second > b.second;  // 按分数降序
        });
    
    // 查找算法
    auto it = std::find(nums.begin(), nums.end(), 5);
    if (it != nums.end()) {
        std::cout << "Found at index: " << (it - nums.begin()) << std::endl;
    }
    
    // 二分查找（需要有序）
    std::sort(nums.begin(), nums.end());
    bool found = std::binary_search(nums.begin(), nums.end(), 5);
    
    // 条件查找
    auto it2 = std::find_if(nums.begin(), nums.end(),
        [](int x) { return x > 5; });
    
    // 计数
    int count = std::count(nums.begin(), nums.end(), 5);
    int count_if = std::count_if(nums.begin(), nums.end(),
        [](int x) { return x % 2 == 0; });  // 偶数个数
    
    // 最大最小值
    auto max_it = std::max_element(nums.begin(), nums.end());
    auto min_it = std::min_element(nums.begin(), nums.end());
    std::cout << "Max: " << *max_it << ", Min: " << *min_it << std::endl;
    
    // 转换
    std::vector<int> doubled;
    std::transform(nums.begin(), nums.end(), std::back_inserter(doubled),
        [](int x) { return x * 2; });
    
    // 累积
    int sum = std::accumulate(nums.begin(), nums.end(), 0);
    int product = std::accumulate(nums.begin(), nums.end(), 1, std::multiplies<int>());
    
    // 去重（需要先排序）
    std::sort(nums.begin(), nums.end());
    auto unique_end = std::unique(nums.begin(), nums.end());
    nums.erase(unique_end, nums.end());
    
    // 分区
    std::partition(nums.begin(), nums.end(),
        [](int x) { return x % 2 == 0; });  // 偶数在前
    
    // 全部/任意/无满足条件
    bool all_positive = std::all_of(nums.begin(), nums.end(),
        [](int x) { return x > 0; });
    bool any_even = std::any_of(nums.begin(), nums.end(),
        [](int x) { return x % 2 == 0; });
    bool none_negative = std::none_of(nums.begin(), nums.end(),
        [](int x) { return x < 0; });
}
```

## 8.3 迭代器详解

```cpp
#include <vector>
#include <list>
#include <iterator>

void iterator_demo() {
    std::vector<int> vec{1, 2, 3, 4, 5};
    
    // 迭代器类型
    std::vector<int>::iterator it = vec.begin();
    std::vector<int>::const_iterator cit = vec.cbegin();
    std::vector<int>::reverse_iterator rit = vec.rbegin();
    
    // 迭代器操作
    ++it;       // 前进
    --it;       // 后退
    it += 2;    // 随机访问（只有随机访问迭代器支持）
    int val = *it;  // 解引用
    
    // 迭代器范围
    auto begin = vec.begin();
    auto end = vec.end();  // 指向最后一个元素的下一个位置
    
    // 反向迭代器
    for (auto it = vec.rbegin(); it != vec.rend(); ++it) {
        std::cout << *it << " ";  // 5 4 3 2 1
    }
    std::cout << "\n";
    
    // 插入迭代器
    std::vector<int> dest;
    std::back_insert_iterator<std::vector<int>> back_it(dest);
    *back_it = 10;  // dest.push_back(10)
    *back_it = 20;
    
    // 使用back_inserter
    std::copy(vec.begin(), vec.end(), std::back_inserter(dest));
    
    // 流迭代器
    std::vector<int> data{1, 2, 3, 4, 5};
    std::ostream_iterator<int> out_it(std::cout, " ");
    std::copy(data.begin(), data.end(), out_it);  // 输出到cout
    std::cout << "\n";
}
```

---

**本章完**
