# Python编程 - (十一)综合实战项目

综合实战项目实践。

---

## 11.1 待办事项管理系统（完整版）

```python
import json
from datetime import datetime
from pathlib import Path

class Task:
    """任务类"""
    def __init__(self, title, description='', priority='medium', due_date=None, task_id=None):
        self.id = task_id if task_id else id(self)
        self.title = title
        self.description = description
        self.priority = priority  # low, medium, high
        self.status = 'pending'  # pending, in_progress, completed
        self.due_date = due_date
        self.created_at = datetime.now().isoformat()
        self.completed_at = None
    
    def to_dict(self):
        """转换为字典"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'priority': self.priority,
            'status': self.status,
            'due_date': self.due_date,
            'created_at': self.created_at,
            'completed_at': self.completed_at
        }
    
    @classmethod
    def from_dict(cls, data):
        """从字典创建任务"""
        task = cls(
            title=data['title'],
            description=data.get('description', ''),
            priority=data.get('priority', 'medium'),
            due_date=data.get('due_date'),
            task_id=data.get('id')
        )
        task.status = data.get('status', 'pending')
        task.created_at = data.get('created_at')
        task.completed_at = data.get('completed_at')
        return task
    
    def __str__(self):
        status_symbol = {'pending': '⏳', 'in_progress': '🔄', 'completed': '✅'}
        priority_symbol = {'low': '🟢', 'medium': '🟡', 'high': '🔴'}
        return f"{status_symbol[self.status]} {priority_symbol[self.priority]} {self.title}"

class TodoManager:
    """待办事项管理器"""
    def __init__(self, data_file='todos.json'):
        self.data_file = Path(data_file)
        self.tasks = []
        self.load_tasks()
    
    def add_task(self, title, description='', priority='medium', due_date=None):
        """添加任务"""
        task = Task(title, description, priority, due_date)
        self.tasks.append(task)
        self.save_tasks()
        return task
    
    def get_task(self, task_id):
        """获取任务"""
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None
    
    def update_task_status(self, task_id, status):
        """更新任务状态"""
        task = self.get_task(task_id)
        if task:
            task.status = status
            if status == 'completed':
                task.completed_at = datetime.now().isoformat()
            self.save_tasks()
            return True
        return False
    
    def delete_task(self, task_id):
        """删除任务"""
        task = self.get_task(task_id)
        if task:
            self.tasks.remove(task)
            self.save_tasks()
            return True
        return False
    
    def get_tasks_by_status(self, status):
        """按状态获取任务"""
        return [task for task in self.tasks if task.status == status]
    
    def get_tasks_by_priority(self, priority):
        """按优先级获取任务"""
        return [task for task in self.tasks if task.priority == priority]
    
    def get_overdue_tasks(self):
        """获取过期任务"""
        today = datetime.now().date()
        overdue = []
        for task in self.tasks:
            if task.due_date and task.status != 'completed':
                due = datetime.fromisoformat(task.due_date).date()
                if due < today:
                    overdue.append(task)
        return overdue
    
    def save_tasks(self):
        """保存任务到文件"""
        data = [task.to_dict() for task in self.tasks]
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    def load_tasks(self):
        """从文件加载任务"""
        if self.data_file.exists():
            with open(self.data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.tasks = [Task.from_dict(task_data) for task_data in data]
    
    def display_tasks(self, tasks=None):
        """显示任务列表"""
        tasks_to_display = tasks if tasks is not None else self.tasks
        
        if not tasks_to_display:
            print("📭 没有任务")
            return
        
        print("\n" + "="*60)
        for task in tasks_to_display:
            print(f"ID: {task.id}")
            print(f"   {task}")
            if task.description:
                print(f"   描述: {task.description}")
            if task.due_date:
                print(f"   截止日期: {task.due_date}")
            print("-"*60)

# 使用示例
def main():
    manager = TodoManager()
    
    # 添加任务
    task1 = manager.add_task(
        "完成Python作业",
        "实现待办事项管理系统",
        priority="high",
        due_date="2024-01-20"
    )
    
    task2 = manager.add_task(
        "复习数据结构",
        "复习树和图的算法",
        priority="medium"
    )
    
    task3 = manager.add_task(
        "阅读技术文章",
        priority="low"
    )
    
    # 显示所有任务
    print("\n📋 所有任务:")
    manager.display_tasks()
    
    # 更新任务状态
    manager.update_task_status(task1.id, 'in_progress')
    
    # 显示进行中的任务
    print("\n🔄 进行中的任务:")
    manager.display_tasks(manager.get_tasks_by_status('in_progress'))
    
    # 显示高优先级任务
    print("\n🔴 高优先级任务:")
    manager.display_tasks(manager.get_tasks_by_priority('high'))

# if __name__ == '__main__':
#     main()
```

---

## 📚 学习建议

### 实践项目
1. **计算器程序** - 基础语法练习
2. **文件管理工具** - 文件操作和异常处理
3. **数据分析项目** - pandas和matplotlib应用
4. **Web应用** - Flask或Django框架
5. **爬虫项目** - requests和BeautifulSoup

### 推荐资源
📖 **学习资料：**
- 《Python编程：从入门到实践》
- 《流畅的Python》
- 《Python Cookbook》
- 《利用Python进行数据分析》

💻 **在线平台：**
- Python官方文档（docs.python.org）
- Real Python（realpython.com）
- LeetCode Python题目
- Kaggle（数据科学竞赛）

🎥 **视频课程：**
- Coursera: Python for Everybody
- MIT 6.0001: Introduction to Computer Science and Programming
- 慕课网Python系列

### 进阶方向
- **数据科学** - NumPy, Pandas, Scikit-learn, Matplotlib
- **Web开发** - Django, Flask, FastAPI
- **自动化** - Selenium, Pytest, Airflow
- **机器学习** - TensorFlow, PyTorch, Keras
- **网络编程** - asyncio, aiohttp, websockets
- **DevOps** - Ansible, Fabric, Docker SDK

### Python编码风格（PEP 8）

```python
# 好的命名
user_name = "Alice"  # 变量用小写+下划线
MAX_SIZE = 100       # 常量用大写+下划线

class UserAccount:   # 类名用大驼峰
    pass

def calculate_total():  # 函数用小写+下划线
    pass

# 导入顺序
import os           # 1. 标准库
import sys

import numpy        # 2. 第三方库
import pandas

from myapp import utils  # 3. 本地模块

# 每行最多79个字符
# 使用4个空格缩进（不用Tab）
# 函数和类之间空两行
# 运算符两边加空格：x = 1 + 2
```

---

> **记住**：Python的哲学是"优雅、明确、简单"。写出Pythonic的代码！🐍
> 
> **The Zen of Python (import this)**:
> - Beautiful is better than ugly.
> - Explicit is better than implicit.
> - Simple is better than complex.
> - Readability counts.

---

**本章完**
