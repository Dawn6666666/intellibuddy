# 数组与字符串篇

数组和字符串是最基础的数据结构,与指针有着密不可分的关系。

---

## 6. 数组与字符串
数组和字符串是C语言中最基础、最重要的数据结构。它们与指针有着密不可分的关系，理解这种关系是掌握C语言的关键。

### 6.1 一维数组
**深度原理讲解**

**数组是在内存中一片连续存储的、相同类型元素的集合。** "连续存储"是数组最核心的特性。当你定义一个数组 `int arr[5];` 时，计算机会在内存中寻找一块能容纳5个 `int` 型变量的、没有间断的空间，并将这块空间的名字标记为 `arr`。

+ **数组名 `arr`**：在大多数情况下，数组名 `arr` 会被编译器当作一个指向数组**首元素**的**常量指针**。它代表地址 `&arr[0]`。你不能对它进行赋值操作，如 `arr = ...` 是非法的。
+ **下标访问 `arr[i]`**：这是一种语法糖。编译器在底层会将其转换为指针运算 `*(arr + i)`。`arr + i` 计算出第 `i` 个元素的地址，然后 `*` 操作符解引用，获取该地址上的值。

**内存示意图 `int numbers[5] = {10, 20, 30, 40, 50};`**

```plain
            +------+------+------+------+------+
地址:      0x1000 |0x1004 |0x1008 |0x100C |0x1010 |
            +------+------+------+------+------+
值:         |  10  |  20  |  30  |  40  |  50  |
            +------+------+------+------+------+
下标:         [0]    [1]    [2]    [3]    [4]
             ^
             |
            arr (值为0x1000)
```

#### 数组的声明与初始化
```c
// 1. 完整初始化
int numbers[5] = {1, 2, 3, 4, 5};

// 2. 根据初始值自动确定大小
int scores[] = {90, 85, 78, 92}; // 编译器会自动推断大小为4

// 3. 部分初始化（其余元素会自动初始化为0）
int arr[10] = {1, 2, 3};  // 结果为 {1, 2, 3, 0, 0, 0, 0, 0, 0, 0}

// 4. 将所有元素初始化为0 (常用技巧)
int zeros[100] = {0};
```

#### 数组的遍历与大小计算
```c
#include <stdio.h>

int main() {
    int numbers[] = {10, 20, 30, 40, 50, 60};
    
    // 动态计算数组大小，这是一个非常重要的技巧
    // sizeof(numbers) 是整个数组占用的总字节数 (6 * 4 = 24 bytes)
    // sizeof(numbers[0]) 是单个元素占用的字节数 (4 bytes)
    // 两者相除得到元素个数
    int size = sizeof(numbers) / sizeof(numbers[0]);

    printf("数组大小为: %d\n", size);

    // 方式1：使用下标遍历
    printf("遍历结果: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\n");
    
    return 0;
}
```

**运行结果:**

```plain
数组大小为: 6
遍历结果: 10 20 30 40 50 60
```

> **🐛 常见Bug：数组越界 (Array Out of Bounds)**  
> C语言**不会**检查数组下标是否在有效范围内。如果你访问 `numbers[6]` 或 `numbers[-1]`，程序不会立即报错，而是会访问到数组旁边未知的内存区域。这可能导致程序崩溃（段错误），或更糟糕的是，悄悄地破坏了其他变量的数据，导致难以追踪的逻辑错误。**始终确保你的循环和索引在 `0` 到 `size-1` 的范围内！**
>

#### 数组常用操作 (冒泡排序)
```c
#include <stdio.h>

// 打印数组的辅助函数
void print_array(const int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

// 冒泡排序函数
void bubble_sort(int arr[], int size) {
    // 外层循环控制需要比较的轮数
    for (int i = 0; i < size - 1; i++) {
        int swapped = 0; // 优化：如果一轮没有交换，说明已经有序
        // 内层循环进行相邻元素的比较和交换
        for (int j = 0; j < size - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // 交换
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        if (!swapped) {
            break; // 提前退出
        }
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int size = sizeof(arr) / sizeof(arr[0]);

    printf("排序前：");
    print_array(arr, size);

    bubble_sort(arr, size);

    printf("排序后：");
    print_array(arr, size);
    
    return 0;
}
```

**运行结果:**

```plain
排序前：64 34 25 12 22 11 90 
排序后：11 12 22 25 34 64 90 
```

### 6.2 二维数组
**深度原理讲解**  
二维数组本质上是“数组的数组”。`int matrix[3][4];` 可以理解为一个有3个元素的大数组，其中每个元素又是一个包含4个`int`的小数组。

在内存中，二维数组同样是**连续存储**的，采用**行主序 (Row-major order)**。这意味着，第0行的所有元素存储完毕后，紧接着存储第1行的所有元素，以此类推。  
`matrix[0][0], matrix[0][1], ..., matrix[0][3], matrix[1][0], ...`

#### 二维数组的声明与初始化
```c
// 声明并完整初始化
int matrix[3][4] = {
    {1, 2, 3, 4},   // 第0行
    {5, 6, 7, 8},   // 第1行
    {9, 10, 11, 12} // 第2行
};

// 简化初始化（可以省略内部大括号）
int matrix2[3][4] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12};

// 可以省略第一维的大小，但必须指定第二维
int mat[][3] = {{1, 2, 3}, {4, 5, 6}}; // 编译器推断为 2x3 矩阵
```

#### 二维数组的遍历
```c
#include <stdio.h>

int main() {
    int matrix[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };
    int rows = 3;
    int cols = 4;

    printf("矩阵内容：\n");
    // 外层循环遍历行
    for (int i = 0; i < rows; i++) {
        // 内层循环遍历列
        for (int j = 0; j < cols; j++) {
            printf("%4d", matrix[i][j]); // %4d 保证对齐
        }
        printf("\n"); // 每行结束换行
    }
    return 0;
}
```

#### 数组作为函数参数
**深度原理讲解**

+ **传递一维数组**：当一维数组作为参数传递时，它会“退化”为一个指向其首元素的指针。因此，`void func(int arr[])` 和 `void func(int *arr)` 是完全等价的。函数内部无法通过`sizeof`得知数组的原始大小，所以必须额外传递一个`size`参数。
+ **传递二维数组**：为了让编译器能正确计算 `matrix[i][j]` 的地址（`*(base_address + i * num_cols + j)`），**必须提供除第一维之外的所有维度的大小**。

**代码示例：向函数传递数组**

```c
#include <stdio.h>

// 接收一维数组
void print_1d_array(int arr[], int size) { // int arr[] 等价于 int *arr
    printf("1D Array: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

// 接收二维数组，必须指定列数
void print_2d_array(int mat[][4], int rows) {
    printf("2D Array:\n");
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%4d", mat[i][j]);
        }
        printf("\n");
    }
}

int main() {
    int numbers[] = {1, 2, 3, 4, 5};
    int matrix[3][4] = {{1,2,3,4}, {5,6,7,8}, {9,10,11,12}};

    print_1d_array(numbers, 5);
    print_2d_array(matrix, 3);
    
    return 0;
}
```

### 6.3 字符串处理

**深度原理讲解**

C语言没有原生的字符串类型。我们用**以空字符 `\0` (null character) 结尾的字符数组**来表示字符串。`\0` 的ASCII码值为0，它是一个不可见的控制字符，作用是作为字符串的结束标记。所有标准字符串处理函数（如`printf %s`, `strlen`, `strcpy`）都依赖这个结束符来确定字符串在哪里结束。

`"Hello"` 在内存中的实际存储：

```plain
+---+---+---+---+---+----+
| H | e | l | l | o | \0 |
+---+---+---+---+---+----+
```

它占用了6个字节，而不是5个！

#### 字符串的表示
**方式1：字符数组 (在栈上，可修改)**

```c
char str1[] = "Hello"; // 编译器自动分配6个字节，并添加 '\0'
```

**方式2：字符串字面量指针 (在只读数据区，不可修改)**

```c
char *str4 = "World"; // str4 是一个指针，指向存储 "World" 的只读内存区域
```

> **🐛 常见Bug：修改字符串字面量**  
> 试图修改由 `char *` 指向的字符串字面量会导致程序崩溃。
>
> ```c
> char *str = "Hello";
> str[0] = 'h'; // 运行时错误！段错误！
> ```
>
> 正确的做法：
> ```c
> char str_arr[] = "Hello";  
> str_arr[0] = 'h'; // 正确，因为str_arr是栈上的一个可写副本  
> printf("%s\n", str_arr); // 输出 "hello"
> ```

#### 字符串输入输出
```c
#include <stdio.h>
#include <string.h> // for strchr

int main() {
    char name[50];

    // 输入 (不安全的方式：scanf遇到空格会停止，且可能导致缓冲区溢出)
    printf("请输入你的姓 (例如: Li): ");
    scanf("%s", name);  // 注意：数组名本身是地址，不需要&
    printf("你的姓是: %s\n", name);

    // 清空输入缓冲区
    while(getchar() != '\n');

    // 更安全的输入方式：fgets
    printf("\n请输入你的全名 (例如: Li Lei): ");
    fgets(name, sizeof(name), stdin); // 最多读取 sizeof(name)-1 个字符

    // fgets会读取并保留换行符 \n，通常需要移除它
    name[strcspn(name, "\n")] = '\0';
    
    printf("你好, %s！\n", name);
    return 0;
}
```

#### 标准库字符串函数 (`<string.h>`)
**代码示例：常用字符串函数**

```c
#include <stdio.h>
#include <string.h>

int main() {
    char str1[50] = "Hello";
    char str2[] = "World";
    char dest[50];

    // 1. strlen: 计算字符串长度 (不包括 \0)
    printf("Length of str1: %zu\n", strlen(str1)); // 5

    // 2. strcpy: 复制字符串 (不安全，可能溢出)
    // strcpy(dest, str1);
    // 使用更安全的 strcpy_s (C11标准) 或 strncpy
    strncpy(dest, str1, sizeof(dest) - 1);
    dest[sizeof(dest) - 1] = '\0'; // 确保结尾是\0
    printf("strcpy result: %s\n", dest);

    // 3. strcat: 连接字符串 (不安全，可能溢出)
    // strcat(dest, " ");
    // strcat(dest, str2);
    // 使用更安全的 strcat_s 或 strncat
    strncat(dest, " ", sizeof(dest) - strlen(dest) - 1);
    strncat(dest, str2, sizeof(dest) - strlen(dest) - 1);
    printf("strcat result: %s\n", dest); // "HelloWorld"

    // 4. strcmp: 比较字符串
    // 返回 <0: str1 < str2
    // 返回 0: str1 == str2
    // 返回 >0: str1 > str2
    printf("strcmp(\"A\", \"B\"): %d\n", strcmp("A", "B")); // < 0
    printf("strcmp(\"B\", \"A\"): %d\n", strcmp("B", "A")); // > 0
    printf("strcmp(\"A\", \"A\"): %d\n", strcmp("A", "A")); // 0
    
    // 5. strchr: 查找字符首次出现的位置
    char *find_l = strchr(dest, 'l');
    if (find_l != NULL) {
        printf("Found 'l' at position: %ld\n", find_l - dest); // 2
    }
    
    // 6. strstr: 查找子串首次出现的位置
    char *find_world = strstr(dest, "World");
    if (find_world != NULL) {
        printf("Found \"World\" at position: %ld\n", find_world - dest); // 5
    }

    return 0;
}
```

#### 手写字符串函数 (理解内部原理)
理解标准库函数如何工作，最好的方式是自己实现一遍。

**手写 `strlen`：**

```c
size_t my_strlen(const char *str) {
    const char *start = str;
    while (*str != '\0') { // 或者简写为 while(*str)
        str++;
    }
    return str - start; // 指针相减得到元素个数
}
```

**手写 `strcpy`：**

```c
char* my_strcpy(char *dest, const char *src) {
    char *original_dest = dest;
    while ((*dest++ = *src++)) {} // 循环复制直到遇到src的'\0'
    return original_dest;
}
```

**手写 `strcmp`：**

```c
int my_strcmp(const char *s1, const char *s2) {
    while (*s1 && (*s1 == *s2)) {
        s1++;
        s2++;
    }
    return *(const unsigned char*)s1 - *(const unsigned char*)s2;
}
```

---

**本章完**
