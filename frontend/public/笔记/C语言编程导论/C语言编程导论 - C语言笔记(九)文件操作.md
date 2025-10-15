# 文件操作篇

文件操作使程序能够永久保存数据,是实用程序的必备技能。

---

## 9. 文件操作
程序运行在内存中，所有数据在程序结束后都会丢失。为了永久性地保存数据，我们需要将其写入**文件**。文件操作允许C程序读取硬盘上的文件内容到内存，或将内存中的数据写入硬盘上的文件。

**深度原理讲解**

在C语言中，我们不直接操作物理文件，而是通过一个叫做**文件流 (File Stream)** 的抽象层来交互。当你打开一个文件时，操作系统会为你创建一个数据结构，其中包含了文件的信息、一个指向**缓冲区 (Buffer)** 的指针以及当前读写位置等。C语言中的 `FILE` 结构体就是这个数据结构的代表。

+ `FILE*` **(文件指针)**：它不是指向文件内容的指针，而是指向这个 `FILE` 管理结构体的指针。我们通过这个指针来间接操作文件。
+ **缓冲区 (Buffer)**：为了提高效率，I/O操作通常不是一个字节一个字节地直接读写硬盘。数据会被先读入/写入内存中的一块缓冲区，当缓冲区满了或者你强制刷新时，才会进行实际的硬盘读写。这大大减少了昂贵的系统调用次数。

### 9.1 文件基础
#### 文件指针与打开模式
要对文件进行操作，第一步是使用 `fopen` 函数打开它，获取一个文件指针。

+ **原型**：`FILE* fopen(const char* filename, const char* mode);`
+ **返回值**：
    - 成功：返回一个指向 `FILE` 结构体的指针。
    - 失败（如文件不存在、权限不足）：返回 `NULL`。

**常用文件打开模式 (`mode`)**

| 模式 | 描述 | 文件不存在时 | 文件存在时 |
| :--- | :--- | :--- | :--- |
| `"r"` | **读 (Read)**：打开一个文本文件，只允许读取。 | 打开失败 (返回`NULL`) | 从文件开头读取 |
| `"w"` | **写 (Write)**：打开一个文本文件，只允许写入。 | 创建新文件 | **清空文件内容**后写入 |
| `"a"` | **追加 (Append)**：打开一个文本文件，在末尾追加内容。 | 创建新文件 | 从文件末尾写入 |
| `"rb"` | **二进制读** | 同 `"r"` | 同 `"r"` |
| `"wb"` | **二进制写** | 同 `"w"` | 同 `"w"` |
| `"ab"` | **二进制追加** | 同 `"a"` | 同 `"a"` |
| `"r+"` | **读写**：打开文本文件进行读写。 | 打开失败 | 从文件开头读写 |
| `"w+"` | **读写**：打开文本文件进行读写。 | 创建新文件 | **清空文件内容**后读写 |
| `"a+"` | **读写**：打开文本文件进行读写。 | 创建新文件 | 从末尾追加，可读 |


> **深度辨析：文本模式 vs. 二进制模式**
>
> + **文本模式 (`"r"`, `"w"`, ...)**：会自动处理不同操作系统下**换行符**的转换。例如，在Windows上写入 `\n`，实际存入文件的是 `\r\n` (回车+换行)；读取 `\r\n` 时，会自动转换回 `\n`。这对于处理纯文本很方便。
> + **二进制模式 (`"rb"`, `"wb"`, ...)**：**所见即所得**。程序写入什么字节，文件就存储什么字节，不做任何转换。这对于处理非文本文件（如图片、音频、结构体数据）至关重要。
>

#### `fopen` 与 `fclose`
**黄金法则**：每一个成功的 `fopen` 都必须对应一个 `fclose`。忘记关闭文件会导致**文件句柄泄漏**，当程序打开过多文件而未关闭时，最终将无法再打开任何新文件。

**代码示例 1：基本的文件打开与关闭**

```c
#include <stdio.h>

int main() {
    FILE *fp = NULL;
    
    // 尝试以写入模式打开文件
    fp = fopen("test.txt", "w");
    
    // 黄金法则：永远在使用文件指针前检查其是否为 NULL
    if (fp == NULL) {
        perror("文件打开失败"); // perror会打印出具体的系统错误信息
        return 1;
    }
    
    printf("文件 test.txt 打开成功！\n");
    
    // ... 在这里进行文件读写操作 ...
    fprintf(fp, "Hello, File!\n");
    
    // 黄金法则：操作完成后，务必关闭文件
    fclose(fp);
    fp = NULL; // 好习惯：关闭后将指针置空
    
    printf("文件已关闭。\n");
    
    return 0;
}
```

### 9.2 文本文件操作
#### 写入文本文件 (`fprintf`, `fputs`, `fputc`)
+ `fprintf(fp, format, ...)`：功能与 `printf` 类似，只是将内容输出到指定的文件流。
+ `fputs(str, fp)`：将一个字符串写入文件（不自动添加换行符）。
+ `fputc(char, fp)`：将一个字符写入文件。

**代码示例 2：多种方式写入文本**

```c
#include <stdio.h>

int main() {
    FILE *fp = fopen("students.txt", "w");
    if (fp == NULL) return 1;
    
    // 使用 fprintf 写入格式化数据
    fprintf(fp, "ID\tName\tScore\n");
    fprintf(fp, "1001\tTom\t85.5\n");
    fprintf(fp, "1002\tJerry\t92.0\n");
    
    // 使用 fputs 写入一行
    fputs("------------------\n", fp);
    
    // 使用 fputc 逐字符写入
    char signature[] = "END";
    for (int i=0; signature[i] != '\0'; i++) {
        fputc(signature[i], fp);
    }
    fputc('\n', fp);
    
    fclose(fp);
    printf("学生信息已写入文件 students.txt！\n");
    return 0;
}
```

#### 读取文本文件 (`fscanf`, `fgets`, `fgetc`)
+ `fscanf(fp, format, ...)`：功能与 `scanf` 类似，从文件流读取格式化数据。
+ `fgets(buffer, size, fp)`：从文件读取一行（最多`size-1`个字符），存入`buffer`。比 `fscanf` 更安全，能读取包含空格的行。
+ `fgetc(fp)`：从文件读取一个字符。

**代码示例 3：逐行读取与格式化读取**

```c
#include <stdio.h>

int main() {
    FILE *fp = fopen("students.txt", "r");
    if (fp == NULL) {
        perror("文件打开失败");
        return 1;
    }
    
    printf("=== 方法1：逐行读取 (fgets) ===\n");
    char line_buffer[100];
    while (fgets(line_buffer, sizeof(line_buffer), fp) != NULL) {
        printf("%s", line_buffer); // fgets 保留了行末的换行符
    }
    
    // rewind 将文件指针重置到文件开头
    rewind(fp);
    
    printf("\n=== 方法2：格式化读取 (fscanf) ===\n");
    int id;
    char name[20];
    float score;
    
    // 跳过表头
    char header_buffer[100];
    fgets(header_buffer, sizeof(header_buffer), fp); 
    
    // fscanf 按格式读取，遇到不匹配的格式会停止
    // 返回值为成功匹配并赋值的变量个数
    while (fscanf(fp, "%d\t%s\t%f", &id, name, &score) == 3) {
        printf("读取到: 学号=%d, 姓名=%s, 成绩=%.1f\n", id, name, score);
    }
    
    fclose(fp);
    return 0;
}
```

> **🐛**** 常见Bug**: `fscanf` 在读取字符串 (`%s`) 时，遇到空白符（空格、制表符、换行符）就会停止。如果姓名是 "Tom Hanks"，`fscanf` 只会读取 "Tom"。`fgets` 是读取整行的更好选择。
>

### 9.3 二进制文件操作
二进制I/O用于读写非文本数据，如结构体、数组、图像等。它能精确地读写内存中的字节序列，无任何转换，速度也更快。

+ `fwrite(ptr, size, count, fp)`：将 `ptr` 指向的内存块中的 `count` 个、每个大小为 `size` 字节的数据项写入文件。
+ `fread(ptr, size, count, fp)`：从文件中读取 `count` 个、每个大小为 `size` 字节的数据项，存入 `ptr` 指向的内存块。

#### 写入二进制数据
**代码示例 4：将结构体数组写入二进制文件**

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    char name[20];
    float score;
} Student;

int main() {
    FILE *fp = fopen("students.dat", "wb"); // 'wb' -> write binary
    if (fp == NULL) return 1;
    
    Student students[] = {
        {1001, "Tom", 85.5f},
        {1002, "Jerry", 92.0f},
        {1003, "Spike", 78.5f}
    };
    
    int count = sizeof(students) / sizeof(Student);
    
    // 将整个数组一次性写入文件
    size_t written_count = fwrite(students, sizeof(Student), count, fp);
    
    if (written_count == count) {
        printf("成功将 %d 条学生记录写入二进制文件 students.dat\n", count);
    }
    
    fclose(fp);
    return 0;
}
```

#### 读取二进制数据
**代码示例 5：从二进制文件读取结构体数组**

```c
#include <stdio.h>
#include <stdlib.h>

// Student 结构体定义需与写入时完全一致
typedef struct {
    int id;
    char name[20];
    float score;
} Student;

int main() {
    FILE *fp = fopen("students.dat", "rb"); // 'rb' -> read binary
    if (fp == NULL) {
        perror("无法打开二进制文件");
        return 1;
    }
    
    Student students[10]; // 假设最多读取10条
    
    // 一次性读取最多10条记录
    size_t read_count = fread(students, sizeof(Student), 10, fp);
    
    printf("从文件成功读取 %zu 条记录:\n", read_count);
    
    for (int i = 0; i < read_count; i++) {
        printf("ID: %d, 姓名: %s, 成绩: %.1f\n",
               students[i].id, students[i].name, students[i].score);
    }
    
    fclose(fp);
    return 0;
}
```

### 9.4 文件定位
有时我们需要随机访问文件中的任意位置，而不是从头到尾顺序读写。

+ `fseek(fp, offset, whence)`：移动文件指针。
    - `offset`：偏移量（字节数），可正可负。
    - `whence`：起始位置。
        * `SEEK_SET`：从文件开头。
        * `SEEK_CUR`：从当前位置。
        * `SEEK_END`：从文件末尾。
+ `ftell(fp)`：返回文件指针相对于文件开头的当前位置（字节数）。
+ `rewind(fp)`：将文件指针移回文件开头（等价于 `fseek(fp, 0, SEEK_SET)`）。

**代码示例 6：随机访问二进制文件记录**

```c
#include <stdio.h>

typedef struct {
    int id;
    char name[20];
    float score;
} Student;

int main() {
    FILE *fp = fopen("students.dat", "rb");
    if (fp == NULL) return 1;
    
    // 获取文件大小来计算记录总数
    fseek(fp, 0, SEEK_END);
    long file_size = ftell(fp);
    int record_count = file_size / sizeof(Student);
    printf("文件大小: %ld 字节, 包含 %d 条记录。\n", file_size, record_count);

    // 读取最后一条记录 (记录索引为 record_count - 1)
    int record_index = record_count - 1;
    fseek(fp, record_index * sizeof(Student), SEEK_SET);

    Student s;
    if (fread(&s, sizeof(Student), 1, fp) == 1) {
        printf("最后一条记录: ID=%d, 姓名=%s, 成绩=%.1f\n", s.id, s.name, s.score);
    }

    // 读取第二条记录 (索引为1)
    fseek(fp, 1 * sizeof(Student), SEEK_SET);
    if (fread(&s, sizeof(Student), 1, fp) == 1) {
        printf("第二条记录: ID=%d, 姓名=%s, 成绩=%.1f\n", s.id, s.name, s.score);
    }
    
    fclose(fp);
    return 0;
}
```

### 9.5 错误处理与文件状态
+ `perror(const char *s)`：当系统调用（如 `fopen`）失败时，`perror` 会打印你提供的字符串 `s`，后跟一个冒号、一个空格，以及对全局变量 `errno` 中错误码的文字描述。
+ `feof(fp)`：检查文件指针是否已到达文件**末尾**。
+ `ferror(fp)`：检查在文件读写过程中是否发生了**错误**（如硬盘已满）。

**代码示例 7：完善的错误检查**

```c
#include <stdio.h>
#include <errno.h>
#include <string.h>

int main() {
    FILE *fp = fopen("nonexistent_file.txt", "r");
    
    if (fp == NULL) {
        // 方法1：使用 perror
        perror("fopen 错误");
        
        // 方法2：使用 strerror
        printf("错误详情: %s (错误码: %d)\n", strerror(errno), errno);
        return 1;
    }
    
    int c;
    while ((c = fgetc(fp)) != EOF) {
        // ...
    }

    // 循环结束后，需要判断是正常到达文件末尾还是发生了错误
    if (feof(fp)) {
        printf("已成功读取到文件末尾。\n");
    } else if (ferror(fp)) {
        printf("在读取文件时发生错误。\n");
    }
    
    fclose(fp);
    return 0;
}
```

### 💡 文件操作最佳实践：
1. **永远检查 **`fopen`** 的返回值**：这是最基本也是最重要的防御性编程。
2. **及时关闭文件 **`fclose`：使用 `RAII` (Resource Acquisition Is Initialization) 思想，在打开文件后，最好能预见到它将在何处被关闭。
3. **二进制数据用二进制模式**：处理非纯ASCII文本时，坚持使用 `"rb"`, `"wb"` 等模式，避免数据损坏。
4. **使用 **`fgets`** 读取文本行**：它比 `fscanf` 更安全，能处理空格并防止缓冲区溢出。
5. **明确错误来源**：循环结束后使用 `feof` 和 `ferror` 来区分是正常结束还是 I/O 错误。
6. **大文件分块处理**：不要试图一次性将G级别的大文件读入内存，应使用循环和缓冲区，一块一块地处理。

---

**本章完**
