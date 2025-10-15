# 函数与模块化篇

函数是C语言的基石,是实现代码复用和模块化编程的关键。

---

## 4. 函数与模块化编程

函数是C语言的基石。它们是将大型程序分解为可管理、可重用的小块代码的基本方法。理解函数就是理解模块化编程的开始。

### 4.1 函数的定义与调用

**深度原理讲解**

一个函数就像一个"黑盒子"或一个"小型加工厂"。你给它一些原材料（**参数**），它在内部进行一系列处理（**函数体**），然后返回给你一个成品（**返回值**）。

+ **模块化 (Modularity)**：将复杂问题分解成独立的小任务，每个任务由一个函数完成。这使得代码更容易编写、测试和维护。
+ **代码复用 (Reusability)**：同一个函数可以在程序的不同地方被多次调用，避免重复编写相同的代码。
+ **抽象 (Abstraction)**：调用者只需要知道函数的功能、需要什么参数、返回什么结果，而不需要关心函数内部是如何实现的。

**函数的组成部分：**

```c
返回类型 函数名(参数列表) {
    // 函数体 (一系列语句)
    return 返回值; // 返回值的类型必须与声明的返回类型匹配
}
```

**代码示例 1：简单的加法函数**

```c
#include <stdio.h>

// 函数定义：计算两个整数的和
// int: 返回类型，表示函数将返回一个整数
// add: 函数名
// (int a, int b): 参数列表，接收两个整数
int add(int a, int b) {
    int sum = a + b; // 函数体内的局部变量
    return sum;      // 返回计算结果
}

// 函数调用
int main() {
    int num1 = 5, num2 = 3;
    
    // 调用add函数，并将返回值存储在result变量中
    int result = add(num1, num2); 
    
    printf("The sum of %d and %d is: %d\n", num1, num2, result); // 输出 8
    
    // 也可以直接在printf中调用函数
    printf("10 + 20 = %d\n", add(10, 20)); // 输出 30
    
    return 0;
}
```

**运行结果:**

```plain
The sum of 5 and 3 is: 8
10 + 20 = 30
```

**代码示例 2：没有返回值的函数 (`void`)**

有些函数只执行一个动作，不需要返回任何值。

```c
#include <stdio.h>

// 定义一个打印问候语的函数
// void: 返回类型，表示此函数不返回任何值
void print_greeting(char name[]) {
    printf("Hello, %s! Welcome to our program.\n", name);
    // void函数可以没有return语句，或者使用 return; 结束
}

int main() {
    print_greeting("Alice");
    print_greeting("Bob");
    return 0;
}
```

**运行结果:**

```plain
Hello, Alice! Welcome to our program.
Hello, Bob! Welcome to our program.
```

### 4.2 参数传递机制

**深度原理讲解**

C语言中，**所有函数参数传递都是"值传递" (Pass by Value)**。这意味着函数接收到的是实参的一个**副本**，而不是实参本身。在函数内部对形参的任何修改，都不会影响到函数外部的实参。

+ **实参 (Argument)**：调用函数时传入的实际值（如 `main` 函数中的 `x`, `y`）。
+ **形参 (Parameter)**：函数定义中声明的变量（如 `swap` 函数中的 `a`, `b`）。

**内存示意图 (值传递)：**

```plain
   main函数栈帧              swap函数栈帧
   +---------+              +---------+
x: |    5    | --(复制)--> a: |    5    |
   +---------+              +---------+
y: |   10    | --(复制)--> b: |   10    |
   +---------+              +---------+
   swap(a,b)后...            swap(a,b)后...
   +---------+              +---------+
x: |    5    |            a: |   10    |
   +---------+              +---------+
y: |   10    |            b: |    5    |
   +---------+              +---------+
   (x, y 值不变)             (a, b 交换了，但函数结束后销毁)
```

#### 值传递（传递副本） - 无法交换
```c
#include <stdio.h>

void swap(int a, int b) {
    printf("Inside swap (before): a = %d, b = %d\n", a, b);
    int temp = a;
    a = b;
    b = temp;
    printf("Inside swap (after): a = %d, b = %d\n", a, b);
}

int main() {
    int x = 5, y = 10;
    printf("In main (before swap): x = %d, y = %d\n", x, y);
    swap(x, y); // x和y的值被复制给了a和b
    printf("In main (after swap): x = %d, y = %d\n", x, y); // x, y的值没有改变
    return 0;
}
```

**运行结果:**

```plain
In main (before swap): x = 5, y = 10
Inside swap (before): a = 5, b = 10
Inside swap (after): a = 10, b = 5
In main (after swap): x = 5, y = 10
```

#### 指针传递（传递地址） - 模拟"引用传递"

如果我们想在函数内部修改外部变量的值，就必须传递这个变量的**地址**。这本质上还是值传递，只不过传递的值是一个地址。

```c
#include <stdio.h>

// a和b是指针，它们接收的是地址的副本
void swap(int *a, int *b) {
    printf("Inside swap (receiving addresses): a points to %p, b points to %p\n", a, b);
    int temp = *a; // *a: 解引用，获取a指向地址的值
    *a = *b;       // 将b指向的值赋给a指向的内存空间
    *b = temp;     // 将temp的值赋给b指向的内存空间
}

int main() {
    int x = 5, y = 10;
    printf("In main (before swap): x = %d, y = %d\n", x, y);
    printf("Addresses in main: &x = %p, &y = %p\n", &x, &y);
    
    // &x, &y: 取地址符，传递x和y的内存地址
    swap(&x, &y); 
    
    printf("In main (after swap): x = %d, y = %d\n", x, y); // x, y的值成功交换
    return 0;
}
```

**运行结果:**

```plain
In main (before swap): x = 5, y = 10
Addresses in main: &x = 0x7ffee..., &y = 0x7ffee...
Inside swap (receiving addresses): a points to 0x7ffee..., b points to 0x7ffee...
In main (after swap): x = 10, y = 5
```

### 4.3 函数声明与定义分离

**深度原理讲解**

C编译器是自上而下读取代码的。如果在一个函数中调用了另一个在它后面才定义的函数，编译器就会报错，因为它不认识这个函数。**函数声明（Function Prototype）**就是为了解决这个问题。它像一个预告，告诉编译器："嘿，后面会有一个这样名字、这样参数、这样返回值的函数，你先别报错，链接的时候就能找到了。"

这对于将代码组织到多个文件中（模块化编程）至关重要。通常，我们会把函数声明放在 `.h` 头文件中，把函数定义放在 `.c` 源文件中。

```c
// a_math.h - 头文件，用于声明
#ifndef A_MATH_H
#define A_MATH_H
int max(int a, int b); // 函数声明（原型）
#endif

// a_math.c - 源文件，用于定义
#include "a_math.h"
int max(int a, int b) { // 函数定义
    return (a > b) ? a : b;
}

// main.c - 使用函数的源文件
#include <stdio.h>
#include "a_math.h" // 包含头文件，告知main.c有max这个函数

int main() {
    int result = max(5, 10); // 现在可以正常调用
    printf("The maximum is: %d\n", result);
    return 0;
}

// 编译: gcc main.c a_math.c -o my_program
```

### 4.4 递归函数

**深度原理讲解**

递归是一种解决问题的方法，即一个函数直接或间接地调用自身。要正确实现递归，必须满足两个条件：

1. **基准情况 (Base Case)**：一个或多个能直接求解的终止条件，防止无限循环。
2. **递归步骤 (Recursive Step)**：将问题分解成一个或多个规模更小的相同问题，并调用自身来解决。

递归的背后是函数调用栈 (Call Stack)。每一次函数调用，系统都会在栈上创建一个新的**栈帧 (Stack Frame)**，用于存储该次调用的局部变量、参数和返回地址。当函数返回时，对应的栈帧就会被弹出。

`factorial(3)` 的调用栈过程：

```plain
1. main calls factorial(3)
   | factorial(3) |
   | main()       |
   +--------------+

2. factorial(3) calls factorial(2)
   | factorial(2) |
   | factorial(3) |
   | main()       |
   +--------------+

3. factorial(2) calls factorial(1)
   | factorial(1) | -> returns 1
   | factorial(2) |
   | factorial(3) |
   | main()       |
   +--------------+

4. factorial(1) returns, factorial(2) calculates 2*1 and returns 2
   | factorial(3) |
   | main()       |
   +--------------+

5. factorial(2) returns, factorial(3) calculates 3*2 and returns 6
   | main()       |
   +--------------+
```

#### 阶乘计算
```c
#include <stdio.h>

// n! = n * (n-1)!
long long factorial(int n) {
    // 基准情况：当n为0或1时，阶乘为1
    if (n <= 1) {
        printf("Base case: factorial(%d) = 1\n", n);
        return 1;
    }
    // 递归步骤：n乘以n-1的阶乘
    else {
        printf("Recursive step: %d * factorial(%d)\n", n, n - 1);
        long long result = n * factorial(n - 1);
        printf("Returning from factorial(%d), result is %lld\n", n, result);
        return result;
    }
}

int main() {
    int num = 5;
    printf("\nCalculating factorial of %d...\n", num);
    long long fact = factorial(num);
    printf("\nResult: %d! = %lld\n", num, fact); // 120
    return 0;
}
```

#### 斐波那契数列 (低效递归示例)
```c
#include <stdio.h>

// F(n) = F(n-1) + F(n-2)
int fibonacci(int n) {
    // 两个基准情况
    if (n <= 1) {
        return n;
    }
    // 递归步骤
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int n = 10;
    printf("Fibonacci sequence up to %d:\n", n);
    for (int i = 0; i <= n; i++) {
        printf("%d ", fibonacci(i));
    }
    printf("\n");
    // 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55
    return 0;
}
```

> ⚠️ **递归注意事项：**
>
> + **必须有基准情况**，否则会导致无限递归，直到耗尽栈内存，引发"栈溢出"(Stack Overflow)错误。
> + **性能问题**：像上面斐波那契的例子，`fibonacci(5)` 会计算 `fibonacci(3)` 两次，`fibonacci(2)` 三次，存在大量重复计算，效率极低。通常迭代（循环）的性能更好。递归的优势在于代码简洁，能自然地表达分治思想。
>

### 4.5 作用域与生命周期

**深度原理讲解**

+ **作用域 (Scope)**：一个标识符（变量名、函数名）在程序中可以被访问的区域。
    - **块作用域**：在 `{...}` 内声明的变量，只能在该代码块内访问。
    - **文件作用域**：在所有函数外部声明的变量（全局变量），从声明点到文件末尾都可见。
+ **生命周期 (Lifetime)**：变量在内存中存在的时间段。
    - **自动存储期**：局部变量的生命周期。当程序进入其所在的代码块时被创建，退出时被销毁。存储在**栈 (Stack)** 上。
    - **静态存储期**：全局变量和 `static` 变量的生命周期。在程序开始运行时被创建，在程序结束时才被销毁。存储在**静态/全局数据区**。

#### 局部变量 (Local Variables)
```c
#include <stdio.h>

void func() {
    int x = 10; // x是func的局部变量，作用域和生命周期仅限于func函数
    printf("Inside func, x = %d\n", x);
} // x在此处被销毁

int main() {
    int x = 20; // x是main的局部变量，与func中的x是两个完全不同的变量
    printf("Inside main (before func), x = %d\n", x);
    
    func();
    
    printf("Inside main (after func), x = %d\n", x);
    // printf("%d", y); // 错误！y是func的局部变量，在main中不可见
    
    if (x > 10) {
        int y = 5; // y的作用域仅限于这个if代码块
        printf("Inside if block, y = %d\n", y);
    } // y在此处被销毁
    // printf("Outside if block, y = %d\n", y); // 错误！
    
    return 0;
}
```

#### 全局变量 (Global Variables)
```c
#include <stdio.h>

int global_count = 0; // 全局变量，文件作用域，静态生命周期

void increment() {
    global_count++; // 可在任何函数中访问和修改
    printf("Inside increment: global_count = %d\n", global_count);
}

int main() {
    printf("In main (start): global_count = %d\n", global_count);
    increment();
    increment();
    printf("In main (end): global_count = %d\n", global_count); // 值为2
    return 0;
}
```

> **最佳实践**：应尽量避免使用全局变量。它们会增加模块间的耦合度，使代码难以理解和调试，因为任何函数都可能在任何时候修改它的值。优先使用函数参数和返回值来传递数据。
>

### 4.6 存储类别

存储类别关键字告诉编译器变量的存储位置、生命周期和作用域。

#### `static`（静态变量）

`static` 关键字有两种主要用途：

1. **静态局部变量**：在函数内部使用。它的生命周期是整个程序，但作用域仍然是局部的。它只会被初始化一次。
2. **静态全局变量/函数**：在函数外部使用。它的作用域被限制在当前源文件中，无法被其他文件通过 `extern` 访问。这是实现信息隐藏和模块化的重要工具。

**代码示例 1：静态局部变量**

```c
#include <stdio.h>

void counter() {
    // static int count 只在第一次调用时初始化为0
    // 后续调用会保留上一次的值
    static int static_count = 0; 
    
    // int regular_count 每次调用都会被重新创建和初始化为0
    int regular_count = 0;
    
    static_count++;
    regular_count++;
    
    printf("Static count: %d, Regular count: %d\n", static_count, regular_count);
}

int main() {
    printf("First call:\n");
    counter();
    printf("Second call:\n");
    counter();
    printf("Third call:\n");
    counter();
    return 0;
}
```

**运行结果:**

```plain
First call:
Static count: 1, Regular count: 1
Second call:
Static count: 2, Regular count: 1
Third call:
Static count: 3, Regular count: 1
```

#### `extern`（外部变量）

用于声明一个在其他文件中定义的全局变量或函数。它告诉编译器："这个变量的实体在别处，链接时再去找它。"

**代码示例 2：`extern` 跨文件共享变量**

```c
// file1.c
#include <stdio.h>
int global_var = 100; // 定义全局变量

void print_global() {
    printf("From file1: global_var = %d\n", global_var);
}

// file2.c
#include <stdio.h>

// 声明 file1.c 中定义的全局变量
extern int global_var; 
// 声明 file1.c 中定义的函数
extern void print_global();

int main() {
    printf("From file2, accessing global_var: %d\n", global_var);
    global_var = 200; // 修改它
    print_global(); // 调用另一个文件中的函数，会打印出修改后的值
    return 0;
}

// 编译: gcc file1.c file2.c -o program
```

**运行结果:**

```plain
From file2, accessing global_var: 100
From file1: global_var = 200
```

#### `register`（寄存器变量）

这是一个**建议性**关键字，建议编译器将此变量存储在CPU的寄存器中以加快访问速度。

```c
// 建议将循环计数器 i 存入寄存器
register int i;
for (i = 0; i < 1000000; i++) {
    // ... 频繁操作 ...
}
```

> **注意**：现代编译器非常智能，通常能做出比程序员更好的优化决策。因此，`register` 关键字在现代C编程中已**很少使用**，编译器可能会忽略这个建议。不能对 `register` 变量取地址（`&i`），因为它可能不在内存中。
>

---

**本章完**
