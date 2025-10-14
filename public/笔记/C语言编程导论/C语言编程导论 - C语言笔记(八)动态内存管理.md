# 动态内存管理篇

动态内存管理是C语言的高级特性,允许程序在运行时按需分配和释放内存。

---

## 8. 动态内存管理
到目前为止，我们使用的变量（如 `int a;`）和数组（如 `int arr[10];`）都有一个共同点：它们的大小在**编译时**就已经确定了。这种内存分配方式要么在栈上（局部变量），要么在静态数据区（全局/静态变量）。但如果程序在**运行时**才需要决定分配多少内存（例如，根据用户输入的文件大小来创建一个数组），静态的方式就无能为力了。

**动态内存管理**允许程序在运行时按需向操作系统“申请”一块内存，并在使用完毕后“归还”它。这块可供自由申请和归还的内存区域，被称为**堆 (Heap)**。

### 8.1 内存布局
**深度原理讲解**  
一个运行中的C程序，其内存通常被划分为以下几个主要区域：

```plain
 高地址  │                                 │
         ├─────────────────────────────────┤
         │      栈区 (Stack)               │ ← 存放函数参数、局部变量。由编译器自动分配和释放，后进先出(LIFO)。
         │       ↓  (向下增长)             │
         ├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┤
         │                                 │
         │                                 │
         │       ↑  (向上增长)             │
         │      堆区 (Heap)                │ ← 程序员通过 malloc/free 手动管理的内存区域。
         ├─────────────────────────────────┤
         │ .bss段 (未初始化数据)           │ ← 存放未初始化的全局变量和静态变量，程序启动时清零。
         ├─────────────────────────────────┤
         │ .data段 (已初始化数据)          │ ← 存放已初始化的全局变量和静态变量。
         ├─────────────────────────────────┤
         │ .text段 (代码段)                │ ← 存放程序的可执行二进制指令，通常是只读的。
 低地址  └─────────────────────────────────┘
```

+ **栈 (Stack)**：分配和释放速度快，但空间有限（通常为几MB）。
+ **堆 (Heap)**：空间大得多（取决于系统物理内存和虚拟内存），但分配和释放的开销也更大，且容易产生内存碎片。

### 8.2 动态内存分配函数 (`<stdlib.h>`)
#### `malloc` - 分配内存 (Memory Allocation)
+ **原型**：`void* malloc(size_t size);`
+ **功能**：在堆上分配 `size` 个字节的连续内存空间。
+ **返回值**：
    - 成功：返回一个指向这块内存起始地址的`void*`指针。`void*`是一种通用指针，可以被强制转换为任何其他类型的指针。
    - 失败（如内存不足）：返回 `NULL`。
+ **注意**：`malloc` **不会**对分配的内存进行初始化，里面的内容是随机的垃圾值。

**代码示例 1：动态创建一个整型数组**

```c
#include <stdio.h>
#include <stdlib.h> // 必须包含此头文件

int main() {
    int n = 5;
    int *arr;

    // 申请 5 个 int 大小的内存空间
    arr = (int*)malloc(n * sizeof(int));
    
    // 黄金法则 1：务必检查 malloc 的返回值
    if (arr == NULL) {
        printf("内存分配失败！程序退出。\n");
        return 1; // 返回非0表示错误
    }
    
    printf("内存分配成功，地址为: %p\n", arr);

    // 使用这块内存
    for (int i = 0; i < n; i++) {
        arr[i] = i * 10;
        printf("arr[%d] = %d\n", i, arr[i]);
    }
    
    // 黄金法则 2：使用完毕后，务必释放内存
    free(arr);
    
    // 黄金法则 3：释放后将指针置为 NULL，防止悬挂指针
    arr = NULL;
    
    return 0;
}
```

#### `calloc` - 分配并清零内存 (Contiguous Allocation)
+ **原型**：`void* calloc(size_t num, size_t size);`
+ **功能**：分配 `num` 个大小为 `size` 的连续内存空间，并且**自动将这块内存的所有字节初始化为0**。
+ **返回值**：与`malloc`相同。

**代码示例 2：使用 **`calloc`

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    // 申请 5 个 int 大小的内存，并初始化为0
    int *arr = (int*)calloc(5, sizeof(int));

    if (arr == NULL) {
        printf("内存分配失败！\n");
        return 1;
    }

    printf("calloc 分配并初始化后的数组:\n");
    for (int i = 0; i < 5; i++) {
        printf("arr[%d] = %d\n", i, arr[i]); // 所有元素都会是 0
    }
    
    free(arr);
    arr = NULL;
    
    return 0;
}
```

#### `realloc` - 重新分配内存 (Re-allocation)
+ **原型**：`void* realloc(void* ptr, size_t new_size);`
+ **功能**：调整指针 `ptr` 所指向的已分配内存块的大小为 `new_size`。
+ **行为**：
    1. 如果 `new_size` < 原大小，内存块会被**缩小**，末尾数据会丢失。
    2. 如果 `new_size` > 原大小，内存块会被**扩大**。
        * 如果原地有足够空间，就在原地扩展。
        * 如果原地空间不足，`realloc`会寻找一块新的足够大的内存，将**原有数据复制**过去，**释放旧的内存块**，并返回**新内存块的地址**。
+ **返回值**：
    - 成功：返回调整后内存块的地址（可能与原地址不同）。
    - 失败：返回 `NULL`，**此时原内存块不会被释放**。

> **🐛**** 常见Bug**：直接用原指针接收 `realloc` 的返回值 `ptr = realloc(ptr, ...)`。如果 `realloc` 失败返回 `NULL`，那么原指针 `ptr` 就会被覆盖成 `NULL`，导致原来的内存块地址丢失，造成**内存泄漏**。
>

**代码示例 3：安全地使用 **`realloc`** 扩展数组**

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    // 初始分配3个int
    int *arr = (int*)malloc(3 * sizeof(int));
    if (arr == NULL) return 1;

    arr[0] = 10; arr[1] = 20; arr[2] = 30;
    
    printf("原始数组: ");
    for(int i=0; i<3; i++) printf("%d ", arr[i]);
    printf("\n");

    // 安全地扩展数组到5个int
    int *temp = (int*)realloc(arr, 5 * sizeof(int));
    if (temp == NULL) {
        printf("重新分配失败！但原数据未丢失。\n");
        free(arr); // 释放原内存
        return 1;
    }
    // 只有在 realloc 成功后，才更新原指针
    arr = temp;

    printf("扩展成功！\n");
    // 初始化新分配的空间
    arr[3] = 40;
    arr[4] = 50;

    printf("扩展后数组: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    free(arr);
    arr = NULL;
    return 0;
}
```

#### `free` - 释放内存
+ **原型**：`void free(void* ptr);`
+ **功能**：归还 `ptr` 指向的、之前由 `malloc`, `calloc`, `realloc` 分配的内存给操作系统。
+ **注意**：
    - 只能 `free` 动态分配的内存。`free` 一个栈变量或全局变量是严重错误。
    - 同一块内存不能 `free` 两次（**重复释放 Double Free**），会导致程序崩溃。
    - `free` 之后，指针 `ptr` 本身的值不会改变，它仍然指向那块（现在已无效的）内存，成为**悬挂指针 (Dangling Pointer)**。

### 8.3 动态内存管理常见错误
#### 1. 内存泄漏 (Memory Leak)
**现象**：分配了内存但忘记释放，导致程序占用的内存越来越多，最终耗尽系统资源。

```c
void memory_leak_example() {
    while(1) {
        int *p = (int*)malloc(1000 * sizeof(int));
        // 忘记调用 free(p)
        // 在每次循环结束时，p本身被销毁，但它指向的内存地址丢失，无法再被释放
    }
}
```

#### 2. 悬挂指针 (Dangling Pointer)
**现象**：指针指向一块已经被 `free` 的内存区域，但程序仍然试图通过这个指针去读写这块内存。

```c
int *p = (int*)malloc(sizeof(int));
*p = 10;
free(p);
// 此时 p 是一个悬挂指针
// *p = 20; // 错误！这块内存可能已经被分配给其他部分使用了
```

**解决方案**：`free(p); p = NULL;`

#### 3. 重复释放 (Double Free)
**现象**：对同一块内存调用两次 `free`。

```c
int *p = (int*)malloc(sizeof(int));
free(p);
// ... 其他代码 ...
free(p); // 错误！导致程序崩溃
```

**解决方案**：释放后置空 `p = NULL;`。`free(NULL)` 是安全无害的操作。

#### 4. 无效内存访问
**现象**：`free`一个不是由 `malloc` 系列函数分配的指针。

```c
int a = 10;
int *p = &a; // p 指向栈上的变量
free(p); // 严重错误！
```

### 8.4 实战：实现一个动态数组 (Vector)
这个例子展示了如何封装动态内存操作，创建一个可以自动扩容的数组。

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int* data;      // 指向堆内存的数据指针
    int size;       // 当前已存储元素个数
    int capacity;   // 当前已分配的容量
} DynamicArray;

// 初始化
void init_array(DynamicArray* arr, int initial_capacity) {
    arr->data = (int*)malloc(initial_capacity * sizeof(int));
    if (arr->data == NULL) exit(1);
    arr->size = 0;
    arr->capacity = initial_capacity;
}

// 添加元素到末尾 (如果需要则扩容)
void push_back(DynamicArray* arr, int value) {
    if (arr->size >= arr->capacity) {
        // 容量不足，扩容为原来的2倍
        int new_capacity = arr->capacity * 2;
        printf("容量不足，从 %d 扩容到 %d\n", arr->capacity, new_capacity);
        int* temp = realloc(arr->data, new_capacity * sizeof(int));
        if (temp == NULL) exit(1);
        arr->data = temp;
        arr->capacity = new_capacity;
    }
    arr->data[arr->size++] = value;
}

// 释放内存
void free_array(DynamicArray* arr) {
    free(arr->data);
    arr->data = NULL;
    arr->size = 0;
    arr->capacity = 0;
}

int main() {
    DynamicArray my_arr;
    init_array(&my_arr, 2); // 初始容量为2
    
    for (int i = 1; i <= 10; i++) {
        push_back(&my_arr, i * 10);
        printf("添加 %d, 当前大小: %d, 容量: %d\n", i * 10, my_arr.size, my_arr.capacity);
    }
    
    free_array(&my_arr);
    return 0;
}
```

### 8.5 实战：实现一个单向链表
链表是动态内存应用的经典范例。它由一系列**节点 (Node)** 组成，每个节点在堆上动态创建，并通过指针连接起来。

```c
#include <stdio.h>
#include <stdlib.h>

// 节点结构
typedef struct Node {
    int data;
    struct Node* next; // 指向下一个节点的指针
} Node;

// 在链表头部插入新节点
void insert_front(Node** head_ref, int new_data) {
    // 1. 分配新节点内存
    Node* new_node = (Node*)malloc(sizeof(Node));
    if (new_node == NULL) exit(1);
    
    // 2. 存入数据
    new_node->data = new_data;
    
    // 3. 将新节点的next指向当前的头节点
    new_node->next = *head_ref;
    
    // 4. 将头指针指向新节点
    *head_ref = new_node;
}

// 打印链表
void print_list(Node* node) {
    while (node != NULL) {
        printf("%d -> ", node->data);
        node = node->next;
    }
    printf("NULL\n");
}

// 释放整个链表
void free_list(Node** head_ref) {
    Node* current = *head_ref;
    Node* next_node;
    while (current != NULL) {
        next_node = current->next; // 先保存下一个节点
        free(current);             // 再释放当前节点
        current = next_node;       // 移动到下一个节点
    }
    *head_ref = NULL; // 将头指针置空
}

int main() {
    Node* head = NULL; // 初始化一个空链表

    insert_front(&head, 30);
    insert_front(&head, 20);
    insert_front(&head, 10);

    printf("创建的链表: ");
    print_list(head);
    
    printf("释放链表...\n");
    free_list(&head);
    
    printf("释放后的链表: ");
    print_list(head);

    return 0;
}
```

### 💡 动态内存最佳实践：
1. **配对使用**：每一个 `malloc`/`calloc`/`realloc` 都必须有一个对应的 `free`。
2. **检查返回值**：总是检查内存分配函数是否返回 `NULL`。
3. **释放后置空**：`free(ptr); ptr = NULL;`，这是避免悬挂指针和重复释放的最简单有效的方法。
4. **所有权明确**：在复杂的程序中，要明确哪段代码负责 `free` 哪块内存，避免"A以为B会释放，B以为A会释放"导致的内存泄漏。
5. **使用工具**：学习使用 Valgrind (Linux/macOS) 或类似的内存调试工具，它们能自动检测内存泄漏、越界访问等问题，是C程序员的必备神器。

---

**本章完**
