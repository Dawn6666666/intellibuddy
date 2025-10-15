# 计算机网络 - (六)HTTP协议深入

深入研究HTTP协议。

---


### 6.1 HTTP请求方法

| 方法 | 说明 | 幂等性 | 安全性 |
|------|------|--------|--------|
| GET | 获取资源 | ✅ | ✅ |
| POST | 提交数据 | ❌ | ❌ |
| PUT | 更新资源 | ✅ | ❌ |
| DELETE | 删除资源 | ✅ | ❌ |
| HEAD | 获取头部 | ✅ | ✅ |
| OPTIONS | 查询支持的方法 | ✅ | ✅ |
| PATCH | 部分更新 | ❌ | ❌ |

### 6.2 HTTP状态码

```python
HTTP_STATUS_CODES = {
    # 1xx：信息响应
    100: "Continue",
    101: "Switching Protocols",
    
    # 2xx：成功
    200: "OK",
    201: "Created",
    204: "No Content",
    
    # 3xx：重定向
    301: "Moved Permanently",  # 永久重定向
    302: "Found",              # 临时重定向
    304: "Not Modified",       # 缓存有效
    
    # 4xx：客户端错误
    400: "Bad Request",
    401: "Unauthorized",       # 未认证
    403: "Forbidden",          # 已认证但无权限
    404: "Not Found",
    405: "Method Not Allowed",
    
    # 5xx：服务器错误
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
}
```

### 6.3 HTTP缓存机制

**缓存策略：**

1. **强缓存（直接使用缓存，不发请求）**
   - `Expires: Thu, 01 Jan 2025 00:00:00 GMT`
   - `Cache-Control: max-age=3600`

2. **协商缓存（发请求验证）**
   - `Last-Modified / If-Modified-Since`
   - `ETag / If-None-Match`

```python

def http_cache_headers():
    return {
        # 强缓存
        'Cache-Control': 'public, max-age=86400',  # 缓存1天
        
        # 协商缓存
        'ETag': '"abc123"',
        'Last-Modified': 'Mon, 01 Jan 2024 00:00:00 GMT',
    }
```

### 6.4 Cookie与Session

```python
import uuid
from datetime import datetime, timedelta

class SessionManager:
    """
    Session管理器
    """
    def __init__(self):
        self.sessions = {}  # session_id → data
    
    def create_session(self, user_id):
        """创建session"""
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            'user_id': user_id,
            'created_at': datetime.now(),
            'data': {}
        }
        return session_id
    
    def get_session(self, session_id):
        """获取session"""
        return self.sessions.get(session_id)
    
    def delete_session(self, session_id):
        """删除session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
    
    def set_cookie_header(self, session_id, expires_days=7):
        """生成Set-Cookie头"""
        expires = datetime.now() + timedelta(days=expires_days)
        return f"session_id={session_id}; Expires={expires.strftime('%a, %d %b %Y %H:%M:%S GMT')}; HttpOnly; Secure"

# 使用示例
sm = SessionManager()
sid = sm.create_session(user_id=123)
print(sm.set_cookie_header(sid))
```

---

**本章完**
