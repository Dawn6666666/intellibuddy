# C++面向对象编程 - (三)内存管理

理解C++的内存管理机制和RAII原则。

---

## 3. 内存管理

### 3.1 new/delete操作符

```cpp
// 动态分配单个对象
int* p = new int(10);
delete p;

// 动态分配数组
int* arr = new int[10];
delete[] arr;  // 注意：数组要用delete[]

// 动态分配对象
Person* person = new Person("Alice", 25);
delete person;
```

**常见错误**：

```cpp
// ❌ 内存泄漏
void leak() {
    int* p = new int(10);
    // 忘记delete，内存泄漏
}

// ❌ 重复释放
int* p = new int(10);
delete p;
delete p;  // 未定义行为

// ❌ 野指针
int* p = new int(10);
delete p;
*p = 20;  // p已是野指针
```

**Java对比**：
```java
// Java自动垃圾回收
Person person = new Person("Alice", 25);
// 不需要手动delete，GC会自动回收
```

### 3.2 RAII原则

**资源获取即初始化（Resource Acquisition Is Initialization）**：

```cpp
class FileHandler {
private:
    FILE* file;

public:
    FileHandler(const char* filename) {
        file = fopen(filename, "r");
        if (!file) throw std::runtime_error("Failed to open file");
    }
    
    ~FileHandler() {
        if (file) {
            fclose(file);
            std::cout << "File closed\n";
        }
    }
    
    // 禁止拷贝
    FileHandler(const FileHandler&) = delete;
    FileHandler& operator=(const FileHandler&) = delete;
};

// 使用
void processFile() {
    FileHandler fh("data.txt");
    // 处理文件...
    // 函数结束时自动调用析构函数，关闭文件
}
```

### 3.3 智能指针（C++11）

**unique_ptr（独占所有权）**：

```cpp
#include <memory>

std::unique_ptr<int> p1(new int(10));
// 或使用make_unique（C++14）
auto p2 = std::make_unique<int>(20);

// ❌ 不能拷贝
// std::unique_ptr<int> p3 = p1;  // 编译错误

// ✅ 可以移动
std::unique_ptr<int> p3 = std::move(p1);  // p1变为nullptr
```

**shared_ptr（共享所有权）**：

```cpp
std::shared_ptr<int> p1 = std::make_shared<int>(10);
std::shared_ptr<int> p2 = p1;  // 引用计数+1

std::cout << p1.use_count();  // 2
p1.reset();  // p1释放，引用计数-1
std::cout << p2.use_count();  // 1
// p2超出作用域时，引用计数归0，自动释放
```

**weak_ptr（弱引用，解决循环引用）**：

```cpp
class Node {
public:
    std::shared_ptr<Node> next;
    std::weak_ptr<Node> prev;  // 使用weak_ptr避免循环引用
};

auto n1 = std::make_shared<Node>();
auto n2 = std::make_shared<Node>();
n1->next = n2;
n2->prev = n1;  // weak_ptr不增加引用计数
```

**Java对比**：
```java
// Java所有对象引用类似shared_ptr
Person p1 = new Person("Alice", 25);
Person p2 = p1;  // 引用同一对象
// GC自动管理，无需手动释放
```

### 3.4 内存泄漏检测与防止

**常见内存泄漏场景**：

```cpp
// 场景1：忘记释放
void leaky_function() {
    int* p = new int[1000];
    // 忘记delete[]
}  // 内存泄漏！

// 场景2：异常导致的泄漏
void risky_function() {
    int* p = new int[1000];
    process_data(p);  // 如果抛异常...
    delete[] p;       // 永远不会执行
}

// 解决方案：使用RAII
void safe_function() {
    std::unique_ptr<int[]> p(new int[1000]);
    process_data(p.get());
    // 异常安全：p自动释放
}

// 场景3：循环引用（shared_ptr）
class Node {
public:
    std::shared_ptr<Node> next;
    std::shared_ptr<Node> prev;  // 造成循环引用
};

// 解决：使用weak_ptr
class SafeNode {
public:
    std::shared_ptr<SafeNode> next;
    std::weak_ptr<SafeNode> prev;  // 不增加引用计数
};
```

**检测工具**：
- Valgrind（Linux）
- AddressSanitizer（Clang/GCC）
- Visual Studio 内存检测工具

### 3.5 placement new

**定位new：在指定内存位置构造对象**：

```cpp
#include <new>  // placement new需要

void placement_new_demo() {
    // 分配原始内存
    char buffer[sizeof(std::string) * 3];
    
    // 在buffer中构造对象
    std::string* p1 = new (buffer) std::string("Hello");
    std::string* p2 = new (buffer + sizeof(std::string)) std::string("World");
    std::string* p3 = new (buffer + sizeof(std::string) * 2) std::string("!");
    
    std::cout << *p1 << " " << *p2 << " " << *p3 << "\n";
    
    // 必须显式调用析构函数
    p1->~string();
    p2->~string();
    p3->~string();
    
    // 不要delete p1, p2, p3！（因为没有用new分配）
}

// 内存池应用
class MemoryPool {
private:
    char* pool;
    size_t size;
    size_t offset;

public:
    MemoryPool(size_t s) : size(s), offset(0) {
        pool = new char[size];
    }
    
    ~MemoryPool() {
        delete[] pool;
    }
    
    void* allocate(size_t n) {
        if (offset + n > size) return nullptr;
        void* result = pool + offset;
        offset += n;
        return result;
    }
    
    void reset() { offset = 0; }
};
```

### 3.6 内存对齐

```cpp
#include <iostream>
#include <cstddef>

struct Unaligned {
    char c;    // 1字节
    int i;     // 4字节
    char d;    // 1字节
};  // 实际大小可能是12字节（包含填充）

struct Aligned {
    int i;     // 4字节
    char c;    // 1字节
    char d;    // 1字节
};  // 实际大小可能是8字节

void alignment_demo() {
    std::cout << "sizeof(Unaligned): " << sizeof(Unaligned) << "\n";  // 12
    std::cout << "sizeof(Aligned): " << sizeof(Aligned) << "\n";      // 8
    
    // alignof - 获取对齐要求
    std::cout << "alignof(char): " << alignof(char) << "\n";      // 1
    std::cout << "alignof(int): " << alignof(int) << "\n";        // 4
    std::cout << "alignof(double): " << alignof(double) << "\n";  // 8
    
    // 显式指定对齐（C++11）
    struct alignas(16) AlignedStruct {
        char c;
    };
    std::cout << "sizeof(AlignedStruct): " << sizeof(AlignedStruct) << "\n";  // 16
}
```

### 3.7 自定义内存分配器

```cpp
template <typename T>
class SimpleAllocator {
public:
    using value_type = T;
    
    SimpleAllocator() = default;
    
    template <typename U>
    SimpleAllocator(const SimpleAllocator<U>&) {}
    
    T* allocate(std::size_t n) {
        std::cout << "Allocating " << n << " objects\n";
        return static_cast<T*>(::operator new(n * sizeof(T)));
    }
    
    void deallocate(T* p, std::size_t n) {
        std::cout << "Deallocating " << n << " objects\n";
        ::operator delete(p);
    }
};

template <typename T, typename U>
bool operator==(const SimpleAllocator<T>&, const SimpleAllocator<U>&) {
    return true;
}

template <typename T, typename U>
bool operator!=(const SimpleAllocator<T>&, const SimpleAllocator<U>&) {
    return false;
}

// 使用自定义分配器
void allocator_demo() {
    std::vector<int, SimpleAllocator<int>> vec;
    vec.push_back(1);
    vec.push_back(2);
    vec.push_back(3);
}
```

### 3.8 栈vs堆的选择

**性能对比**：

```cpp
void stack_vs_heap() {
    // 栈分配：快速，自动管理
    int stack_array[1000];  // 瞬间完成
    
    // 堆分配：较慢，需要手动管理
    int* heap_array = new int[1000];  // 需要系统调用
    delete[] heap_array;
    
    // 大对象考虑堆分配（避免栈溢出）
    struct BigData {
        int data[1000000];
    };
    
    // BigData bd;  // 可能导致栈溢出
    BigData* pbd = new BigData();  // 使用堆
    delete pbd;
}
```

**选择建议**：

| 场景 | 推荐 | 原因 |
|------|------|------|
| 小对象、局部变量 | 栈 | 快速、自动管理 |
| 大对象 | 堆 | 避免栈溢出 |
| 生命周期超出函数 | 堆 | 栈对象在函数结束时销毁 |
| 动态大小 | 堆 | 栈大小编译时确定 |
| 需要控制生命周期 | 堆+智能指针 | 灵活管理 |

### 3.9 内存管理最佳实践

```cpp
// 1. 优先使用智能指针
std::unique_ptr<MyClass> obj = std::make_unique<MyClass>();

// 2. 避免裸指针拥有资源
// ❌ 不好
MyClass* p = new MyClass();

// ✅ 好
auto p = std::make_unique<MyClass>();

// 3. 使用容器而非数组
// ❌ 不好
int* arr = new int[100];
delete[] arr;

// ✅ 好
std::vector<int> vec(100);

// 4. RAII封装资源
class FileHandle {
    FILE* file;
public:
    FileHandle(const char* name) {
        file = fopen(name, "r");
    }
    ~FileHandle() {
        if (file) fclose(file);
    }
    // 禁止拷贝
    FileHandle(const FileHandle&) = delete;
    FileHandle& operator=(const FileHandle&) = delete;
};

// 5. 小心悬挂指针
std::shared_ptr<int> sp = std::make_shared<int>(42);
int* raw = sp.get();
sp.reset();  // 释放资源
// *raw;  // 悬挂指针！

// 6. 使用make_shared/make_unique
// ✅ 好（一次分配，异常安全）
auto sp = std::make_shared<MyClass>(args);

// ❌ 不推荐（两次分配）
std::shared_ptr<MyClass> sp2(new MyClass(args));
```

---

**本章完**
