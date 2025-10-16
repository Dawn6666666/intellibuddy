<template>
  <div class="account-view">
    <div class="page-header">
      <h1><i class="fa-solid fa-user-circle"></i> 个人中心</h1>
      <p>管理您的个人信息和账户设置</p>
    </div>

    <div class="account-content">
      <!-- 头像和基本信息卡片 -->
      <div class="card profile-card">
        <div class="card-header">
          <h2><i class="fa-solid fa-id-card"></i> 个人资料</h2>
        </div>
        <div class="card-body">
          <div class="avatar-section">
            <div class="avatar-preview">
              <img v-if="avatarPreview || userStore.user?.avatarUrl" 
                   :src="avatarPreview || getAvatarUrl()" 
                   alt="头像" />
              <div v-else class="avatar-placeholder">
                <i class="fa-solid fa-user"></i>
              </div>
            </div>
            <div class="avatar-actions">
              <el-upload
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleAvatarChange"
                accept="image/jpeg,image/png,image/gif,image/webp"
              >
                <el-button type="primary" plain>
                  <i class="fa-solid fa-upload"></i> 更换头像
                </el-button>
              </el-upload>
              <p class="tip">支持 JPG、PNG、GIF、WebP 格式，大小不超过 2MB</p>
            </div>
          </div>

          <el-divider />

          <el-form :model="profileForm" :rules="profileRules" ref="profileFormRef" label-width="100px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="profileForm.username" placeholder="请输入用户名" />
            </el-form-item>
            
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="profileForm.email" type="email" placeholder="请输入邮箱" disabled />
              <p class="field-tip">邮箱不可修改</p>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSaveProfile" :loading="isSaving">
                <i class="fa-solid fa-save"></i> 保存修改
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 密码修改卡片 -->
      <div class="card password-card">
        <div class="card-header">
          <h2><i class="fa-solid fa-lock"></i> 修改密码</h2>
        </div>
        <div class="card-body">
          <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
            <el-form-item label="当前密码" prop="currentPassword">
              <el-input 
                v-model="passwordForm.currentPassword" 
                type="password" 
                placeholder="请输入当前密码"
                show-password 
              />
            </el-form-item>
            
            <el-form-item label="新密码" prop="newPassword">
              <el-input 
                v-model="passwordForm.newPassword" 
                type="password" 
                placeholder="请输入新密码"
                show-password 
              />
            </el-form-item>
            
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input 
                v-model="passwordForm.confirmPassword" 
                type="password" 
                placeholder="请再次输入新密码"
                show-password 
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleChangePassword" :loading="isChangingPassword">
                <i class="fa-solid fa-key"></i> 修改密码
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 账户信息卡片 -->
      <div class="card info-card">
        <div class="card-header">
          <h2><i class="fa-solid fa-info-circle"></i> 账户信息</h2>
        </div>
        <div class="card-body">
          <div class="info-item">
            <span class="label">账户 ID</span>
            <span class="value">{{ userStore.user?._id }}</span>
          </div>
          <div class="info-item">
            <span class="label">注册方式</span>
            <span class="value">
              <el-tag v-if="userStore.user?.avatarUrl?.includes('github')" type="info">
                <i class="fa-brands fa-github"></i> GitHub
              </el-tag>
              <el-tag v-else type="success">
                <i class="fa-solid fa-envelope"></i> 邮箱注册
              </el-tag>
            </span>
          </div>
          <div class="info-item">
            <span class="label">注册时间</span>
            <span class="value">{{ formatDate((userStore.user as any)?.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules, type UploadFile } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { upload, put } from '@/utils/request'

const userStore = useUserStore()
const profileFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const isSaving = ref(false)
const isChangingPassword = ref(false)
const avatarPreview = ref('')

const profileForm = reactive({
  username: '',
  email: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (_rule: any, value: any, callback: any) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const profileRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ]
})

const passwordRules = reactive<FormRules>({
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
})

onMounted(() => {
  if (userStore.user) {
    profileForm.username = userStore.user.username
    profileForm.email = userStore.user.email
  }
})

const handleAvatarChange = async (file: UploadFile) => {
  if (!file.raw) return
  
  // 检查文件大小
  if (file.raw.size > 2 * 1024 * 1024) {
    ElMessage.error('头像大小不能超过 2MB')
    return
  }
  
  // 预览
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file.raw)
  
  // 上传
  const formData = new FormData()
  formData.append('avatar', file.raw)
  
  try {
    isSaving.value = true
    const response = await upload(`/users/avatar`, formData) as { avatarUrl: string }
    
    if (userStore.user) {
      userStore.user.avatarUrl = response.avatarUrl
    }
    
    ElMessage.success('头像上传成功')
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || error.message || '头像上传失败')
    avatarPreview.value = ''
  } finally {
    isSaving.value = false
  }
}

const handleSaveProfile = async () => {
  if (!profileFormRef.value) return
  
  await profileFormRef.value.validate(async (valid) => {
    if (valid) {
      isSaving.value = true
      try {
        const response = await put('/users/profile', { username: profileForm.username }) as { user: { username: string } }
        
        if (userStore.user) {
          userStore.user.username = response.user.username
        }
        
        ElMessage.success('个人资料更新成功')
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || error.message || '更新失败')
      } finally {
        isSaving.value = false
      }
    }
  })
}

const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      isChangingPassword.value = true
      try {
        await put('/users/password', {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
        
        ElMessage.success('密码修改成功')
        passwordForm.currentPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
        passwordFormRef.value?.resetFields()
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || error.message || '密码修改失败')
      } finally {
        isChangingPassword.value = false
      }
    }
  })
}

const getAvatarUrl = () => {
  if (!userStore.user?.avatarUrl) return ''
  
  // 如果是外部链接（GitHub 等），直接返回
  if (userStore.user.avatarUrl.startsWith('http://') || 
      userStore.user.avatarUrl.startsWith('https://')) {
    return userStore.user.avatarUrl
  }
  
  // 如果是本地上传的，添加服务器基础 URL（不带 /api 前缀）
  // 在开发环境中，Vite 会代理 /uploads 到后端服务器
  return userStore.user.avatarUrl
}

const formatDate = (date: any) => {
  if (!date) return '未知'
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.account-view {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.account-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--card-border);
  background: linear-gradient(135deg, rgba(138, 127, 251, 0.05) 0%, rgba(94, 129, 244, 0.05) 100%);
}

.card-header h2 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.card-body {
  padding: 24px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 20px 0;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--primary-color);
  box-shadow: 0 4px 12px rgba(138, 127, 251, 0.3);
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-color) 0%, #5e81f4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-placeholder i {
  font-size: 3rem;
  color: white;
}

.avatar-actions {
  flex: 1;
}

.avatar-actions .tip {
  margin-top: 12px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.field-tip {
  margin-top: 4px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--card-border);
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  font-weight: 500;
  color: var(--text-secondary);
}

.info-item .value {
  color: var(--text-primary);
  font-weight: 500;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-input) {
  width: 100%;
}

:deep(.el-button) {
  padding: 10px 24px;
}
</style>

