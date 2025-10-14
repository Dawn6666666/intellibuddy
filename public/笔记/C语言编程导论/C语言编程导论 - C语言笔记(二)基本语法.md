# 基本语法篇

从本章开始,我们将深入学习C语言的核心语法知识。理解数据类型、变量、运算符和输入输出是编写任何C程序的基础。

---

### 2.1 数据类型详解
#### 基本数据类型
数据类型决定了变量可以存储什么样的数据以及占用多少内存空间。

| 类型 | 字节数 (典型64位系统) | 取值范围 | 格式符 | 描述 |
| :--- | :---: | :--- | :---: | :--- |
| `char` | 1 | -128 ~ 127 或 0 ~ 255 | `%c` | 单个字符 |
| `unsigned char` | 1 | 0 ~ 255 | `%c` | 无符号字符 |
| `short` | 2 | -32768 ~ 32767 | `%hd` | 短整型 |
| `int` | 4 | $ -2^{31} $ ~ $ 2^{31}-1 $ | `%d` | 整型 (最常用) |
| `unsigned int` | 4 | 0 ~ $ 2^{32}-1 $ | `%u` | 无符号整型 |
| `long` | 8 | $ -2^{63} $ ~ $ 2^{63}-1 $ | `%ld` | 长整型 |
| `long long` | 8 | $ -2^{63} $ ~ $ 2^{63}-1 $ | `%lld` | 更长的整型 |
| `float` | 4 | 约 $ \pm 3.4 \times 10^{38} $ (6-7位有效数字) | `%f` | 单精度浮点数 |
| `double` | 8 | 约 $ \pm 1.7 \times 10^{308} $ (15-16位有效数字) | `%lf` | 双精度浮点数 |


**代码示例 1：查看类型大小**

```c
#include <stdio.h>
#include <limits.h> // 包含整型范围的宏
#include <float.h>  // 包含浮点型范围的宏

int main() {
    printf("--- 数据类型大小 ---\n");
    printf("char: %zu bytes\n", sizeof(char));
    printf("int: %zu bytes\n", sizeof(int));
    printf("float: %zu bytes\n", sizeof(float));
    printf("double: %zu bytes\n", sizeof(double));
    printf("pointer: %zu bytes\n", sizeof(void*)); // 指针大小在64位系统是8字节
    
    printf("\n--- 整型范围 ---\n");
    printf("INT_MIN: %d\n", INT_MIN);
    printf("INT_MAX: %d\n", INT_MAX);
    printf("UINT_MAX: %u\n", UINT_MAX);
    
    printf("\n--- 浮点型范围 ---\n");
    printf("FLT_MIN: %e\n", FLT_MIN); // %e 科学计数法
    printf("FLT_MAX: %e\n", FLT_MAX);
    
    return 0;
}
```

**运行结果:**

```plain
--- 数据类型大小 ---
char: 1 bytes
int: 4 bytes
float: 4 bytes
double: 8 bytes
pointer: 8 bytes

--- 整型范围 ---
INT_MIN: -2147483648
INT_MAX: 2147483647
UINT_MAX: 4294967295

--- 浮点型范围 ---
FLT_MIN: 1.175494e-38
FLT_MAX: 3.402823e+38
```

**代码示例 2：整型溢出**

```c
#include <stdio.h>
#include <limits.h>

int main() {
    int max_int = INT_MAX;
    printf("Max int: %d\n", max_int);
    
    max_int = max_int + 1; // 溢出！
    printf("Max int + 1: %d\n", max_int); // 结果会变成最小值
    
    unsigned int max_uint = UINT_MAX;
    printf("Max unsigned int: %u\n", max_uint);
    
    max_uint = max_uint + 1; // 溢出！
    printf("Max unsigned int + 1: %u\n", max_uint); // 结果会变成0
    
    return 0;
}
```

**运行结果:**

```plain
Max int: 2147483647
Max int + 1: -2147483648
Max unsigned int: 4294967295
Max unsigned int + 1: 0
```

> **🐛 常见Bug**：整型溢出是C语言中一个常见的安全漏洞来源，尤其在进行金融计算或循环次数非常大的场景时需要特别注意。
>

### 2.2 变量声明与初始化
**概念定义**

+ **声明 (Declaration)**：告诉编译器一个变量的名字和类型，但尚未分配内存。
+ **定义 (Definition)**：为变量分配内存空间。在C中，声明通常也是定义。
+ **初始化 (Initialization)**：在定义变量时给它一个初始值。

```c
// 声明并定义一个整型变量 a，但未初始化，其值是随机的
int a;

// 定义并初始化一个整型变量 b，值为10
int b = 10;

// 同时定义多个变量
int x, y, z;

// 同时定义并初始化多个变量
int m = 1, n = 2, p = 3;

// 先定义，后赋值(Assignment)
int c;
c = 20;
```

**最佳实践：** 始终在定义变量时进行初始化，可以避免使用到含有“垃圾值”的未初始化变量。

```c
// 好习惯
int count = 0;
double price = 0.0;
char *name = NULL;

// 坏习惯
int count;
double price;
char *name;
```

**变量命名规范：**

+ **必须**以字母或下划线 `_` 开头。
+ **可以**包含字母、数字、下划线。
+ **区分大小写**：`age` 和 `Age` 是两个不同的变量。
+ **不能**使用C语言的关键字（如 `int`, `if`, `while`）。
+ **推荐**使用有意义的命名，如 `student_count` (下划线法) 或 `studentCount` (驼峰法)。

✅ **合法**：`age`, `total_score`, `_temp`, `count2`  
❌ **非法**：`2count` (数字开头), `my-var` (包含连字符), `int` (关键字)

### 2.3 常量与宏定义
#### 字面常量 (Literal Constants)
直接写在代码里的固定值。

```c
100        // 整型常量
3.14F      // float型常量 (F后缀)
'A'        // 字符常量
"Hello"    // 字符串常量
```

#### `const` 常量 (Const-qualified variables)
使用`const`关键字修饰的变量，其值在初始化后不能被修改。

```c
const int MAX_USERS = 100;
const double PI = 3.14159;

// MAX_USERS = 200;  // 编译错误！不能修改const变量
```

**优点**：

+ 类型安全，编译器会检查类型。
+ 占用内存，有明确的地址，可以被调试器查看。

#### 宏定义 (Macros)
使用 `#define` 预处理指令定义。在预处理阶段，代码中所有宏名会被简单地文本替换。

```c
#define PI 3.14159
#define MAX_SIZE 1000
#define GREETING "Welcome to C programming"
#define SQUARE(x) ((x) * (x)) // 函数式宏

// 在编译前，下面的代码
int area = SQUARE(5);
// 会被替换成
int area = ((5) * (5));
```

**优点**：

+ 不占用内存，只是简单的文本替换。
+ 速度快，没有函数调用的开销。  
**缺点**：
+ 没有类型检查，容易出错。
+ 不易调试，因为编译时宏已经被替换。
+ 宏参数可能被多次求值，带来副作用（见10.1节）。

### 2.4 运算符
#### 算术运算符
```c
#include <stdio.h>

int main() {
    int a = 10, b = 3;
    printf("a + b = %d\n", a + b);   // 13 (加法)
    printf("a - b = %d\n", a - b);   // 7 (减法)
    printf("a * b = %d\n", a * b);   // 30 (乘法)
    printf("a / b = %d\n", a / b);   // 3 (整除，小数部分被截断)
    printf("a %% b = %d\n", a % b);   // 1 (取模，求余数)
    
    // 自增自减
    int c = 5;
    printf("c++ (后增): %d\n", c++); // 先用c的值(5)，再自增
    printf("c after c++: %d\n", c);   // c 变成 6
    
    int d = 5;
    printf("++d (前增): %d\n", ++d); // 先自增，再用d的值(6)
    printf("d after ++d: %d\n", d);   // d 变成 6
    
    return 0;
}
```

**运行结果:**

```plain
a + b = 13
a - b = 7
a * b = 30
a / b = 3
a % b = 1
c++ (后增): 5
c after c++: 6
++d (前增): 6
d after ++d: 6
```

⚠️ **注意：**

+ 整数除法会舍弃小数部分：`10 / 3` 结果是 `3`。
+ 要得到精确的浮点数结果，操作数中至少要有一个是浮点数：`10.0 / 3` 结果是 `3.333...`。

#### 关系运算符
用于比较两个值，结果为`1` (真) 或 `0` (假)。

```c
#include <stdio.h>

int main() {
    int x = 5, y = 10;
    printf("x == y is %d\n", x == y); // 0 (假)
    printf("x != y is %d\n", x != y); // 1 (真)
    printf("x < y is %d\n", x < y);   // 1 (真)
    printf("x > y is %d\n", x > y);   // 0 (假)
    printf("x <= 5 is %d\n", x <= 5); // 1 (真)
    printf("y >= 10 is %d\n", y >= 10); // 1 (真)
    return 0;
}
```

> **🐛 常见Bug**：将赋值运算符 `=` 误用为等于运算符 `==`。例如 `if (x = 5)` 这个条件永远为真，因为赋值表达式的值就是 `5`。
>

#### 逻辑运算符
用于组合多个逻辑表达式。

```c
int a = 1, b = 0; // 在C中，0为假，非0为真
a && b  // 0 (逻辑与: AND，两边都为真才为真)
a || b  // 1 (逻辑或: OR，一边为真就为真)
!a      // 0 (逻辑非: NOT，真变假，假变真)
```

**短路求值 (Short-circuit Evaluation)：**  
逻辑运算符一个重要的特性。

```c
int x = 0;
// 因为 (x != 0) 为假，&& 后面的 (10 / x > 1) 根本不会被执行
// 从而避免了除以0的运行时错误
if ((x != 0) && (10 / x > 1)) {
    printf("This will not be printed.\n");
}
```

#### 位运算符
直接对变量在内存中的二进制位进行操作，速度极快。

```c
#include <stdio.h>

void print_binary(int n) {
    for (int i = 7; i >= 0; i--) {
        printf("%d", (n >> i) & 1);
    }
}

int main() {
    int a = 5;   // 二进制: 00000101
    int b = 3;   // 二进制: 00000011
    
    printf("a = %d (", a); print_binary(a); printf(")\n");
    printf("b = %d (", b); print_binary(b); printf(")\n");

    printf("\na & b = %d (", a & b); print_binary(a & b); printf(") 按位与\n"); // 1 (00000001)
    printf("a | b = %d (", a | b); print_binary(a | b); printf(") 按位或\n"); // 7 (00000111)
    printf("a ^ b = %d (", a ^ b); print_binary(a ^ b); printf(") 按位异或\n"); // 6 (00000110)
    printf("~a = %d (", ~a); print_binary(~a); printf(") 按位取反\n"); // -6 (11111010)
    printf("a << 1 = %d (", a << 1); print_binary(a << 1); printf(") 左移1位\n"); // 10 (00001010)
    printf("a >> 1 = %d (", a >> 1); print_binary(a >> 1); printf(") 右移1位\n"); // 2 (00000010)
    
    return 0;
}
```

**应用示例：**  
位运算在底层编程、嵌入式系统和性能优化中非常有用。

```c
// 1. 判断奇偶数 (比 % 效率高)
int num = 10;
int is_odd = num & 1;  // 结果为1是奇数，0是偶数

// 2. 交换两个数（不用临时变量）
a = a ^ b;
b = a ^ b; // (a^b)^b = a
a = a ^ b; // (a^b)^a = b

// 3. 快速乘以/除以2的幂
int x = 5;
int result_mul = x << 3;  // 相当于 5 * 2^3 = 40
int result_div = x >> 1;  // 相当于 5 / 2^1 = 2
```

### 2.5 类型转换
#### 隐式转换（自动转换）
当不同类型的数据混合运算时，编译器会自动将“低精度”类型转换为“高精度”类型，以防止数据丢失。

```c
int a = 10;
double b = a;  // int -> double，自动转换，b的值为10.0

int c = 3.9;   // double -> int，自动转换，但会截断小数部分，c的值为3
char ch = 100; // int -> char
```

**转换规则（精度从低到高）：**

```plain
char -> short -> int -> long -> long long -> float -> double
```

例如，`int` 和 `double` 运算，`int` 会先被提升为 `double`。

#### 显式转换（强制转换）
由程序员主动进行的类型转换，格式为 `(目标类型)变量`。

```c
#include <stdio.h>

int main() {
    double pi = 3.14159;
    // 强制将double转为int，会丢失小数部分
    int x = (int)pi;  
    printf("x = %d\n", x); // x = 3

    int a = 5, b = 2;
    // 如果不强制转换，5 / 2 的结果是 2
    // 先将a转为double，再进行除法运算
    double result = (double)a / b;  
    printf("result = %.2f\n", result); // 2.50
    
    return 0;
}
```

### 2.6 输入输出
#### `printf` 格式化输出
`printf` (print formatted) 函数可以按照指定的格式输出数据。

```c
#include <stdio.h>

int main() {
    int age = 20;
    double height = 1.75123;
    char grade = 'A';
    char name[] = "Tom";

    printf("姓名: %s, 年龄: %d\n", name, age);
    printf("身高: %.2f 米\n", height);  // .2f 保留2位小数
    printf("等级: %c\n", grade);
    printf("八进制: %o\n", 255);       // 377
    printf("十六进制: %x\n", 255);     // ff
    printf("指针地址: %p\n", &age);   // 打印变量age的内存地址
    printf("用8个字符宽度打印年龄: %8d\n", age);
    printf("用0填充8个字符宽度: %08d\n", age);
    
    return 0;
}
```

**运行结果:**

```plain
姓名: Tom, 年龄: 20
身高: 1.75 米
等级: A
八进制: 377
十六进制: ff
指针地址: 0x7ffc...
用8个字符宽度打印年龄:       20
用0填充8个字符宽度: 00000020
```

#### `scanf` 格式化输入
`scanf` (scan formatted) 函数可以从标准输入（通常是键盘）读取数据并存入变量。

```c
#include <stdio.h>

int main() {
    int num;
    double price;
    char ch;

    printf("请输入一个整数: ");
    // 注意：必须使用 &取地址符，告诉scanf把值存到哪里
    scanf("%d", &num);  

    printf("请输入价格: ");
    scanf("%lf", &price);  // 读取double类型必须用 %lf

    printf("请输入一个字符: ");
    // 在 %c 前加一个空格，可以忽略之前输入留下的换行符或其他空白字符
    scanf(" %c", &ch);  

    printf("你输入的是: 整数=%d, 价格=%.2f, 字符=%c\n", num, price, ch);
    
    return 0;
}
```

> **🐛 常见Bug**：
>
> 1. 忘记在`scanf`中使用取地址符`&`，如`scanf("%d", num)`，这是最常见的错误之一。
> 2. 读取字符`%c`时，没有处理缓冲区中的换行符。上一次`scanf`输入数字后按下的回车键(`\n`)会留在输入缓冲区，被下一次的`%c`读取。解决方法是在`%c`前加一个空格：`scanf(" %c", &ch)`。
>

---

**本章完**
