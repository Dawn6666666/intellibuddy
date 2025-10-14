# 网络安全 - (二)Web安全

掌握Web安全防护技术。

---

## 2. Web安全

### 2.1 SQL注入防护

```python
import sqlite3
import re

class SecureDatabase:
    def __init__(self, db_path=":memory:"):
        self.conn = sqlite3.connect(db_path)
        self.setup_database()
    
    def setup_database(self):
        """创建测试数据库"""
        cursor = self.conn.cursor()
        
        # 创建用户表
        cursor.execute('''
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                username TEXT UNIQUE,
                password TEXT,
                email TEXT
            )
        ''')
        
        # 插入测试数据
        users = [
            ('admin', 'admin123', 'admin@example.com'),
            ('user1', 'password1', 'user1@example.com'),
            ('user2', 'password2', 'user2@example.com')
        ]
        
        cursor.executemany(
            'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
            users
        )
        
        self.conn.commit()
    
    def vulnerable_login(self, username, password):
        """易受SQL注入攻击的登录（危险示例）"""
        cursor = self.conn.cursor()
        
        # 危险：直接拼接SQL
        query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
        print(f"🚨 危险查询: {query}")
        
        try:
            cursor.execute(query)
            result = cursor.fetchone()
            return result is not None
        except Exception as e:
            print(f"SQL错误: {e}")
            return False
    
    def secure_login(self, username, password):
        """安全的登录实现"""
        cursor = self.conn.cursor()
        
        # 安全：使用参数化查询
        query = "SELECT * FROM users WHERE username=? AND password=?"
        print(f"✅ 安全查询: {query}")
        
        cursor.execute(query, (username, password))
        result = cursor.fetchone()
        return result is not None
    
    def input_validation(self, username):
        """输入验证"""
        # 检查用户名格式
        if not re.match(r'^[a-zA-Z0-9_]{3,20}$', username):
            raise ValueError("用户名格式不正确")
        
        # 检查危险字符
        dangerous_chars = ["'", '"', ';', '--', '/*', '*/', 'xp_', 'sp_']
        for char in dangerous_chars:
            if char in username.lower():
                raise ValueError(f"用户名包含危险字符: {char}")
        
        return True

# 测试SQL注入
db = SecureDatabase()

print("🧪 测试正常登录:")
print(f"正常登录: {db.secure_login('admin', 'admin123')}")

print("\n🚨 测试SQL注入攻击:")
# SQL注入尝试
malicious_input = "admin' OR '1'='1"
print(f"易受攻击版本: {db.vulnerable_login(malicious_input, 'anything')}")
print(f"安全版本: {db.secure_login(malicious_input, 'anything')}")

print("\n🛡️  测试输入验证:")
try:
    db.input_validation("admin")
    print("✅ 正常用户名通过验证")
except ValueError as e:
    print(f"❌ {e}")

try:
    db.input_validation("admin'; DROP TABLE users; --")
    print("✅ 恶意输入通过验证")
except ValueError as e:
    print(f"❌ {e}")
```

### 2.2 XSS防护

```python
import html
import re
from urllib.parse import quote

class XSSProtection:
    @staticmethod
    def html_escape(text):
        """HTML转义"""
        return html.escape(text, quote=True)
    
    @staticmethod
    def js_escape(text):
        """JavaScript转义"""
        # 转义危险字符
        escape_map = {
            '\\': '\\\\',
            '"': '\\"',
            "'": "\\'",
            '\n': '\\n',
            '\r': '\\r',
            '\t': '\\t',
            '<': '\\u003c',
            '>': '\\u003e',
            '&': '\\u0026'
        }
        
        for char, escaped in escape_map.items():
            text = text.replace(char, escaped)
        
        return text
    
    @staticmethod
    def url_encode(text):
        """URL编码"""
        return quote(text, safe='')
    
    @staticmethod
    def sanitize_html(html_content):
        """HTML净化（简化版）"""
        # 移除危险标签
        dangerous_tags = [
            'script', 'iframe', 'object', 'embed', 'form',
            'input', 'textarea', 'button', 'select', 'option'
        ]
        
        for tag in dangerous_tags:
            pattern = f'<{tag}[^>]*>.*?</{tag}>'
            html_content = re.sub(pattern, '', html_content, flags=re.IGNORECASE | re.DOTALL)
            
            # 移除自闭合标签
            pattern = f'<{tag}[^>]*/?>'
            html_content = re.sub(pattern, '', html_content, flags=re.IGNORECASE)
        
        # 移除危险属性
        dangerous_attrs = ['onclick', 'onload', 'onerror', 'onmouseover', 'javascript:']
        for attr in dangerous_attrs:
            pattern = f'{attr}[^>]*'
            html_content = re.sub(pattern, '', html_content, flags=re.IGNORECASE)
        
        return html_content
    
    @staticmethod
    def content_security_policy():
        """生成CSP头"""
        csp = {
            'default-src': "'self'",
            'script-src': "'self' 'unsafe-inline'",
            'style-src': "'self' 'unsafe-inline'",
            'img-src': "'self' data: https:",
            'font-src': "'self'",
            'connect-src': "'self'",
            'frame-ancestors': "'none'"
        }
        
        return '; '.join([f"{key} {value}" for key, value in csp.items()])

# 测试XSS防护
xss = XSSProtection()

# 测试数据
user_input = '<script>alert("XSS攻击")</script>Hello World'
malicious_html = '''
<div onclick="alert('XSS')">
    <script>document.cookie = "stolen"</script>
    <img src="x" onerror="alert('XSS')">
    正常内容
</div>
'''

print("🧪 XSS防护测试:")
print(f"原始输入: {user_input}")
print(f"HTML转义: {xss.html_escape(user_input)}")
print(f"JS转义: {xss.js_escape(user_input)}")
print(f"URL编码: {xss.url_encode(user_input)}")

print(f"\n🧹 HTML净化:")
print(f"原始HTML: {malicious_html}")
print(f"净化后: {xss.sanitize_html(malicious_html)}")

print(f"\n🛡️  CSP策略: {xss.content_security_policy()}")
```

### 2.3 CSRF防护

```python
import secrets
import hmac
import hashlib
import time

class CSRFProtection:
    def __init__(self, secret_key):
        self.secret_key = secret_key
        self.token_expiry = 3600  # 1小时过期
    
    def generate_token(self, user_id, session_id):
        """生成CSRF令牌"""
        timestamp = str(int(time.time()))
        
        # 创建令牌数据
        token_data = f"{user_id}:{session_id}:{timestamp}"
        
        # 生成HMAC签名
        signature = hmac.new(
            self.secret_key.encode(),
            token_data.encode(),
            hashlib.sha256
        ).hexdigest()
        
        # 组合令牌
        token = f"{token_data}:{signature}"
        
        return token
    
    def validate_token(self, token, user_id, session_id):
        """验证CSRF令牌"""
        try:
            # 解析令牌
            parts = token.split(':')
            if len(parts) != 4:
                return False
            
            token_user_id, token_session_id, timestamp, signature = parts
            
            # 验证用户和会话
            if token_user_id != str(user_id) or token_session_id != session_id:
                return False
            
            # 验证时间戳
            token_time = int(timestamp)
            if time.time() - token_time > self.token_expiry:
                return False
            
            # 验证签名
            token_data = f"{token_user_id}:{token_session_id}:{timestamp}"
            expected_signature = hmac.new(
                self.secret_key.encode(),
                token_data.encode(),
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(signature, expected_signature)
        
        except Exception:
            return False
    
    def double_submit_cookie(self):
        """双重提交Cookie方法"""
        # 生成随机令牌
        token = secrets.token_urlsafe(32)
        
        return {
            'csrf_token': token,
            'cookie_value': token  # 同时设置在Cookie中
        }

# 模拟Web应用
class WebApp:
    def __init__(self):
        self.csrf = CSRFProtection("super_secret_key_12345")
        self.sessions = {}
    
    def login(self, user_id):
        """用户登录"""
        session_id = secrets.token_urlsafe(16)
        csrf_token = self.csrf.generate_token(user_id, session_id)
        
        self.sessions[session_id] = {
            'user_id': user_id,
            'csrf_token': csrf_token
        }
        
        return session_id, csrf_token
    
    def protected_action(self, session_id, csrf_token, action_data):
        """受保护的操作"""
        if session_id not in self.sessions:
            return False, "无效会话"
        
        session = self.sessions[session_id]
        user_id = session['user_id']
        
        # 验证CSRF令牌
        if not self.csrf.validate_token(csrf_token, user_id, session_id):
            return False, "CSRF令牌无效"
        
        # 执行操作
        print(f"✅ 执行操作: {action_data}")
        return True, "操作成功"

# 测试CSRF防护
app = WebApp()

print("🧪 CSRF防护测试:")

# 用户登录
session_id, csrf_token = app.login("user123")
print(f"登录成功，会话ID: {session_id}")
print(f"CSRF令牌: {csrf_token[:20]}...")

# 合法请求
success, message = app.protected_action(session_id, csrf_token, "转账100元")
print(f"合法请求: {success} - {message}")

# 伪造请求（无效令牌）
fake_token = "fake_token_12345"
success, message = app.protected_action(session_id, fake_token, "转账1000元")
print(f"伪造请求: {success} - {message}")

# 过期令牌测试（模拟）
time.sleep(1)
success, message = app.protected_action(session_id, csrf_token, "删除账户")
print(f"正常令牌: {success} - {message}")
```

---

**本章完**
