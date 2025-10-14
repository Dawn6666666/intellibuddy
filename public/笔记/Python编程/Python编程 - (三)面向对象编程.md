# Python编程 - (三)面向对象编程

学习Python的面向对象特性。

---

## 3.1 类和对象

```python
class Student:
    # 类变量
    school = "清华大学"
    
    def __init__(self, name, age, student_id):
        # 实例变量
        self.name = name
        self.age = age
        self.student_id = student_id
        self.courses = []
    
    def enroll(self, course):
        """选课"""
        self.courses.append(course)
        print(f"{self.name} 选择了课程: {course}")
    
    def get_info(self):
        """获取学生信息"""
        return f"姓名: {self.name}, 年龄: {self.age}, 学号: {self.student_id}"
    
    def __str__(self):
        """字符串表示"""
        return f"Student({self.name})"
    
    def __repr__(self):
        """开发者表示"""
        return f"Student('{self.name}', {self.age}, '{self.student_id}')"

# 创建对象
alice = Student("Alice", 20, "2021001")
alice.enroll("Python编程")
print(alice.get_info())
```

### 3.2 继承和多态

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        return f"我是 {self.name}, {self.age} 岁"

class Student(Person):
    def __init__(self, name, age, student_id):
        super().__init__(name, age)  # 调用父类构造函数
        self.student_id = student_id
    
    def introduce(self):  # 方法重写
        return f"我是学生 {self.name}, 学号: {self.student_id}"

class Teacher(Person):
    def __init__(self, name, age, subject):
        super().__init__(name, age)
        self.subject = subject
    
    def introduce(self):
        return f"我是 {self.subject} 老师 {self.name}"

# 多态演示
people = [
    Student("Alice", 20, "2021001"),
    Teacher("Bob", 35, "Python"),
    Person("Charlie", 25)
]

for person in people:
    print(person.introduce())
```

### 3.3 特殊方法

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __add__(self, other):
        """向量加法"""
        return Vector(self.x + other.x, self.y + other.y)
    
    def __mul__(self, scalar):
        """标量乘法"""
        return Vector(self.x * scalar, self.y * scalar)
    
    def __len__(self):
        """向量长度"""
        return int((self.x**2 + self.y**2)**0.5)
    
    def __str__(self):
        return f"Vector({self.x}, {self.y})"
    
    def __eq__(self, other):
        """相等比较"""
        return self.x == other.x and self.y == other.y

# 使用特殊方法
v1 = Vector(3, 4)
v2 = Vector(1, 2)

v3 = v1 + v2        # Vector(4, 6)
v4 = v1 * 2         # Vector(6, 8)
length = len(v1)    # 5
print(v1 == v2)     # False
```

---

**本章完**
