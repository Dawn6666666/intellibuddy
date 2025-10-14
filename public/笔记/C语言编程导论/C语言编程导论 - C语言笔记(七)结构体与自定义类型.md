# 结构体与自定义类型篇

当需要将不同类型的数据组合成一个整体时,结构体是最佳选择。

---

当我们需要将不同类型的数据组合成一个有意义的整体时（比如一个学生信息包含学号、姓名、成绩），C语言的内置类型就不够用了。结构体、联合体和枚举提供了创建自定义数据类型的强大能力。

### 7.1 结构体基础 (struct)
**深度原理讲解**

结构体 (Structure) 是一种用户自定义的数据类型，它允许我们将多个不同类型的变量捆绑成一个单一的、命名的单元。这在概念上就是**数据建模**的开始。

在内存中，结构体的成员变量是**按声明顺序依次存储**的。然而，由于**内存对齐 (Memory Alignment)** 的要求，成员之间可能会存在一些未使用的“填充字节”(Padding)。这是因为CPU访问特定类型的数据（如 `int` 或 `double`）时，如果其地址是其大小的整数倍，效率会更高。编译器会自动插入填充字节来保证每个成员都对齐到合适的地址边界。

**例如，`struct Example { char a; int b; };` 的内存布局可能如下：**

```plain
   +---+-------+---+---+
   | a | (pad) | b b b b |  <- sizeof(Example) 可能是 8 字节
   +---+-------+---+---+
     1    3       4       (而不是 1+4=5 字节)
```

#### 结构体的定义与使用
```c
#include <stdio.h>
#include <string.h>

// 步骤1：定义一个学生结构体类型
// struct Student 是一个复合数据类型
struct Student {
    int id;
    char name[50];
    float score;
    char grade;
};

int main() {
    // 步骤2：声明并初始化结构体变量
    // 方法1：使用初始化列表 (顺序必须与定义一致)
    struct Student s1 = {1001, "Zhang San", 85.5f, 'B'};
    
    // 方法2：分别对成员赋值
    struct Student s2;
    s2.id = 1002;
    // 🐛 Bug Alert: 不能直接用 = 给字符数组成员赋值
    // s2.name = "Li Si"; // 错误！
    strcpy(s2.name, "Li Si"); // 必须使用strcpy
    s2.score = 92.0f;
    s2.grade = 'A';
    
    // 方法3：指定成员初始化 (C99标准)
    struct Student s3 = {
        .name = "Wang Wu",
        .id = 1003,
        .score = 78.0f,
        .grade = 'C'
    };
    
    // 步骤3：访问结构体成员，使用点(.)操作符
    printf("学生1: ID=%d, 姓名=%s, 成绩=%.1f, 等级=%c\n", 
           s1.id, s1.name, s1.score, s1.grade);
    
    printf("学生2: ID=%d, 姓名=%s, 成绩=%.1f, 等级=%c\n", 
           s2.id, s2.name, s2.score, s2.grade);

    return 0;
}
```

#### 结构体数组
```c
#include <stdio.h>

struct Student {
    int id;
    char name[50];
    float score;
};

int main() {
    // 定义一个包含3个学生的结构体数组
    struct Student students[3] = {
        {1001, "Zhang San", 85.5f},
        {1002, "Li Si", 92.0f},
        {1003, "Wang Wu", 78.0f}
    };

    printf("学生信息列表:\n");
    printf("%-5s %-15s %s\n", "ID", "Name", "Score");
    printf("----------------------------------\n");
    
    // 遍历结构体数组
    for (int i = 0; i < 3; i++) {
        printf("%-5d %-15s %.1f\n", 
               students[i].id, students[i].name, students[i].score);
    }
    
    return 0;
}
```

#### 结构体指针
对于较大的结构体，在函数间传递指针比传递整个结构体副本要高效得多。

```c
#include <stdio.h>
#include <string.h>

struct Student {
    int id;
    char name[50];
    float score;
};

int main() {
    struct Student s1 = {1001, "Zhang San", 85.5f};
    struct Student *ptr = &s1; // ptr 指向结构体 s1

    // 访问结构体成员的两种方式
    // 方式1：解引用后使用点(.)操作符 (较为繁琐)
    printf("ID (方式1): %d\n", (*ptr).id);    
    
    // 方式2：使用箭头(->)操作符 (推荐，更简洁)
    printf("姓名 (方式2): %s\n", ptr->name);      

    // 通过指针修改结构体成员
    printf("\n修改分数和姓名...\n");
    ptr->score = 90.5f;
    strcpy(ptr->name, "Zhang Sanfeng");

    printf("修改后: ID=%d, 姓名=%s, 成绩=%.1f\n", 
           s1.id, s1.name, s1.score);
    
    return 0;
}
```

#### 结构体与函数
**最佳实践**：

+ 如果函数只是**读取**结构体数据，应使用 `const` 指针 `(const struct Type *ptr)`，这既高效又安全。
+ 如果函数需要**修改**结构体数据，则使用普通指针 `(struct Type *ptr)`。
+ 尽量**避免**直接传递大型结构体副本 `(struct Type val)`，因为这会产生不必要的内存和时间开销。

```c
#include <stdio.h>

typedef struct {
    int id;
    char name[50];
    float score;
} Student;

// 接收 const 指针，只读，高效且安全
void print_student(const Student *s) {
    printf("ID: %d, 姓名: %s, 成绩: %.1f\n",
           s->id, s->name, s->score);
}

// 接收普通指针，可以修改结构体内容
void update_score(Student *s, float new_score) {
    if (new_score >= 0 && new_score <= 100) {
        s->score = new_score;
    }
}

int main() {
    Student stu = {1001, "Test Student", 88.0f};
    
    printf("原始信息: \n");
    print_student(&stu);
    
    update_score(&stu, 95.5f);
    
    printf("\n更新后信息: \n");
    print_student(&stu);

    return 0;
}
```

### 7.2 结构体嵌套
结构体可以包含其他结构体作为其成员，形成更复杂的数据模型。

```c
#include <stdio.h>

// 定义日期结构体
struct Date {
    int year;
    int month;
    int day;
};

// 员工结构体，嵌套了Date结构体
struct Employee {
    int id;
    char name[50];
    struct Date birth_date;  // 嵌套的结构体成员
    struct Date hire_date;
};

int main() {
    struct Employee emp = {
        .id = 2001,
        .name = "Wang Xiaoming",
        .birth_date = {1995, 3, 15}, // 初始化嵌套结构体
        .hire_date = {2020, 7, 1}
    };
    
    // 访问嵌套成员使用链式点操作符
    printf("员工姓名: %s\n", emp.name);
    printf("出生日期: %d-%d-%d\n", 
           emp.birth_date.year, emp.birth_date.month, emp.birth_date.day);
    
    return 0;
}
```

### 7.3 联合体 (Union)
**深度原理讲解**  
联合体是一种特殊的数据结构，它的所有成员**共享同一块内存空间**。这块空间的大小由**最大**的那个成员决定。

+ **用途**：主要用于节省内存。当你需要在一个变量中存储多种不同类型的数据，但任何时候只会使用其中一种时，联合体是理想选择。例如，一个通用的数据包，其内容可能是整数、浮点数或字符串。
+ **风险**：在同一时间，只有一个成员是有效的。如果你向一个成员写入数据，然后试图从另一个成员读取，结果是未定义的（通常是数据损坏）。

```c
#include <stdio.h>
#include <string.h>

// 联合体：所有成员共享同一块内存
union Data {
    int i;
    float f;
    char str[20];
};

int main() {
    union Data data;
    
    // 联合体的大小取决于其最大的成员 (char str[20])
    printf("联合体大小: %zu 字节\n", sizeof(data)); 
    
    // 1. 存入整数
    data.i = 10;
    printf("data.i = %d\n", data.i);
    
    // 2. 存入浮点数 (这会覆盖掉原来的整数)
    data.f = 220.5;
    printf("data.f = %.1f\n", data.f);
    // 此时，i 的值已经被破坏
    printf("data.i (被覆盖后) = %d\n", data.i); // 输出一个奇怪的数字
    
    // 3. 存入字符串 (覆盖了浮点数)
    strcpy(data.str, "C Programming");
    printf("data.str = %s\n", data.str);
    printf("data.f (被覆盖后) = %f\n", data.f); // 输出垃圾值
    
    return 0;
}
```

### 7.4 枚举类型 (Enum)
枚举提供了一种创建**具名整型常量**的便捷方式，它比使用 `#define` 更安全、更具可读性。

```c
#include <stdio.h>

// 定义一周的枚举类型
// 默认情况下，MONDAY=0, TUESDAY=1, ...
enum Weekday {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
};

// 定义颜色枚举，并手动指定值
enum Color {
    RED = 1,
    GREEN = 2,
    BLUE = 4
};

void check_day(enum Weekday day) {
    switch (day) {
        case SATURDAY:
        case SUNDAY:
            printf("今天是周末！\n");
            break;
        default:
            printf("今天是工作日。\n");
            break;
    }
}

int main() {
    enum Weekday today = FRIDAY;
    
    printf("FRIDAY 的整数值是: %d\n", today); // 4
    
    check_day(today);
    check_day(SATURDAY);
    
    return 0;
}
```

### 7.5 `typedef` 类型定义
`typedef` 关键字用于为现有的数据类型创建一个新的**别名**。这能极大简化复杂类型的声明，提高代码的可读性。

```c
#include <stdio.h>

// 最常见的用法：为结构体创建别名
// 从此以后，我们可以用 Point 代替 struct PointDefinition
typedef struct PointDefinition {
    int x;
    int y;
} Point;

// 为函数指针类型创建别名
typedef int (*Operation)(int, int);
int add(int a, int b) { return a+b; }

// 为数组类型创建别名
typedef int Vector[3];

int main() {
    // 使用简化的类型名 Point
    Point p1 = {10, 20};
    printf("点 P1: (%d, %d)\n", p1.x, p1.y);
    
    // 使用函数指针别名 Operation
    Operation op = add;
    printf("10 + 20 = %d\n", op(10, 20));
    
    // 使用数组别名 Vector
    Vector v = {1, 2, 3};
    printf("向量 V: [%d, %d, %d]\n", v[0], v[1], v[2]);
    
    return 0;
}
```

### 7.6 实战示例：学生管理系统 (精简版)
这个例子综合运用了 `typedef`, `struct`, 数组和函数，展示了如何用它们来构建一个简单的应用程序。

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAX_STUDENTS 100

// 使用 typedef 简化结构体声明
typedef struct {
    int id;
    char name[50];
    float scores[3]; // 三门课程成绩
    float average;
} Student;

// 全局学生数组和计数器 (为简化示例，实际项目中可能用动态内存)
Student students[MAX_STUDENTS];
int student_count = 0;

// 函数声明
void add_student();
void display_students();
void find_student();

int main() {
    int choice;
    while (1) {
        printf("\n=== 学生管理系统 ===\n");
        printf("1. 添加学生\n");
        printf("2. 显示所有学生\n");
        printf("3. 查找学生\n");
        printf("4. 退出\n");
        printf("请选择：");
        
        if (scanf("%d", &choice) != 1) {
             while(getchar() != '\n'); // 清空无效输入
             printf("无效输入！\n");
             continue;
        }
        
        switch (choice) {
            case 1: add_student(); break;
            case 2: display_students(); break;
            case 3: find_student(); break;
            case 4: printf("再见！\n"); exit(0);
            default: printf("无效选择！\n");
        }
    }
    return 0;
}

// 添加学生
void add_student() {
    if (student_count >= MAX_STUDENTS) {
        printf("学生数量已达上限！\n");
        return;
    }
    
    Student *s = &students[student_count]; // 使用指针简化访问
    
    printf("请输入学生ID：");
    scanf("%d", &s->id);
    
    printf("请输入学生姓名：");
    scanf("%s", s->name);
    
    printf("请依次输入三门课程成绩：");
    float sum = 0;
    for (int i = 0; i < 3; i++) {
        scanf("%f", &s->scores[i]);
        sum += s->scores[i];
    }
    s->average = sum / 3.0f;
    
    student_count++;
    printf("学生添加成功！\n");
}

// 显示所有学生
void display_students() {
    if (student_count == 0) {
        printf("暂无学生信息！\n");
        return;
    }
    printf("\n%-6s %-12s %-8s %-8s %-8s %-8s\n", 
           "ID", "姓名", "成绩1", "成绩2", "成绩3", "平均分");
    printf("--------------------------------------------------\n");
    
    for (int i = 0; i < student_count; i++) {
        const Student *s = &students[i]; // 使用const指针
        printf("%-6d %-12s %-8.1f %-8.1f %-8.1f %-8.1f\n",
               s->id, s->name, s->scores[0], s->scores[1], s->scores[2], s->average);
    }
}

// 查找学生
void find_student() {
    int id, found = 0;
    printf("请输入要查找的学生ID：");
    scanf("%d", &id);
    
    for (int i = 0; i < student_count; i++) {
        if (students[i].id == id) {
            printf("找到学生：\n");
            print_student(&students[i]); // 复用打印函数
            found = 1;
            break;
        }
    }
    if (!found) {
        printf("未找到ID为%d的学生！\n", id);
    }
}
```

### 💡 结构体最佳实践：
1. **使用**`typedef`**简化**：`typedef struct {...} MyType;` 使代码更简洁。
2. **指针传递效率高**：对于非小型结构体，优先通过指针传递给函数，以避免复制整个结构体的开销。
3. `const`**保护数据**：如果函数不应修改结构体内容，请使用 `const` 指针 `(const MyType *ptr)`。
4. **注意内存对齐**：在处理网络协议或文件格式等需要精确内存布局的场景时，要特别小心编译器可能添加的填充字节。
5. **字符串成员用**`strcpy`：切记不能用 `=` 为结构体内的字符数组成员赋值。

---

**本章完**
