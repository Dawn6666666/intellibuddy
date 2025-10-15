# 计算机网络 - (十一)Wireshark抓包分析

学习抓包分析技术。

---


### 11.1 常用过滤器

```bash
# 协议过滤
http
tcp
udp
dns
icmp

# IP过滤
ip.addr == 192.168.1.1
ip.src == 192.168.1.1
ip.dst == 192.168.1.100

# 端口过滤
tcp.port == 80
tcp.srcport == 8080
tcp.dstport == 443

# HTTP过滤
http.request.method == "GET"
http.request.uri contains "login"
http.response.code == 200

# 组合过滤
ip.src == 192.168.1.1 && tcp.port == 80
tcp.flags.syn == 1 && tcp.flags.ack == 0  # SYN包
```

### 11.2 TCP三次握手抓包

```plain
抓包结果：

1. [SYN] 客户端 → 服务器
   - Flags: 0x002 (SYN)
   - Seq: 0
   - Window: 65535

2. [SYN, ACK] 服务器 → 客户端
   - Flags: 0x012 (SYN, ACK)
   - Seq: 0
   - Ack: 1

3. [ACK] 客户端 → 服务器
   - Flags: 0x010 (ACK)
   - Seq: 1
   - Ack: 1

连接建立完成！
```

### 11.3 HTTP请求分析

```plain
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html
Accept-Language: zh-CN,zh;q=0.9
Accept-Encoding: gzip, deflate
Connection: keep-alive

关键信息：
- 请求方法: GET
- 请求路径: /index.html
- 协议版本: HTTP/1.1
- Host头: www.example.com
- 连接保持: keep-alive
```

---

## 📚 学习建议

### 实践项目

1. **Wireshark抓包分析**
   - 分析TCP三次握手/四次挥手
   - HTTP/HTTPS请求响应
   - DNS查询过程
   - ARP协议工作

2. **实现HTTP服务器**
   - 支持静态文件服务
   - 处理GET/POST请求
   - 实现Keep-Alive
   - 多线程处理

3. **网络爬虫**
   - requests库使用
   - 处理Cookie和Session
   - 反爬虫策略
   - 并发爬取

4. **聊天室应用**
   - WebSocket实时通信
   - 用户认证
   - 消息广播
   - 历史记录存储

### 推荐资源

📖 **经典教材：**
- 《计算机网络：自顶向下方法》（第8版）- 理论清晰
- 《TCP/IP详解 卷1：协议》- 深入协议
- 《HTTP权威指南》- HTTP详解
- 《图解TCP/IP》- 入门友好

💻 **在线课程：**
- **Stanford CS144**（Computer Network）
- **清华大学《计算机网络原理》**
- Coursera《计算机网络》

🎥 **视频资源：**
- B站《计算机网络微课堂》
- YouTube Computerphile频道

### 学习路线

**第1阶段：基础概念（2周）**
- ✅ OSI七层模型
- ✅ TCP/IP协议栈
- ✅ 数据封装与解封装

**第2阶段：应用层（2周）**
- ✅ HTTP/HTTPS
- ✅ DNS
- ✅ FTP/SMTP

**第3阶段：传输层（3周）**
- ✅ TCP协议详解
- ✅ UDP协议
- ✅ 拥塞控制

**第4阶段：网络层（3周）**
- ✅ IP协议
- ✅ 路由算法
- ✅ NAT/DHCP

**第5阶段：链路层（2周）**
- ✅ 以太网
- ✅ ARP协议
- ✅ WiFi

### 面试高频题

**基础概念**
1. OSI七层模型和TCP/IP四层模型的区别？
2. 从输入URL到页面展示发生了什么？
3. HTTP和HTTPS的区别？

**TCP协议**
1. TCP三次握手和四次挥手的过程？
2. 为什么需要三次握手？两次不行吗？
3. TIME_WAIT状态的作用？
4. TCP如何保证可靠传输？
5. TCP拥塞控制算法有哪些？

**HTTP协议**
1. HTTP/1.0、HTTP/1.1、HTTP/2的区别？
2. GET和POST的区别？
3. Cookie和Session的区别？
4. HTTP缓存机制？

**网络层**
1. IP地址分类和子网划分？
2. ARP协议的工作原理？
3. NAT的作用和原理？
4. 路由算法有哪些？

### 实用工具

**抓包分析**
- **Wireshark** - 图形化抓包工具
- **tcpdump** - 命令行抓包
- **Fiddler** - HTTP调试代理

**网络测试**
- `ping` - 测试连通性（ICMP）
- `traceroute/tracert` - 路由跟踪
- `netstat` - 网络状态查看
- `nslookup/dig` - DNS查询
- `curl/wget` - HTTP请求

**开发工具**
- **Postman** - API测试
- **Chrome DevTools** - 浏览器调试
- **ngrok** - 内网穿透

### 常见错误

❌ **错误1**：混淆TCP和UDP

- ✅ TCP：可靠、面向连接、有序
- ✅ UDP：不可靠、无连接、高效

❌ **错误2**：不理解三次握手

- ✅ 第一次：确认客户端发送能力
- ✅ 第二次：确认服务器收发能力
- ✅ 第三次：确认客户端接收能力

❌ **错误3**：忽略HTTP缓存

- ✅ 合理使用缓存提升性能
- ✅ 理解强缓存和协商缓存

❌ **错误4**：不会抓包分析

- ✅ 学会使用Wireshark
- ✅ 掌握过滤器语法
- ✅ 分析实际网络问题

### 最佳实践

**性能优化**
- 使用HTTP/2多路复用
- 启用GZIP压缩
- 合理设置缓存
- 减少DNS查询
- 使用CDN加速

**安全性**
- 使用HTTPS加密
- 防止XSS/CSRF攻击
- 限制请求频率
- 验证用户输入

**可靠性**
- 实现超时重试
- 心跳检测
- 负载均衡
- 故障转移

---

> **记住**：网络是连接世界的桥梁！理解网络原理是每个程序员的必修课！🌐
> 
> **学习心得**：
> - 理论与实践结合
> - 多抓包分析真实流量
> - 动手实现协议
> - 关注实际应用场景

---

**本章完**
