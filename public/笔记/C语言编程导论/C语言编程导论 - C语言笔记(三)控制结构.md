# 控制结构篇

控制结构是程序的骨架,它决定了代码的执行流程。本章将学习顺序、选择和循环三大基本结构。

---

## 3. 控制结构
控制结构决定了代码的执行流程，是程序逻辑的基础。

### 3.1 顺序结构
程序默认的执行方式，代码从上到下一行一行地执行。

```c
#include <stdio.h>

int main() {
    // 步骤1
    int a = 5;
    printf("Step 1: a = %d\n", a);
    
    // 步骤2
    int b = 10;
    printf("Step 2: b = %d\n", b);
    
    // 步骤3
    int sum = a + b;
    printf("Step 3: Sum = %d\n", sum);
    
    return 0;
}
```

### 3.2 选择结构
根据条件判断，选择性地执行不同的代码块。

#### `if-else` 语句
最基本的条件判断结构。

```c
#include <stdio.h>

int main() {
    int score = 85;

    if (score >= 90) {
        printf("优秀\n");
    } else if (score >= 80) {
        printf("良好\n"); // 这个分支会被执行
    } else if (score >= 60) {
        printf("及格\n");
    } else {
        printf("不及格\n");
    }
    
    // 简单的if
    if (score > 0) {
        printf("这是一个有效的分数。\n");
    }
    
    return 0;
}
```

**三目运算符 (Ternary Operator)：** `if-else` 的简化形式。  
`条件 ? 表达式1 : 表达式2`

```c
int a = 10, b = 20;
int max = (a > b) ? a : b; // max 的值为 20
```

#### `switch-case` 语句
适用于对一个变量的多个离散值进行判断。比一长串 `if-else if` 更清晰、效率更高。

```c
#include <stdio.h>

int main() {
    char grade = 'B';

    switch (grade) {
        case 'A':
            printf("优秀 (90-100)\n");
            break; // break用于跳出switch结构
        case 'B':
            printf("良好 (80-89)\n");
            break;
        case 'C':
            printf("及格 (60-79)\n");
            break;
        default: // 如果所有case都不匹配，则执行default
            printf("不及格\n");
            break;
    }
    return 0;
}
```

> **🐛 常见Bug：忘记写 `break`！** 如果忘记 `break`，程序会继续执行下一个`case`的代码，这被称为"穿透"(fall-through)。
>

```c
int day = 2;
switch (day) {
    case 1: printf("周一\n");
    case 2: printf("周二\n");  // 从这里开始执行
    case 3: printf("周三\n");  // 因为case 2没有break，会继续执行这里
}
// 输出会是：周二 周三
```

有时我们会故意利用穿透特性来处理多种情况：

```c
char ch = 'a';
switch (ch) {
    case 'a':
    case 'e':
    case 'i':
    case 'o':
    case 'u':
        printf("元音字母\n");
        break;
    default:
        printf("辅音字母\n");
}
```

### 3.3 循环结构
重复执行一段代码，直到满足某个退出条件。

#### `for` 循环
最常用的循环结构，适用于**已知循环次数**的场景。

```c
// 基本格式
for (初始化; 条件判断; 增量/减量) {
    // 循环体
}

// 示例1：输出1-10
for (int i = 1; i <= 10; i++) {
    printf("%d ", i);
}
printf("\n");

// 示例2：计算1到100的和
int sum = 0;
for (int i = 1; i <= 100; i++) {
    sum += i;
}
printf("1到100的和是: %d\n", sum);
```

**执行流程：**

1. **初始化**：`int i = 1`，只在循环开始时执行一次。
2. **条件判断**：`i <= 10`，每次循环开始前都判断，如果为真，执行循环体；如果为假，退出循环。
3. **执行循环体**：`printf("%d ", i);`
4. **增量/减量**：`i++`，每次循环体执行完后执行。
5. 回到第2步。

#### `while` 循环
适用于**未知循环次数**，只知道循环继续的条件。

```c
#include <stdio.h>

int main() {
    // 示例1：当用户输入非0时持续相加
    int num, sum = 0;
    printf("输入数字相加，输入0结束：\n");
    scanf("%d", &num);
    
    while (num != 0) {
        sum += num;
        scanf("%d", &num);
    }
    
    printf("总和是: %d\n", sum);
    return 0;
}
```

**执行流程：** 先判断条件，如果为真，再执行循环体。如果第一次条件就为假，循环体一次都不会执行。

#### `do-while` 循环
与 `while` 类似，但它**保证循环体至少执行一次**。

```c
#include <stdio.h>

int main() {
    int choice;
    do {
        printf("\n--- 菜单 ---\n");
        printf("1. 开始游戏\n");
        printf("2. 加载游戏\n");
        printf("3. 退出\n");
        printf("请输入你的选择: ");
        scanf("%d", &choice);
        
        // ... 处理选择 ...

    } while (choice != 3); // 只有当用户选择3时才退出循环

    printf("感谢使用！\n");
    return 0;
}
```

**执行流程：** 先执行一次循环体，然后再判断条件。

### 3.4 跳转语句
#### `break` (跳出循环)
用于立即终止并跳出当前所在的`switch`或循环结构。

```c
// 在1到10中寻找第一个能被7整除的数
for (int i = 1; i <= 10; i++) {
    if (i % 7 == 0) {
        printf("找到了: %d\n", i);
        break;  // 找到后立即跳出for循环
    }
    printf("Checking %d...\n", i);
}
// 输出会是：Checking 1... Checking 2... Checking 3... Checking 4... Checking 5... Checking 6... 找到了: 7
```

#### `continue` (跳过本次循环)
用于跳过当前循环中尚未执行的代码，直接进入下一次循环的条件判断。

```c
// 输出1到10之间的所有奇数
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        continue;  // 如果是偶数，就跳过下面的printf，直接i++
    }
    printf("%d ", i);
}
// 输出: 1 3 5 7 9
```

#### `goto` (无条件跳转，强烈不推荐)
`goto`可以跳转到函数内的任意一个标签处。但它会破坏程序的结构化，使代码难以阅读和维护，应极力避免使用。

```c
// 仅作演示，实际开发中不要使用
int i = 0;
start:
    if (i < 5) {
        printf("%d ", i);
        i++;
        goto start;
    }
```

唯一的合理用法可能是在多层嵌套循环中，需要从最内层直接跳出到最外层时。

### 3.5 嵌套循环
循环结构内部还可以包含另一个循环结构。

#### 打印九九乘法表
```c
#include <stdio.h>

int main() {
    // 外层循环控制行 (i)
    for (int i = 1; i <= 9; i++) {
        // 内层循环控制列 (j)，并且列数不超过当前行数
        for (int j = 1; j <= i; j++) {
            // %-7s 表示左对齐，宽度为7
            printf("%d*%d=%-2d  ", j, i, i * j); 
        }
        printf("\n"); // 每行结束后换行
    }
    return 0;
}
```

**运行结果:**

```plain
1*1=1   
1*2=2   2*2=4   
1*3=3   2*3=6   3*3=9   
1*4=4   2*4=8   3*4=12  4*4=16  
...
```

#### 打印图形 (空心菱形)
```c
#include <stdio.h>

int main() {
    int n = 5; // 菱形的半径

    // 打印上半部分
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n - i; j++) printf(" ");
        for (int j = 1; j <= 2 * i - 1; j++) {
            if (j == 1 || j == 2 * i - 1) printf("*");
            else printf(" ");
        }
        printf("\n");
    }

    // 打印下半部分
    for (int i = n - 1; i >= 1; i--) {
        for (int j = 1; j <= n - i; j++) printf(" ");
        for (int j = 1; j <= 2 * i - 1; j++) {
            if (j == 1 || j == 2 * i - 1) printf("*");
            else printf(" ");
        }
        printf("\n");
    }
    return 0;
}
```

**运行结果:**

```plain
    *
   * *
  * *
 * *
* *
 * *
  * *
   * *
    *
```

---

**本章完**
