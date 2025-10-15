# Python编程 - (十)Web开发实战

用Flask/Django进行Web开发。

---

## 10. Web开发实战

### 10.1 Flask RESTful API

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # 允许跨域

# 模拟数据库
users_db = {
    1: {'id': 1, 'name': 'Alice', 'email': 'alice@example.com'},
    2: {'id': 2, 'name': 'Bob', 'email': 'bob@example.com'}
}
next_id = 3

# GET - 获取所有用户
@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify(list(users_db.values()))

# GET - 获取单个用户
@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = users_db.get(user_id)
    if user:
        return jsonify(user)
    return jsonify({'error': '用户不存在'}), 404

# POST - 创建用户
@app.route('/api/users', methods=['POST'])
def create_user():
    global next_id
    data = request.get_json()
    
    if not data or 'name' not in data or 'email' not in data:
        return jsonify({'error': '缺少必要字段'}), 400
    
    new_user = {
        'id': next_id,
        'name': data['name'],
        'email': data['email']
    }
    
    users_db[next_id] = new_user
    next_id += 1
    
    return jsonify(new_user), 201

# PUT - 更新用户
@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    if user_id not in users_db:
        return jsonify({'error': '用户不存在'}), 404
    
    data = request.get_json()
    user = users_db[user_id]
    
    if 'name' in data:
        user['name'] = data['name']
    if 'email' in data:
        user['email'] = data['email']
    
    return jsonify(user)

# DELETE - 删除用户
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    if user_id not in users_db:
        return jsonify({'error': '用户不存在'}), 404
    
    del users_db[user_id]
    return jsonify({'message': '删除成功'})

# 错误处理
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': '资源未找到'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': '服务器内部错误'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

### 10.2 SQLite数据库操作

```python
import sqlite3
from datetime import datetime

class DatabaseManager:
    """数据库管理器"""
    
    def __init__(self, db_name='app.db'):
        self.db_name = db_name
        self.create_tables()
    
    def get_connection(self):
        """获取数据库连接"""
        conn = sqlite3.connect(self.db_name)
        conn.row_factory = sqlite3.Row  # 使结果可以按列名访问
        return conn
    
    def create_tables(self):
        """创建表"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # 创建用户表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # 创建文章表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                title TEXT NOT NULL,
                content TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_user(self, username, email):
        """添加用户"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                'INSERT INTO users (username, email) VALUES (?, ?)',
                (username, email)
            )
            conn.commit()
            user_id = cursor.lastrowid
            return user_id
        except sqlite3.IntegrityError:
            return None
        finally:
            conn.close()
    
    def get_user(self, user_id):
        """获取用户"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        conn.close()
        
        return dict(user) if user else None
    
    def get_all_users(self):
        """获取所有用户"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM users ORDER BY created_at DESC')
        users = cursor.fetchall()
        conn.close()
        
        return [dict(user) for user in users]
    
    def add_post(self, user_id, title, content):
        """添加文章"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
            (user_id, title, content)
        )
        conn.commit()
        post_id = cursor.lastrowid
        conn.close()
        
        return post_id
    
    def get_user_posts(self, user_id):
        """获取用户的所有文章"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT p.*, u.username
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        ''', (user_id,))
        
        posts = cursor.fetchall()
        conn.close()
        
        return [dict(post) for post in posts]

# 使用示例
db = DatabaseManager()

# 添加用户
user_id = db.add_user('alice', 'alice@example.com')
print(f"创建用户ID: {user_id}")

# 添加文章
post_id = db.add_post(user_id, 'Python学习笔记', '今天学习了Flask和SQLite...')
print(f"创建文章ID: {post_id}")

# 查询
user = db.get_user(user_id)
print(f"用户信息: {user}")

posts = db.get_user_posts(user_id)
print(f"用户文章: {posts}")
```

---

**本章完**
