<template>
  <div class="reset-password-page">
    <div class="reset-password-container">
      <div class="reset-password-card">
        <div class="card-header">
          <i class="fa-solid fa-lock-open"></i>
          <h1>重置密码</h1>
          <p>请输入您的新密码</p>
        </div>

        <el-form 
          v-if="!resetSuccess"
          :model="form" 
          :rules="rules" 
          ref="formRef"
          @submit.prevent="handleSubmit"
        >
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入新密码"
              size="large"
              show-password
              :prefix-icon="'fa-solid fa-lock'"
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请确认新密码"
              size="large"
              show-password
              :prefix-icon="'fa-solid fa-lock'"
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
              重置密码
            </el-button>
          </el-form-item>
        </el-form>

        <div v-else class="success-message">
          <i class="fa-solid fa-circle-check"></i>
          <h2>密码重置成功</h2>
          <p>您的密码已成功重置，现在可以使用新密码登录了。</p>
          <el-button type="primary" @click="$router.push('/login')" size="large">
            前往登录
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import axios from 'axios'
import { API_BASE_URL } from '@/services/apiService'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const isLoading = ref(false)
const resetSuccess = ref(false)
const token = ref('')

const form = reactive({
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (_rule: any, value: any, callback: any) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
})

onMounted(() => {
  token.value = route.query.token as string
  
  if (!token.value) {
    ElMessage.error('无效的重置链接')
    router.push('/login')
  }
})

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      isLoading.value = true
      try {
        await axios.post(`${API_BASE_URL}/auth/reset-password`, {
          token: token.value,
          newPassword: form.password
        })
        
        resetSuccess.value = true
        ElMessage.success('密码重置成功')
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || '重置失败，请稍后重试')
      } finally {
        isLoading.value = false
      }
    }
  })
}
</script>

<style scoped>
.reset-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.reset-password-container {
  width: 100%;
  max-width: 480px;
}

.reset-password-card {
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
  margin: 0 0 24px 0;
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

