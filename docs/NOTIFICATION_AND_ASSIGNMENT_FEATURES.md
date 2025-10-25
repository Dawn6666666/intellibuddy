# 通知系统和作业编辑功能文档

## 功能概述

本次更新实现了两个主要功能：
1. **教师端作业编辑功能** - 教师可以编辑已创建的作业
2. **完整的通知系统** - 包括作业发布通知、通知中心等功能

## 一、教师端作业编辑功能

### 功能描述
- 教师可以点击作业列表中的"编辑"按钮来修改作业信息
- 支持编辑作业的所有属性：标题、描述、类型、难度、截止时间、分数等
- 编辑后的作业会立即保存到数据库

### 实现细节

#### 前端修改 (`frontend/src/views/TeacherView.vue`)
```typescript
// 新增编辑状态追踪
const editingAssignmentId = ref<string | null>(null);

// 编辑作业函数
function editAssignment(assignment: any) {
  assignmentForm.value = {
    title: assignment.title,
    classId: assignment.classId,
    description: assignment.description || '',
    type: assignment.type,
    difficulty: assignment.difficulty || 'medium',
    dueDate: assignment.dueDate ? new Date(assignment.dueDate) : null,
    totalScore: assignment.totalScore || 100,
    passingScore: assignment.passingScore || 60
  };
  editingAssignmentId.value = assignment._id;
  createAssignmentDialogVisible.value = true;
}

// 统一的保存函数（创建或更新）
async function saveAssignment() {
  if (editingAssignmentId.value) {
    // 更新作业
    await apiService.put(`/assignment/${editingAssignmentId.value}`, assignmentForm.value);
  } else {
    // 创建作业
    await apiService.post('/assignment', assignmentForm.value);
  }
}
```

#### UI 改进
- 对话框标题动态显示"创建作业"或"编辑作业"
- 按钮文字动态显示"创建"或"保存"
- 关闭对话框时自动重置编辑状态

### 使用方法
1. 进入"教师管理" → "作业管理"标签
2. 在作业列表中找到要编辑的作业
3. 点击"编辑"按钮
4. 修改作业信息
5. 点击"保存"按钮

---

## 二、通知系统

### 系统架构

```
┌─────────────────┐
│  通知数据模型    │  Notification Model
└────────┬────────┘
         │
┌────────▼────────┐
│  通知 API 路由  │  /api/notification/*
└────────┬────────┘
         │
┌────────▼────────┐
│  前端通知组件    │  NotificationPanel.vue
└────────┬────────┘
         │
┌────────▼────────┐
│  主布局集成     │  MainLayout.vue
└─────────────────┘
```

### 1. 数据模型 (`backend/src/models/Notification.ts`)

#### 通知类型
- `assignment` - 作业通知
- `grade` - 成绩通知
- `class` - 班级通知
- `system` - 系统通知
- `announcement` - 公告通知

#### 优先级
- `low` - 低优先级
- `normal` - 普通（默认）
- `high` - 高优先级
- `urgent` - 紧急

#### 数据结构
```typescript
{
  recipientId: ObjectId,        // 接收者ID
  recipientType: 'student',     // 接收者类型
  senderId: ObjectId,           // 发送者ID
  type: 'assignment',           // 通知类型
  title: '新作业发布',          // 标题
  content: '...',               // 内容
  priority: 'normal',           // 优先级
  read: false,                  // 是否已读
  readAt: Date,                 // 已读时间
  actionUrl: '/app/my-classes', // 跳转链接
  relatedId: ObjectId,          // 关联对象ID
  relatedType: 'assignment',    // 关联对象类型
  metadata: {                   // 元数据
    assignmentTitle: '...',
    className: '...',
    dueDate: Date,
    totalScore: 100
  }
}
```

### 2. API 端点 (`backend/src/routes/notification.ts`)

#### 学生/教师端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/notification/my` | 获取我的通知列表 |
| GET | `/api/notification/unread-count` | 获取未读通知数量 |
| PUT | `/api/notification/:id/read` | 标记单个通知为已读 |
| PUT | `/api/notification/mark-all-read` | 标记所有通知为已读 |
| DELETE | `/api/notification/:id` | 删除单个通知 |
| DELETE | `/api/notification/batch/read` | 批量删除已读通知 |

#### 教师/管理员端点

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/notification` | 创建通知（批量） |

#### 查询参数示例
```javascript
// 获取通知列表
GET /api/notification/my?page=1&limit=20&unreadOnly=true&type=assignment

// 响应
{
  notifications: [...],
  total: 50,
  unreadCount: 5,
  page: 1,
  limit: 20,
  totalPages: 3
}
```

### 3. 自动通知触发

#### 作业发布通知
在 `backend/src/routes/assignment.ts` 的发布作业端点中：

```typescript
router.post('/:assignmentId/publish', authMiddleware, async (req, res) => {
  // ... 发布作业逻辑 ...
  
  // 自动创建通知
  const classDoc = await Class.findById(assignment.classId);
  const activeStudents = classDoc.students
    .filter(s => s.status === 'active')
    .map(s => s.userId);

  await Notification.insertMany(
    activeStudents.map(studentId => ({
      recipientId: studentId,
      type: 'assignment',
      title: '新作业发布',
      content: `${classDoc.name} 发布了新作业：${assignment.title}`,
      // ... 其他字段
    }))
  );
});
```

**触发时机：**
- ✅ 教师发布作业时
- 🔮 未来可扩展：作业截止前提醒、成绩发布通知等

### 4. 前端通知组件

#### NotificationPanel 组件 (`frontend/src/components/NotificationPanel.vue`)

**主要功能：**
- 📋 显示通知列表（分页）
- 🔍 按类型筛选（全部、未读、作业、成绩、系统）
- ✅ 标记已读（单个/全部）
- 🗑️ 删除通知
- 🔗 点击跳转到相关页面
- 🎨 不同类型通知显示不同图标和颜色

**特性：**
- 实时显示未读数量
- 时间智能格式化（刚刚、5分钟前、2小时前等）
- 响应式设计（移动端全屏显示）
- 美观的渐变图标设计

#### MainLayout 集成 (`frontend/src/layouts/MainLayout.vue`)

**集成要点：**
```vue
<!-- 通知按钮 -->
<el-popover v-model:visible="showNotifications" placement="bottom-end">
  <template #reference>
    <button class="notification-btn">
      <i class="fa-solid fa-bell"></i>
      <span v-if="notificationCount > 0" class="notification-badge">
        {{ notificationCount > 99 ? '99+' : notificationCount }}
      </span>
    </button>
  </template>
  <NotificationPanel 
    @update-count="notificationCount = $event"
    @close="showNotifications = false"
  />
</el-popover>
```

**自动刷新：**
- 页面加载时获取未读数量
- 每30秒自动刷新未读数量
- 打开通知面板时实时刷新

### 5. 通知徽章设计

```css
.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #f56c6c;
  color: white;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 18px;
  box-shadow: 0 2px 4px rgba(245, 108, 108, 0.4);
}
```

**显示规则：**
- 0 条未读：不显示徽章
- 1-99 条：显示准确数字
- 100+ 条：显示 "99+"

---

## 使用场景

### 场景 1：教师发布作业
1. 教师创建并发布作业
2. 系统自动向班级所有学生发送通知
3. 学生登录后看到通知徽章显示未读数量
4. 学生点击通知铃铛查看详情
5. 点击通知跳转到"我的班级"页面查看作业

### 场景 2：学生查看通知
1. 学生登录系统
2. 顶部导航栏通知按钮显示红色徽章（未读数量）
3. 点击通知按钮打开通知面板
4. 可以按类型筛选（全部/未读/作业/成绩/系统）
5. 点击通知查看详情并跳转到相关页面
6. 可以标记已读或删除通知

### 场景 3：教师编辑作业
1. 教师进入"教师管理" → "作业管理"
2. 找到需要修改的作业
3. 点击"编辑"按钮
4. 修改作业信息（标题、描述、截止时间等）
5. 点击"保存"按钮更新作业

---

## 技术特点

### 性能优化
1. **数据库索引**
   - `recipientId + read + createdAt` 复合索引
   - `recipientId + type + createdAt` 复合索引
   - 支持高效的未读通知查询和分类查询

2. **批量操作**
   - 批量创建通知（insertMany）
   - 批量标记已读
   - 批量删除已读通知

3. **前端优化**
   - 分页加载（默认20条/页）
   - 轻量级组件（使用 Popover 而非全屏弹窗）
   - 智能刷新（仅在需要时刷新）

### 用户体验
1. **实时反馈**
   - 操作后立即更新 UI
   - 未读数量实时同步
   - 流畅的动画过渡

2. **视觉设计**
   - 不同类型通知使用不同渐变色图标
   - 未读通知高亮显示（浅蓝色背景）
   - 醒目的红色徽章提示

3. **智能时间显示**
   - 1分钟内：显示"刚刚"
   - 1小时内：显示"X分钟前"
   - 24小时内：显示"X小时前"
   - 7天内：显示"X天前"
   - 更早：显示完整日期

### 扩展性
通知系统设计灵活，易于扩展新的通知类型：

```typescript
// 添加新通知类型示例
await Notification.create({
  recipientId: studentId,
  type: 'grade',  // 新类型：成绩通知
  title: '作业已批改',
  content: `您的作业《${assignmentTitle}》已批改，得分：${score}分`,
  priority: 'normal',
  relatedId: submissionId,
  relatedType: 'submission',
  actionUrl: `/app/my-classes`,
  metadata: {
    score: score,
    totalScore: totalScore,
    assignmentTitle: assignmentTitle
  }
});
```

---

## 测试建议

### 功能测试清单

#### 作业编辑功能
- [ ] 创建新作业
- [ ] 编辑已有作业
- [ ] 验证所有字段都能正确编辑
- [ ] 取消编辑不保存更改
- [ ] 编辑草稿状态作业
- [ ] 编辑已发布作业

#### 通知系统
- [ ] 教师发布作业时自动创建通知
- [ ] 学生能收到通知
- [ ] 未读徽章正确显示
- [ ] 点击通知跳转正确
- [ ] 标记单个通知为已读
- [ ] 标记所有通知为已读
- [ ] 删除单个通知
- [ ] 按类型筛选通知
- [ ] 分页功能正常
- [ ] 时间格式化正确

### 性能测试
- [ ] 100+ 通知时的加载速度
- [ ] 批量标记已读的响应时间
- [ ] 自动刷新对性能的影响

---

## 后续优化建议

1. **功能增强**
   - ✨ 添加通知声音提示
   - ✨ 添加浏览器桌面通知（Web Push）
   - ✨ 支持通知分组（按班级、按日期）
   - ✨ 添加通知搜索功能
   - ✨ 支持通知优先级排序

2. **新通知类型**
   - 📝 作业截止前提醒（24小时、1小时）
   - 📊 成绩发布通知
   - 💬 评论回复通知
   - 🎉 成就解锁通知
   - 📢 系统公告通知

3. **性能优化**
   - 🚀 WebSocket 实时推送（替代轮询）
   - 💾 前端通知缓存
   - 🔄 增量加载（无限滚动）

4. **用户体验**
   - 📱 移动端底部导航显示通知徽章
   - 🌙 暗黑模式适配
   - ♿ 无障碍访问支持
   - 🌍 多语言支持

---

## 文件清单

### 新增文件
- `backend/src/models/Notification.ts` - 通知数据模型
- `backend/src/routes/notification.ts` - 通知API路由
- `frontend/src/components/NotificationPanel.vue` - 通知面板组件

### 修改文件
- `backend/src/index.ts` - 注册通知路由
- `backend/src/routes/assignment.ts` - 添加发布通知逻辑
- `frontend/src/layouts/MainLayout.vue` - 集成通知按钮和面板
- `frontend/src/views/TeacherView.vue` - 添加作业编辑功能

---

## 总结

本次更新实现了完整的通知系统和作业编辑功能，为智学伴平台增加了重要的互动功能。通知系统采用模块化设计，易于扩展和维护，为未来的功能增强打下了坚实的基础。

**核心价值：**
- ✅ 提升师生互动效率
- ✅ 及时传达重要信息
- ✅ 改善用户体验
- ✅ 增强平台粘性

