# Python编程 - (六)实践项目

通过实践项目巩固Python技能。

---

## 6.1 学生管理系统

```python
class StudentManager:
    def __init__(self):
        self.students = {}
    
    def add_student(self, student_id, name, age):
        """添加学生"""
        if student_id in self.students:
            print(f"学号 {student_id} 已存在")
            return False
        
        self.students[student_id] = {
            'name': name,
            'age': age,
            'courses': [],
            'grades': {}
        }
        print(f"成功添加学生: {name}")
        return True
    
    def enroll_course(self, student_id, course):
        """选课"""
        if student_id not in self.students:
            print(f"学号 {student_id} 不存在")
            return False
        
        self.students[student_id]['courses'].append(course)
        print(f"学生 {self.students[student_id]['name']} 选择了课程: {course}")
        return True
    
    def add_grade(self, student_id, course, grade):
        """添加成绩"""
        if student_id not in self.students:
            print(f"学号 {student_id} 不存在")
            return False
        
        self.students[student_id]['grades'][course] = grade
        print(f"添加成绩: {course} - {grade}分")
        return True
    
    def get_student_info(self, student_id):
        """获取学生信息"""
        if student_id not in self.students:
            return None
        
        student = self.students[student_id]
        avg_grade = sum(student['grades'].values()) / len(student['grades']) if student['grades'] else 0
        
        return {
            'id': student_id,
            'name': student['name'],
            'age': student['age'],
            'courses': student['courses'],
            'grades': student['grades'],
            'average': round(avg_grade, 2)
        }
    
    def list_all_students(self):
        """列出所有学生"""
        for student_id, student in self.students.items():
            info = self.get_student_info(student_id)
            print(f"学号: {student_id}, 姓名: {info['name']}, 平均分: {info['average']}")

# 使用示例
manager = StudentManager()

# 添加学生
manager.add_student("2021001", "Alice", 20)
manager.add_student("2021002", "Bob", 21)

# 选课
manager.enroll_course("2021001", "Python编程")
manager.enroll_course("2021001", "数据结构")

# 添加成绩
manager.add_grade("2021001", "Python编程", 95)
manager.add_grade("2021001", "数据结构", 88)

# 查看信息
info = manager.get_student_info("2021001")
print(f"学生信息: {info}")
```

### 6.2 网络爬虫

```python
import requests
from bs4 import BeautifulSoup
import csv
import time

class WebScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def scrape_news(self, url):
        """爬取新闻标题"""
        try:
            response = self.session.get(url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 查找新闻标题（需要根据实际网站结构调整）
            titles = soup.find_all('h3', class_='news-title')
            
            news_list = []
            for title in titles:
                news_list.append({
                    'title': title.get_text().strip(),
                    'link': title.find('a')['href'] if title.find('a') else '',
                    'time': time.strftime('%Y-%m-%d %H:%M:%S')
                })
            
            return news_list
        
        except requests.RequestException as e:
            print(f"请求错误: {e}")
            return []
        except Exception as e:
            print(f"解析错误: {e}")
            return []
    
    def save_to_csv(self, data, filename):
        """保存到CSV文件"""
        with open(filename, 'w', newline='', encoding='utf-8') as file:
            if data:
                writer = csv.DictWriter(file, fieldnames=data[0].keys())
                writer.writeheader()
                writer.writerows(data)
                print(f"数据已保存到 {filename}")

# 使用示例（需要替换为实际的URL）
# scraper = WebScraper()
# news = scraper.scrape_news('https://example-news-site.com')
# scraper.save_to_csv(news, 'news.csv')
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

💻 **在线平台：**
- Python官方文档
- Real Python
- LeetCode Python题目

### 进阶方向
- **数据科学** - NumPy, Pandas, Scikit-learn
- **Web开发** - Django, Flask, FastAPI
- **自动化** - Selenium, Pytest
- **机器学习** - TensorFlow, PyTorch

---

**本章完**
