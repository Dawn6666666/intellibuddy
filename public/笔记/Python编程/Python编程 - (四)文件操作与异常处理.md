# Python编程 - (四)文件操作与异常处理

掌握文件读写和异常处理机制。

---

## 4.1 文件操作

```python
# 写入文件
with open('data.txt', 'w', encoding='utf-8') as file:
    file.write("Hello, Python!\n")
    file.write("文件操作示例\n")

# 读取文件
with open('data.txt', 'r', encoding='utf-8') as file:
    content = file.read()
    print(content)

# 逐行读取
with open('data.txt', 'r', encoding='utf-8') as file:
    for line in file:
        print(line.strip())

# JSON文件操作
import json

data = {
    "name": "Alice",
    "age": 25,
    "courses": ["Python", "数据结构"]
}

# 写入JSON
with open('student.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=2)

# 读取JSON
with open('student.json', 'r', encoding='utf-8') as file:
    student_data = json.load(file)
    print(student_data)
```

### 4.2 异常处理

```python
def divide_numbers(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("错误: 除数不能为零")
        return None
    except TypeError:
        print("错误: 参数必须是数字")
        return None
    except Exception as e:
        print(f"未知错误: {e}")
        return None
    else:
        print("计算成功")
    finally:
        print("函数执行完毕")

# 测试异常处理
print(divide_numbers(10, 2))    # 正常情况
print(divide_numbers(10, 0))    # 除零错误
print(divide_numbers("10", 2))  # 类型错误

# 自定义异常
class CustomError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

def validate_age(age):
    if age < 0:
        raise CustomError("年龄不能为负数")
    if age > 150:
        raise CustomError("年龄不能超过150岁")
    return True

try:
    validate_age(-5)
except CustomError as e:
    print(f"验证失败: {e.message}")
```

---

**本章完**
