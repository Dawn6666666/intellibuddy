# 数据结构与算法 - (八)LeetCode经典题解

精选LeetCode经典题目详解。

---

## 8. LeetCode经典题解

### 8.1 数组与字符串

#### 两数之和（LeetCode 1）

```cpp
// 暴力解法 - O(n²)
vector<int> twoSum_brute(vector<int>& nums, int target) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
    }
    return {};
}

// 哈希表优化 - O(n)
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}
```

#### 三数之和（LeetCode 15）

```cpp
vector<vector<int>> threeSum(vector<int>& nums) {
    vector<vector<int>> result;
    int n = nums.size();
    
    // 排序
    sort(nums.begin(), nums.end());
    
    for (int i = 0; i < n - 2; i++) {
        // 跳过重复元素
        if (i > 0 && nums[i] == nums[i-1]) continue;
        
        // 双指针
        int left = i + 1, right = n - 1;
        int target = -nums[i];
        
        while (left < right) {
            int sum = nums[left] + nums[right];
            if (sum == target) {
                result.push_back({nums[i], nums[left], nums[right]});
                
                // 跳过重复
                while (left < right && nums[left] == nums[left+1]) left++;
                while (left < right && nums[right] == nums[right-1]) right--;
                
                left++;
                right--;
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}
```

#### 最长回文子串（LeetCode 5）

```cpp
// 中心扩展法 - O(n²)
string longestPalindrome(string s) {
    if (s.empty()) return "";
    
    int start = 0, maxLen = 0;
    
    auto expandAroundCenter = [&](int left, int right) {
        while (left >= 0 && right < s.length() && s[left] == s[right]) {
            left--;
            right++;
        }
        int len = right - left - 1;
        if (len > maxLen) {
            maxLen = len;
            start = left + 1;
        }
    };
    
    for (int i = 0; i < s.length(); i++) {
        expandAroundCenter(i, i);      // 奇数长度
        expandAroundCenter(i, i + 1);  // 偶数长度
    }
    
    return s.substr(start, maxLen);
}

// Manacher算法 - O(n)
string longestPalindrome_manacher(string s) {
    // 预处理：添加#避免奇偶讨论
    string t = "#";
    for (char c : s) {
        t += c;
        t += '#';
    }
    
    int n = t.length();
    vector<int> p(n, 0);  // p[i]表示以i为中心的最长回文半径
    int center = 0, right = 0;
    
    for (int i = 0; i < n; i++) {
        // 利用对称性
        int mirror = 2 * center - i;
        if (i < right) {
            p[i] = min(right - i, p[mirror]);
        }
        
        // 中心扩展
        while (i + p[i] + 1 < n && i - p[i] - 1 >= 0 &&
               t[i + p[i] + 1] == t[i - p[i] - 1]) {
            p[i]++;
        }
        
        // 更新center和right
        if (i + p[i] > right) {
            center = i;
            right = i + p[i];
        }
    }
    
    // 找最长回文
    int maxLen = 0, centerIndex = 0;
    for (int i = 0; i < n; i++) {
        if (p[i] > maxLen) {
            maxLen = p[i];
            centerIndex = i;
        }
    }
    
    int start = (centerIndex - maxLen) / 2;
    return s.substr(start, maxLen);
}
```

### 10.2 链表问题

#### 反转链表（LeetCode 206）

```cpp
// 迭代法
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    
    while (curr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    
    return prev;
}

// 递归法
ListNode* reverseList_recursive(ListNode* head) {
    if (!head || !head->next) return head;
    
    ListNode* newHead = reverseList_recursive(head->next);
    head->next->next = head;
    head->next = nullptr;
    
    return newHead;
}
```

#### 环形链表II（LeetCode 142）

```cpp
ListNode* detectCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    
    // 快慢指针找相遇点
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        
        if (slow == fast) {
            // 找环的起点
            ListNode* ptr = head;
            while (ptr != slow) {
                ptr = ptr->next;
                slow = slow->next;
            }
            return ptr;
        }
    }
    
    return nullptr;
}
```

#### 合并K个升序链表（LeetCode 23）

```cpp
// 优先队列（最小堆）
ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) {
        return a->val > b->val;
    };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
    
    // 将所有链表的头节点加入堆
    for (ListNode* head : lists) {
        if (head) pq.push(head);
    }
    
    ListNode dummy(0);
    ListNode* tail = &dummy;
    
    while (!pq.empty()) {
        ListNode* node = pq.top();
        pq.pop();
        
        tail->next = node;
        tail = tail->next;
        
        if (node->next) {
            pq.push(node->next);
        }
    }
    
    return dummy.next;
}

// 分治法
ListNode* mergeKLists_divide(vector<ListNode*>& lists) {
    if (lists.empty()) return nullptr;
    return merge(lists, 0, lists.size() - 1);
}

ListNode* merge(vector<ListNode*>& lists, int left, int right) {
    if (left == right) return lists[left];
    
    int mid = left + (right - left) / 2;
    ListNode* l1 = merge(lists, left, mid);
    ListNode* l2 = merge(lists, mid + 1, right);
    
    return mergeTwoLists(l1, l2);
}

ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    
    while (l1 && l2) {
        if (l1->val < l2->val) {
            tail->next = l1;
            l1 = l1->next;
        } else {
            tail->next = l2;
            l2 = l2->next;
        }
        tail = tail->next;
    }
    
    tail->next = l1 ? l1 : l2;
    return dummy.next;
}
```

### 10.3 二叉树问题

#### 二叉树的最大深度（LeetCode 104）

```cpp
// 递归
int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}

// 迭代（层序遍历）
int maxDepth_iterative(TreeNode* root) {
    if (!root) return 0;
    
    queue<TreeNode*> q;
    q.push(root);
    int depth = 0;
    
    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front();
            q.pop();
            
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        depth++;
    }
    
    return depth;
}
```

#### 二叉树的最近公共祖先（LeetCode 236）

```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    
    if (left && right) return root;  // p和q分别在左右子树
    return left ? left : right;      // p和q都在一侧
}
```

#### 二叉树的序列化与反序列化（LeetCode 297）

```cpp
class Codec {
public:
    // 序列化
    string serialize(TreeNode* root) {
        if (!root) return "#";
        return to_string(root->val) + "," + 
               serialize(root->left) + "," + 
               serialize(root->right);
    }
    
    // 反序列化
    TreeNode* deserialize(string data) {
        queue<string> nodes;
        stringstream ss(data);
        string item;
        
        while (getline(ss, item, ',')) {
            nodes.push(item);
        }
        
        return buildTree(nodes);
    }
    
private:
    TreeNode* buildTree(queue<string>& nodes) {
        string val = nodes.front();
        nodes.pop();
        
        if (val == "#") return nullptr;
        
        TreeNode* root = new TreeNode(stoi(val));
        root->left = buildTree(nodes);
        root->right = buildTree(nodes);
        
        return root;
    }
};
```

### 10.4 动态规划经典题

#### 爬楼梯（LeetCode 70）

```cpp
// 递归（会超时）
int climbStairs_recursive(int n) {
    if (n <= 2) return n;
    return climbStairs_recursive(n-1) + climbStairs_recursive(n-2);
}

// 记忆化搜索
int climbStairs_memo(int n) {
    vector<int> memo(n + 1, -1);
    return helper(n, memo);
}

int helper(int n, vector<int>& memo) {
    if (n <= 2) return n;
    if (memo[n] != -1) return memo[n];
    
    memo[n] = helper(n-1, memo) + helper(n-2, memo);
    return memo[n];
}

// 动态规划
int climbStairs(int n) {
    if (n <= 2) return n;
    
    vector<int> dp(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    
    return dp[n];
}

// 空间优化
int climbStairs_optimized(int n) {
    if (n <= 2) return n;
    
    int prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}
```

#### 最长递增子序列（LeetCode 300）

```cpp
// DP - O(n²)
int lengthOfLIS_dp(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 1);  // dp[i]表示以nums[i]结尾的LIS长度
    
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
    }
    
    return *max_element(dp.begin(), dp.end());
}

// 贪心+二分 - O(n log n)
int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;  // tails[i]表示长度为i+1的LIS的最小尾元素
    
    for (int num : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), num);
        if (it == tails.end()) {
            tails.push_back(num);
        } else {
            *it = num;
        }
    }
    
    return tails.size();
}
```

#### 编辑距离（LeetCode 72）

```cpp
int minDistance(string word1, string word2) {
    int m = word1.length(), n = word2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    // 初始化
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    
    // 状态转移
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i-1] == word2[j-1]) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = 1 + min({
                    dp[i-1][j],     // 删除
                    dp[i][j-1],     // 插入
                    dp[i-1][j-1]    // 替换
                });
            }
        }
    }
    
    return dp[m][n];
}
```

#### 背包问题

```cpp
// 0-1背包
int knapsack01(vector<int>& weights, vector<int>& values, int capacity) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));
    
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            if (weights[i-1] <= w) {
                dp[i][w] = max(
                    dp[i-1][w],  // 不选第i个物品
                    dp[i-1][w - weights[i-1]] + values[i-1]  // 选第i个物品
                );
            } else {
                dp[i][w] = dp[i-1][w];
            }
        }
    }
    
    return dp[n][capacity];
}

// 空间优化版本
int knapsack01_optimized(vector<int>& weights, vector<int>& values, int capacity) {
    int n = weights.size();
    vector<int> dp(capacity + 1, 0);
    
    for (int i = 0; i < n; i++) {
        for (int w = capacity; w >= weights[i]; w--) {  // 逆序遍历
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    
    return dp[capacity];
}

// 完全背包
int knapsackComplete(vector<int>& weights, vector<int>& values, int capacity) {
    int n = weights.size();
    vector<int> dp(capacity + 1, 0);
    
    for (int i = 0; i < n; i++) {
        for (int w = weights[i]; w <= capacity; w++) {  // 正序遍历
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    
    return dp[capacity];
}
```

### 10.5 图算法题

#### 岛屿数量（LeetCode 200）

```cpp
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;
        
        int m = grid.size(), n = grid[0].size();
        int count = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j);
                }
            }
        }
        
        return count;
    }
    
private:
    void dfs(vector<vector<char>>& grid, int i, int j) {
        int m = grid.size(), n = grid[0].size();
        
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] == '0') {
            return;
        }
        
        grid[i][j] = '0';  // 标记为已访问
        
        dfs(grid, i-1, j);
        dfs(grid, i+1, j);
        dfs(grid, i, j-1);
        dfs(grid, i, j+1);
    }
};
```

#### 课程表（拓扑排序，LeetCode 207）

```cpp
bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> graph(numCourses);
    vector<int> indegree(numCourses, 0);
    
    // 构建图和入度数组
    for (auto& pre : prerequisites) {
        graph[pre[1]].push_back(pre[0]);
        indegree[pre[0]]++;
    }
    
    // BFS拓扑排序
    queue<int> q;
    for (int i = 0; i < numCourses; i++) {
        if (indegree[i] == 0) {
            q.push(i);
        }
    }
    
    int count = 0;
    while (!q.empty()) {
        int course = q.front();
        q.pop();
        count++;
        
        for (int next : graph[course]) {
            indegree[next]--;
            if (indegree[next] == 0) {
                q.push(next);
            }
        }
    }
    
    return count == numCourses;
}
```

---

**本章完**
