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

### 2.4 OAuth 2.0 与第三方登录

**OAuth 2.0**是一个授权框架，允许第三方应用访问用户资源而无需获取密码。

```python
import secrets
import hashlib
import time
from urllib.parse import urlencode, parse_qs

class OAuth2Server:
    """OAuth 2.0 授权服务器"""
    
    def __init__(self):
        # 注册的客户端
        self.clients = {
            'client_123': {
                'client_secret': 'secret_456',
                'redirect_uris': ['http://localhost:8000/callback'],
                'name': 'Example App'
            }
        }
        
        # 授权码（临时）
        self.authorization_codes = {}
        
        # 访问令牌
        self.access_tokens = {}
        
        # 刷新令牌
        self.refresh_tokens = {}
    
    def authorize(self, client_id, redirect_uri, scope, state):
        """授权码流程 - 第一步：授权请求"""
        # 验证客户端
        if client_id not in self.clients:
            return None, "无效的客户端ID"
        
        client = self.clients[client_id]
        
        # 验证重定向URI
        if redirect_uri not in client['redirect_uris']:
            return None, "无效的重定向URI"
        
        # 生成授权码
        code = secrets.token_urlsafe(32)
        
        # 存储授权码（5分钟有效）
        self.authorization_codes[code] = {
            'client_id': client_id,
            'redirect_uri': redirect_uri,
            'scope': scope,
            'expires_at': time.time() + 300,  # 5分钟
            'user_id': 'user_12345'  # 模拟用户授权
        }
        
        # 构建回调URL
        params = {
            'code': code,
            'state': state
        }
        
        callback_url = f"{redirect_uri}?{urlencode(params)}"
        
        return callback_url, "授权成功"
    
    def token(self, grant_type, code=None, redirect_uri=None, 
              client_id=None, client_secret=None, refresh_token=None):
        """授权码流程 - 第二步：获取令牌"""
        
        # 验证客户端凭据
        if client_id not in self.clients:
            return None, "无效的客户端"
        
        client = self.clients[client_id]
        if client['client_secret'] != client_secret:
            return None, "客户端认证失败"
        
        if grant_type == 'authorization_code':
            # 授权码换令牌
            if code not in self.authorization_codes:
                return None, "无效的授权码"
            
            auth_data = self.authorization_codes[code]
            
            # 检查授权码是否过期
            if time.time() > auth_data['expires_at']:
                del self.authorization_codes[code]
                return None, "授权码已过期"
            
            # 验证重定向URI
            if redirect_uri != auth_data['redirect_uri']:
                return None, "重定向URI不匹配"
            
            # 删除授权码（一次性使用）
            del self.authorization_codes[code]
            
            # 生成访问令牌
            access_token = secrets.token_urlsafe(32)
            refresh_token_str = secrets.token_urlsafe(32)
            
            # 存储令牌
            self.access_tokens[access_token] = {
                'user_id': auth_data['user_id'],
                'client_id': client_id,
                'scope': auth_data['scope'],
                'expires_at': time.time() + 3600  # 1小时
            }
            
            self.refresh_tokens[refresh_token_str] = {
                'user_id': auth_data['user_id'],
                'client_id': client_id,
                'scope': auth_data['scope']
            }
            
            return {
                'access_token': access_token,
                'token_type': 'Bearer',
                'expires_in': 3600,
                'refresh_token': refresh_token_str,
                'scope': auth_data['scope']
            }, "令牌颁发成功"
        
        elif grant_type == 'refresh_token':
            # 刷新令牌
            if refresh_token not in self.refresh_tokens:
                return None, "无效的刷新令牌"
            
            token_data = self.refresh_tokens[refresh_token]
            
            # 生成新的访问令牌
            access_token = secrets.token_urlsafe(32)
            
            self.access_tokens[access_token] = {
                'user_id': token_data['user_id'],
                'client_id': client_id,
                'scope': token_data['scope'],
                'expires_at': time.time() + 3600
            }
            
            return {
                'access_token': access_token,
                'token_type': 'Bearer',
                'expires_in': 3600
            }, "令牌刷新成功"
        
        return None, "不支持的授权类型"
    
    def verify_token(self, access_token):
        """验证访问令牌"""
        if access_token not in self.access_tokens:
            return None, "无效的访问令牌"
        
        token_data = self.access_tokens[access_token]
        
        # 检查是否过期
        if time.time() > token_data['expires_at']:
            del self.access_tokens[access_token]
            return None, "访问令牌已过期"
        
        return token_data, "令牌有效"

# 测试OAuth 2.0流程
print("🔐 OAuth 2.0 授权流程演示\n")

oauth_server = OAuth2Server()

# 第一步：授权请求
print("=" * 60)
print("第一步：用户授权")
print("=" * 60)

client_id = 'client_123'
redirect_uri = 'http://localhost:8000/callback'
scope = 'read write'
state = secrets.token_urlsafe(16)  # 防CSRF

callback_url, message = oauth_server.authorize(
    client_id, redirect_uri, scope, state
)

print(f"授权URL: {callback_url[:80]}...")
print(f"状态: {message}\n")

# 解析授权码
parsed = parse_qs(callback_url.split('?')[1])
auth_code = parsed['code'][0]
returned_state = parsed['state'][0]

print(f"授权码: {auth_code[:20]}...")
print(f"State: {returned_state[:20]}...")

# 第二步：获取令牌
print("\n" + "=" * 60)
print("第二步：交换访问令牌")
print("=" * 60)

token_response, message = oauth_server.token(
    grant_type='authorization_code',
    code=auth_code,
    redirect_uri=redirect_uri,
    client_id=client_id,
    client_secret='secret_456'
)

print(f"访问令牌: {token_response['access_token'][:20]}...")
print(f"刷新令牌: {token_response['refresh_token'][:20]}...")
print(f"有效期: {token_response['expires_in']}秒")
print(f"作用域: {token_response['scope']}")

# 第三步：使用访问令牌
print("\n" + "=" * 60)
print("第三步：使用访问令牌访问资源")
print("=" * 60)

token_data, message = oauth_server.verify_token(token_response['access_token'])
print(f"验证结果: {message}")
if token_data:
    print(f"用户ID: {token_data['user_id']}")
    print(f"权限范围: {token_data['scope']}")

# 第四步：刷新令牌
print("\n" + "=" * 60)
print("第四步：刷新访问令牌")
print("=" * 60)

new_token_response, message = oauth_server.token(
    grant_type='refresh_token',
    refresh_token=token_response['refresh_token'],
    client_id=client_id,
    client_secret='secret_456'
)

print(f"新的访问令牌: {new_token_response['access_token'][:20]}...")
print(f"状态: {message}")
```

### 2.5 JWT（JSON Web Token）

**JWT**是一种紧凑、URL安全的令牌格式，用于在各方之间传递声明。

```python
import json
import base64
import hmac
import hashlib
import time

class JWTHandler:
    """JWT处理器"""
    
    def __init__(self, secret_key):
        self.secret_key = secret_key
        self.algorithm = 'HS256'
    
    def _base64url_encode(self, data):
        """Base64 URL编码"""
        if isinstance(data, str):
            data = data.encode('utf-8')
        
        encoded = base64.urlsafe_b64encode(data).decode('utf-8')
        return encoded.rstrip('=')  # 移除填充
    
    def _base64url_decode(self, data):
        """Base64 URL解码"""
        # 添加填充
        padding = 4 - (len(data) % 4)
        if padding != 4:
            data += '=' * padding
        
        return base64.urlsafe_b64decode(data)
    
    def create_token(self, payload, expires_in=3600):
        """创建JWT令牌"""
        # Header
        header = {
            'alg': self.algorithm,
            'typ': 'JWT'
        }
        
        # Payload（添加标准声明）
        now = int(time.time())
        payload.update({
            'iat': now,  # Issued At
            'exp': now + expires_in,  # Expiration Time
            'nbf': now  # Not Before
        })
        
        # 编码Header和Payload
        header_encoded = self._base64url_encode(json.dumps(header))
        payload_encoded = self._base64url_encode(json.dumps(payload))
        
        # 创建签名
        message = f"{header_encoded}.{payload_encoded}"
        signature = hmac.new(
            self.secret_key.encode(),
            message.encode(),
            hashlib.sha256
        ).digest()
        
        signature_encoded = self._base64url_encode(signature)
        
        # 组合JWT
        jwt_token = f"{message}.{signature_encoded}"
        
        return jwt_token
    
    def verify_token(self, token):
        """验证JWT令牌"""
        try:
            # 分割JWT
            parts = token.split('.')
            if len(parts) != 3:
                return None, "JWT格式无效"
            
            header_encoded, payload_encoded, signature_encoded = parts
            
            # 验证签名
            message = f"{header_encoded}.{payload_encoded}"
            expected_signature = hmac.new(
                self.secret_key.encode(),
                message.encode(),
                hashlib.sha256
            ).digest()
            
            expected_signature_encoded = self._base64url_encode(expected_signature)
            
            if not hmac.compare_digest(signature_encoded, expected_signature_encoded):
                return None, "签名验证失败"
            
            # 解码Payload
            payload_json = self._base64url_decode(payload_encoded)
            payload = json.loads(payload_json)
            
            # 检查过期时间
            now = int(time.time())
            
            if 'exp' in payload and now > payload['exp']:
                return None, "令牌已过期"
            
            if 'nbf' in payload and now < payload['nbf']:
                return None, "令牌尚未生效"
            
            return payload, "令牌有效"
        
        except Exception as e:
            return None, f"令牌验证错误: {str(e)}"
    
    def decode_without_verify(self, token):
        """解码JWT（不验证签名）- 仅用于调试"""
        parts = token.split('.')
        if len(parts) != 3:
            return None
        
        header_encoded, payload_encoded, _ = parts
        
        header = json.loads(self._base64url_decode(header_encoded))
        payload = json.loads(self._base64url_decode(payload_encoded))
        
        return {'header': header, 'payload': payload}

# 测试JWT
print("🎫 JWT演示\n")

jwt_handler = JWTHandler('super_secret_key_123')

# 创建令牌
print("=" * 60)
print("创建JWT令牌")
print("=" * 60)

payload = {
    'user_id': '12345',
    'username': 'alice',
    'role': 'admin',
    'email': 'alice@example.com'
}

token = jwt_handler.create_token(payload, expires_in=3600)
print(f"JWT令牌:\n{token}\n")

# 解码令牌（不验证）
decoded = jwt_handler.decode_without_verify(token)
print("解码结果:")
print(f"Header: {json.dumps(decoded['header'], indent=2)}")
print(f"Payload: {json.dumps(decoded['payload'], indent=2)}")

# 验证令牌
print("\n" + "=" * 60)
print("验证JWT令牌")
print("=" * 60)

verified_payload, message = jwt_handler.verify_token(token)
print(f"验证结果: {message}")
if verified_payload:
    print(f"用户: {verified_payload['username']}")
    print(f"角色: {verified_payload['role']}")
    print(f"颁发时间: {time.ctime(verified_payload['iat'])}")
    print(f"过期时间: {time.ctime(verified_payload['exp'])}")

# 测试篡改令牌
print("\n" + "=" * 60)
print("测试篡改令牌")
print("=" * 60)

tampered_token = token[:-10] + "TAMPERED!!"
verified_payload, message = jwt_handler.verify_token(tampered_token)
print(f"验证结果: {message}")

# JWT vs Session对比
print("\n" + "=" * 60)
print("📊 JWT vs Session 对比")
print("=" * 60)
print("""
JWT优点：
  • 无状态（不需要服务器存储）
  • 可扩展性好（微服务架构）
  • 支持跨域
  • 移动端友好

JWT缺点：
  • 无法主动撤销
  • 令牌体积较大
  • 安全风险（XSS攻击可窃取）

Session优点：
  • 可以主动撤销
  • 服务器完全控制
  • 相对安全

Session缺点：
  • 需要服务器存储
  • 扩展性差
  • 跨域复杂
""")
```

### 2.6 文件上传安全

```python
import os
import mimetypes
import hashlib
from pathlib import Path

class SecureFileUpload:
    """安全的文件上传处理"""
    
    def __init__(self, upload_dir='uploads'):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(exist_ok=True)
        
        # 允许的文件类型
        self.allowed_extensions = {
            '.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt', '.doc', '.docx'
        }
        
        # 允许的MIME类型
        self.allowed_mimetypes = {
            'image/jpeg', 'image/png', 'image/gif',
            'application/pdf', 'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
        
        # 最大文件大小（10MB）
        self.max_file_size = 10 * 1024 * 1024
    
    def validate_filename(self, filename):
        """验证文件名"""
        # 检查空文件名
        if not filename:
            return False, "文件名为空"
        
        # 检查路径遍历攻击
        if '..' in filename or '/' in filename or '\\' in filename:
            return False, "文件名包含非法字符"
        
        # 检查扩展名
        ext = Path(filename).suffix.lower()
        if ext not in self.allowed_extensions:
            return False, f"不允许的文件类型: {ext}"
        
        # 检查文件名长度
        if len(filename) > 255:
            return False, "文件名过长"
        
        return True, "文件名有效"
    
    def validate_content(self, file_content, declared_mimetype):
        """验证文件内容"""
        # 检查文件大小
        if len(file_content) > self.max_file_size:
            return False, f"文件过大（最大{self.max_file_size/1024/1024}MB）"
        
        # 检查文件内容不为空
        if len(file_content) == 0:
            return False, "文件内容为空"
        
        # 验证MIME类型（简化版）
        if declared_mimetype not in self.allowed_mimetypes:
            return False, f"不允许的MIME类型: {declared_mimetype}"
        
        # 检查文件头（Magic Number）
        file_signatures = {
            b'\xFF\xD8\xFF': 'image/jpeg',
            b'\x89PNG\r\n\x1a\n': 'image/png',
            b'GIF87a': 'image/gif',
            b'GIF89a': 'image/gif',
            b'%PDF': 'application/pdf'
        }
        
        for signature, mimetype in file_signatures.items():
            if file_content.startswith(signature):
                if declared_mimetype == mimetype:
                    return True, "文件内容验证通过"
                else:
                    return False, "文件类型与内容不匹配"
        
        # 对于其他文件类型，只检查MIME
        return True, "文件内容验证通过"
    
    def generate_safe_filename(self, original_filename):
        """生成安全的文件名"""
        # 获取扩展名
        ext = Path(original_filename).suffix.lower()
        
        # 使用时间戳和随机数生成唯一文件名
        import secrets
        import time
        
        timestamp = int(time.time())
        random_str = secrets.token_hex(8)
        
        safe_filename = f"{timestamp}_{random_str}{ext}"
        
        return safe_filename
    
    def save_file(self, filename, file_content, declared_mimetype):
        """安全保存文件"""
        # 验证文件名
        is_valid, message = self.validate_filename(filename)
        if not is_valid:
            return None, message
        
        # 验证文件内容
        is_valid, message = self.validate_content(file_content, declared_mimetype)
        if not is_valid:
            return None, message
        
        # 生成安全的文件名
        safe_filename = self.generate_safe_filename(filename)
        
        # 保存文件
        file_path = self.upload_dir / safe_filename
        
        try:
            with open(file_path, 'wb') as f:
                f.write(file_content)
            
            # 计算文件哈希（用于完整性验证）
            file_hash = hashlib.sha256(file_content).hexdigest()
            
            return {
                'original_filename': filename,
                'saved_filename': safe_filename,
                'file_path': str(file_path),
                'file_size': len(file_content),
                'sha256': file_hash
            }, "文件上传成功"
        
        except Exception as e:
            return None, f"文件保存失败: {str(e)}"
    
    def scan_for_malware(self, file_content):
        """恶意软件扫描（简化版）"""
        # 检查常见的恶意脚本特征
        dangerous_patterns = [
            b'<?php',
            b'<script',
            b'javascript:',
            b'eval(',
            b'exec(',
            b'system(',
            b'shell_exec(',
            b'passthru('
        ]
        
        content_lower = file_content.lower()
        
        for pattern in dangerous_patterns:
            if pattern in content_lower:
                return False, f"检测到可疑内容: {pattern.decode()}"
        
        return True, "未检测到恶意内容"

# 测试文件上传安全
print("📁 文件上传安全演示\n")

uploader = SecureFileUpload()

# 测试1：合法文件上传
print("=" * 60)
print("测试1：合法图片上传")
print("=" * 60)

# 模拟JPEG文件内容
jpeg_content = b'\xFF\xD8\xFF\xE0\x00\x10JFIF' + b'\x00' * 100

result, message = uploader.save_file(
    'vacation.jpg',
    jpeg_content,
    'image/jpeg'
)

if result:
    print(f"✅ {message}")
    print(f"原始文件名: {result['original_filename']}")
    print(f"保存文件名: {result['saved_filename']}")
    print(f"文件大小: {result['file_size']} 字节")
    print(f"SHA-256: {result['sha256'][:32]}...")
else:
    print(f"❌ {message}")

# 测试2：路径遍历攻击
print("\n" + "=" * 60)
print("测试2：路径遍历攻击")
print("=" * 60)

result, message = uploader.save_file(
    '../../../etc/passwd',
    b'malicious content',
    'text/plain'
)

print(f"{'✅' if not result else '❌'} {message}")

# 测试3：文件类型伪装
print("\n" + "=" * 60)
print("测试3：文件类型伪装")
print("=" * 60)

# 尝试上传PHP文件伪装成图片
fake_image = b'\xFF\xD8\xFF\xE0<?php system($_GET["cmd"]); ?>'

result, message = uploader.save_file(
    'shell.php.jpg',
    fake_image,
    'image/jpeg'
)

if result:
    # 进行恶意软件扫描
    is_safe, scan_message = uploader.scan_for_malware(fake_image)
    print(f"上传结果: {message}")
    print(f"恶意软件扫描: {'✅ 安全' if is_safe else '❌ ' + scan_message}")
else:
    print(f"❌ {message}")

# 安全建议
print("\n" + "=" * 60)
print("🛡️  文件上传安全最佳实践")
print("=" * 60)
print("""
1. 文件名处理：
   • 重命名上传文件
   • 过滤特殊字符
   • 防止路径遍历

2. 文件类型验证：
   • 检查文件扩展名
   • 验证MIME类型
   • 检查文件头（Magic Number）

3. 文件大小限制：
   • 设置合理的大小上限
   • 防止DOS攻击

4. 存储安全：
   • 上传目录禁止执行权限
   • 文件存储在Web根目录之外
   • 使用CDN或对象存储

5. 恶意软件扫描：
   • 集成杀毒引擎（ClamAV等）
   • 检查已知恶意特征
   • 沙箱环境分析

6. 访问控制：
   • 验证用户权限
   • 生成临时下载链接
   • 记录上传日志
""")
```

---

**本章完**
