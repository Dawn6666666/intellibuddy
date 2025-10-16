<template>
  <div class="forgot-password-page">
    <div class="forgot-password-container">
      <div class="forgot-password-card">
        <div class="card-header">
          <i class="fa-solid fa-key"></i>
          <h1>忘记密码</h1>
          <p>请输入您的邮箱地址，我们将发送重置密码的链接</p>
        </div>

        <el-form 
          v-if="!emailSent"
          :model="form" 
          :rules="rules" 
          ref="formRef"
          @submit.prevent="handleSubmit"
        >
          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              type="email"
              placeholder="请输入您的邮箱"
              size="large"
              :prefix-icon="'fa-solid fa-envelope'"
            />
          </el-form-item>

          <el-form-item>
            <el-button 
              type="primary" 
              native-type="submit" 
              :loading="isLoading"
              size="large"
              style="width: 100%"
            >
              发送重置链接
            </el-button>
          </el-form-item>
        </el-form>

        <div v-else class="success-message">
          <i class="fa-solid fa-circle-check"></i>
          <h2>邮件已发送</h2>
          <p>我们已向 <strong>{{ form.email }}</strong> 发送了一封包含密码重置链接的邮件。</p>
          <p class="tip">请检查您的收件箱（包括垃圾邮件文件夹），链接将在 1 小时后过期。</p>
          <el-button type="primary" @click="$router.push('/login')" size="large">
            返回登录
          </el-button>
        </div>

        <div class="card-footer">
          <router-link to="/login">
            <i class="fa-solid fa-arrow-left"></i> 返回登录页面
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import axios from 'axios'
import { API_BASE_URL } from '@/services/apiService'

const formRef = ref<FormInstance>()
const isLoading = ref(false)
const emailSent = ref(false)

const form = reactive({
  email: ''
})

const rules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ]
})

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      isLoading.value = true
      try {
        await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
          email: form.email
        })
        
        emailSent.value = true
        ElMessage.success('重置链接已发送到您的邮箱')
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || '发送失败，请稍后重试')
      } finally {
        isLoading.value = false
      }
    }
  })
}
</script>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.forgot-password-container {
  width: 100%;
  max-width: 480px;
}

.forgot-password-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.card-header {
  padding: 48px 40px 32px;
  text-align: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.card-header i {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 16px;
}

.card-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.card-header p {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.6;
}

.el-form {
  padding: 32px 40px;
}

.success-message {
  padding: 32px 40px;
  text-align: center;
}

.success-message i {
  font-size: 4rem;
  color: #67c23a;
  margin-bottom: 20px;
}

.success-message h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.success-message p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.success-message p.tip {
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 24px;
}

.success-message strong {
  color: #667eea;
  font-weight: 600;
}

.card-footer {
  padding: 20px 40px;
  text-align: center;
  border-top: 1px solid #eee;
  background: #f9f9f9;
}

.card-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.card-footer a:hover {
  color: #764ba2;
  gap: 12px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #ddd inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #667eea inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px #667eea inset;
}
</style>

