# MongoDB 连接问题解决方案

## 问题描述
无法连接到 MongoDB Atlas，错误信息：`querySrv ESERVFAIL _mongodb._tcp.cluster0.sdozvrv.mongodb.net`

## 诊断结果
这是一个 DNS 解析失败问题，通常由以下原因造成：
- 网络连接问题
- 防火墙/代理限制
- DNS 服务器配置问题
- MongoDB Atlas 配置问题

---

## 解决方案

### 方案 1：检查 MongoDB Atlas 配置（推荐）

#### 步骤 1：登录 MongoDB Atlas
访问：https://cloud.mongodb.com/

#### 步骤 2：检查集群状态
确保您的集群处于运行状态（不是暂停或已删除）

#### 步骤 3：配置 IP 白名单
1. 进入您的集群 → Security → Network Access
2. 点击 "Add IP Address"
3. 选择 "Allow Access from Anywhere"（添加 `0.0.0.0/0`）
4. 保存并等待几分钟生效

#### 步骤 4：获取正确的连接字符串
1. 进入集群 → Database → Connect
2. 选择 "Connect your application"
3. 复制连接字符串
4. 更新 `backend/.env` 文件中的 `MONGO_URI`

**连接字符串格式：**
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>?retryWrites=true&w=majority
```

**重要提示：**
- 将 `<username>` 替换为数据库用户名
- 将 `<password>` 替换为数据库密码（确保特殊字符已 URL 编码）
- 将 `<database>` 替换为数据库名称（如 `intellibuddy`）

---

### 方案 2：使用标准 MongoDB URI 格式

如果 SRV 格式持续失败，尝试使用标准格式：

1. 在 MongoDB Atlas 获取节点地址：
   - 集群 → Connect → Connect your application
   - 选择 "Standard Connection String"

2. 更新 `.env` 文件：
```env
MONGO_URI=mongodb://cluster0-shard-00-00.xxxxx.mongodb.net:27017,cluster0-shard-00-01.xxxxx.mongodb.net:27017,cluster0-shard-00-02.xxxxx.mongodb.net:27017/<database>?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority
```

---

### 方案 3：使用免费的 MongoDB 在线服务（临时方案）

如果 Atlas 持续有问题，可以尝试其他免费 MongoDB 服务：

#### MongoDB Atlas 替代品：
1. **MongoDB Cloud (另一个区域)**
   - 尝试创建新集群，选择不同的地区（如新加坡或日本）

2. **MongoDB Community Server (本地)**
   - 下载：https://www.mongodb.com/try/download/community
   - 安装后使用本地连接：
   ```env
   MONGO_URI=mongodb://localhost:27017/intellibuddy
   ```

---

### 方案 4：检查网络和 DNS

#### Windows DNS 刷新：
```powershell
# 刷新 DNS 缓存
ipconfig /flushdns

# 重置 Winsock
netsh winsock reset

# 重启电脑后再试
```

#### 更换 DNS 服务器：
1. 控制面板 → 网络和共享中心 → 更改适配器设置
2. 右键网络连接 → 属性 → IPv4 → 属性
3. 使用以下 DNS 服务器：
   - 首选：`8.8.8.8`（Google DNS）
   - 备用：`1.1.1.1`（Cloudflare DNS）

---

### 方案 5：配置代理（如果在受限网络环境）

如果您在需要代理的环境中：

1. 安装 Node.js 代理包：
```bash
cd backend
pnpm add https-proxy-agent
```

2. 修改 `backend/src/index.ts`，在 mongoose.connect 之前添加：
```typescript
import { HttpsProxyAgent } from 'https-proxy-agent';

// 如果需要代理
const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
if (proxyUrl) {
    const agent = new HttpsProxyAgent(proxyUrl);
    mongoose.set('proxy', agent);
}
```

3. 在 `.env` 中添加代理配置：
```env
HTTP_PROXY=http://your-proxy:port
HTTPS_PROXY=http://your-proxy:port
```

---

## 快速检查清单

- [ ] MongoDB Atlas 集群正在运行
- [ ] IP 白名单已配置（0.0.0.0/0）
- [ ] 数据库用户已创建且有读写权限
- [ ] 连接字符串中的密码已正确 URL 编码
- [ ] 网络可以访问 MongoDB Atlas（无防火墙阻拦）
- [ ] DNS 服务器工作正常
- [ ] .env 文件中的 MONGO_URI 配置正确

---

## 测试连接

修改配置后，重启开发服务器：

```powershell
# 停止当前服务器（Ctrl+C）
# 然后重新启动
pnpm dev
```

如果看到 `✓ 成功连接到 MongoDB`，说明连接成功！

---

## 仍然无法连接？

如果尝试了所有方案仍无法连接，请提供以下信息以便进一步诊断：

1. 完整的错误日志
2. MongoDB Atlas 集群所在区域
3. 您的网络环境（公司网络/家庭网络/校园网等）
4. 是否使用了 VPN 或代理

---

## 联系支持

- MongoDB Atlas 支持：https://www.mongodb.com/cloud/atlas/support
- 项目 Issue：提交到项目的 GitHub Issues

