# 题目管理功能认证修复

## 问题描述

教师端题目管理功能（题库管理、创建题目、作业管理等）无法正常工作，API请求失败，显示"教师假日未发现"（实际是"无效的Token"）错误。

## 问题原因

前端代码中使用了两种方式调用API：

1. **封装的API函数**：每个函数手动传递token并添加到请求头
   ```typescript
   await apiClient.get('/api/xxx', {
       headers: {'Authorization': `Bearer ${token}`}
   });
   ```

2. **直接使用apiClient**：某些组件（如 `QuestionBank.vue`、`TeacherView.vue`）直接使用 `apiService.client` 发送请求
   ```typescript
   await apiService.client.get('/question/my');
   ```

问题在于，`apiClient` 没有配置请求拦截器来自动添加认证token，导致直接调用时请求没有携带身份认证信息。

## 解决方案

在 `frontend/src/services/apiService.ts` 中添加了请求拦截器，自动从 `localStorage` 获取token并添加到所有请求的头部：

```typescript
// 添加请求拦截器，自动添加认证token
apiClient.interceptors.request.use(
    config => {
        // 从localStorage获取token
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
```

## 修复范围

这个修复解决了以下功能的认证问题：

1. **题库管理**
   - 创建题目
   - 编辑题目
   - 删除题目
   - 查看题目列表
   - 搜索和筛选题目

2. **作业管理**
   - 创建作业
   - 编辑作业
   - 删除作业
   - 布置作业给班级
   - 查看作业列表

3. **班级管理**
   - 创建班级
   - 编辑班级
   - 删除班级
   - 管理学生

4. **其他教师功能**
   - 查看学生作业提交
   - 批改作业
   - 查看统计数据

## 测试建议

1. 登录教师账号
2. 访问"教师中心"页面
3. 测试以下操作：
   - 切换到"题库管理"标签，创建新题目
   - 切换到"作业管理"标签，创建新作业
   - 切换到"班级管理"标签，查看班级列表
   - 查看作业提交和批改功能

## 相关文件

- `frontend/src/services/apiService.ts` - 添加了请求拦截器
- `frontend/src/components/QuestionBank.vue` - 题库管理组件
- `frontend/src/views/TeacherView.vue` - 教师中心主页面
- `frontend/src/components/AssignmentManager.vue` - 作业管理组件

## 注意事项

- 确保后端服务运行在 `http://localhost:5001` 端口
- 确保前端开发服务器配置了正确的代理设置（已在 `vite.config.ts` 中配置）
- Token存储在 `localStorage` 的 `authToken` 键中
- Token在登录时设置，登出时清除

