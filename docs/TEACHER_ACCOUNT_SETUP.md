# 👨‍🏫 教师账号设置指南

## 问题说明

您在使用 `teacher@intellibuddy.com` 登录时遇到"邮箱或密码错误"的提示。

**原因**：项目初始没有创建教师演示账号，只有3个学生账号。

## ✅ 已修复

我已经更新了代码，添加了教师演示账号。现在需要运行脚本创建账号。

---

## 🚀 解决方案

### 方式 1：运行创建脚本（推荐）

在项目根目录执行以下命令：

```bash
# 进入后端目录
cd backend

# 运行演示账号创建脚本
pnpm run demo:create
```

**脚本会创建以下账号**：

1. **学生账号**
   - `student@intellibuddy.com` / `Demo2025`
   - `advanced@intellibuddy.com` / `Demo2025`
   - `newuser@intellibuddy.com` / `Demo2025`

2. **教师账号** ✨ 新增
   - `teacher@intellibuddy.com` / `Demo2025`

### 方式 2：手动在数据库中创建

如果脚本运行失败，可以手动创建：

1. **连接到 MongoDB 数据库**

2. **在 users 集合中插入教师账号**：

```javascript
// 使用 MongoDB Compass 或命令行
db.users.insertOne({
  username: "demo_teacher",
  email: "teacher@intellibuddy.com",
  // 密码是 "Demo2025" 的 bcrypt 哈希值
  passwordHash: "$2a$10$YourHashedPasswordHere",
  role: "teacher",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo_teacher",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**注意**：需要先用 bcrypt 生成密码哈希。

### 方式 3：注册新账号后升级权限

1. **注册一个新账号**
   - 访问注册页面
   - 使用任意邮箱注册（如 `myteacher@example.com`）

2. **在数据库中修改角色**

```javascript
// 在 MongoDB 中执行
db.users.updateOne(
  { email: "myteacher@example.com" },
  { $set: { role: "teacher" } }
)
```

3. **重新登录**
   - 退出当前账号
   - 使用新账号登录
   - 现在应该可以看到教师端功能

---

## 📋 验证步骤

创建账号后，验证是否成功：

### 1. 登录测试

访问登录页面，输入：
- 📧 邮箱：`teacher@intellibuddy.com`
- 🔑 密码：`Demo2025`

### 2. 检查权限

登录成功后：
- ✅ 顶部导航栏应该显示"教师管理"菜单
- ✅ 点击进入可以看到"班级管理"和"作业管理"标签
- ✅ 可以创建班级和布置作业

### 3. 功能测试

尝试以下操作：
1. **创建班级**
   - 点击"创建班级"按钮
   - 填写班级信息
   - 获得邀请码

2. **邀请学生**
   - 使用学生账号登录
   - 在个人中心输入邀请码
   - 加入班级

3. **布置作业**
   - 点击"创建作业"
   - 选择班级
   - 添加题目
   - 发布作业

---

## 🔍 故障排查

### 问题 1：脚本运行失败

**错误**：`请在 .env 文件中配置 MONGO_URI`

**解决**：
```bash
cd backend
cp env.example .env
# 编辑 .env 文件，配置 MONGO_URI
```

### 问题 2：密码仍然错误

**可能原因**：
1. 数据库中已存在该邮箱但角色不是 teacher
2. 密码哈希不正确

**解决**：
```javascript
// 在 MongoDB 中检查
db.users.findOne({ email: "teacher@intellibuddy.com" })

// 如果存在但角色不对，更新角色
db.users.updateOne(
  { email: "teacher@intellibuddy.com" },
  { $set: { role: "teacher" } }
)

// 如果不存在，运行创建脚本
```

### 问题 3：看不到教师管理菜单

**可能原因**：用户角色不是 teacher

**解决**：
1. 检查数据库中的用户角色
2. 确保 `role` 字段为 `"teacher"`
3. 重新登录

---

## 📝 完整的演示账号列表

创建成功后，您将拥有以下演示账号：

| 账号 | 邮箱 | 密码 | 角色 | 用途 |
|------|------|------|------|------|
| demo_student | student@intellibuddy.com | Demo2025 | 学生 | 日常学习功能演示 |
| demo_advanced | advanced@intellibuddy.com | Demo2025 | 学生 | 高级功能和数据演示 |
| demo_new | newuser@intellibuddy.com | Demo2025 | 学生 | 新手引导演示 |
| demo_teacher | teacher@intellibuddy.com | Demo2025 | 教师 | 教师端功能演示 |

---

## 💡 使用建议

### 完整演示流程

1. **使用教师账号**（5分钟）
   - 登录 `teacher@intellibuddy.com`
   - 创建班级"2024级计算机科学1班"
   - 获得邀请码（如 `A1B2C3`）

2. **使用学生账号加入班级**（2分钟）
   - 登录 `student@intellibuddy.com`
   - 在个人中心输入邀请码
   - 加入班级

3. **教师布置作业**（3分钟）
   - 切换回教师账号
   - 创建作业"数据结构第一章测验"
   - 添加10道题目
   - 发布作业

4. **学生完成作业**（5分钟）
   - 切换到学生账号
   - 查看作业列表
   - 完成作业提交

5. **教师查看统计**（3分钟）
   - 切换回教师账号
   - 查看作业提交情况
   - 查看学生学习统计
   - 查看数据分析

---

## 📞 需要帮助？

如果仍然无法登录，请提供以下信息：

1. 运行 `pnpm run demo:create` 的输出日志
2. 数据库中 users 集合的截图
3. 登录时的错误提示截图

我会帮您进一步排查问题！

---

**文档版本**: v1.0  
**最后更新**: 2025-10-25  
**适用版本**: IntelliBuddy v2.0.0

