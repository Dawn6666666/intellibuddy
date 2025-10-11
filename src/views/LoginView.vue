<script setup lang="ts">
import {ref, reactive} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useRouter} from 'vue-router'
import {useUserStore} from '@/stores/user'
// 导入动态的基础 URL
import {API_BASE_URL} from '@/services/apiService';

const router = useRouter()
const userStore = useUserStore()
const isLoading = ref(false)
const isRegisterActive = ref(false)

// 表单引用和数据
const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()

const loginForm = reactive({email: '', password: ''})
const registerForm = reactive({username: '', email: '', password: ''})

// 表单验证规则
const loginRules = reactive<FormRules>({
  email: [{required: true, message: '请输入邮箱'}, {type: 'email', message: '邮箱格式不正确'}],
  password: [{required: true, message: '请输入密码'}]
})
const registerRules = reactive<FormRules>({
  username: [{required: true, message: '请输入用户名'}],
  email: [{required: true, message: '请输入邮箱'}, {type: 'email', message: '邮箱格式不正确'}],
  password: [{required: true, message: '请输入密码'}, {min: 6, message: '密码至少6位'}]
})

// 登录处理
const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl || isLoading.value) return
  await formEl.validate(async (valid) => {
    if (valid) {
      isLoading.value = true
      try {
        await userStore.login(loginForm)
        ElMessage.success('登录成功！')
        await router.push('/app')
      } catch (error) {
        ElMessage.error(error as string)
      } finally {
        isLoading.value = false
      }
    }
  })
}

// 注册处理
const handleRegister = async (formEl: FormInstance | undefined) => {
  if (!formEl || isLoading.value) return
  await formEl.validate(async (valid) => {
    if (valid) {
      isLoading.value = true
      try {
        await userStore.register(registerForm)
        ElMessage.success('注册成功，已自动登录！')
        await router.push('/app')
      } catch (error) {
        ElMessage.error(error as string)
      } finally {
        isLoading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="page-container">
    <div class="scaler">
      <div class="container" :class="{ 'active': isRegisterActive }">
        <div class="form-container sign-up">
          <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef"
                   @submit.prevent="handleRegister(registerFormRef)">
            <h1>创建账户</h1>
            <div class="social-icons">
              <a :href="`${API_BASE_URL}/auth/github`" class="icon"><i class="fa-brands fa-github"></i></a>
              <a :href="`${API_BASE_URL}/auth/qq`" class="icon"><i class="fa-brands fa-qq"></i></a>
            </div>
            <span>或使用邮箱注册</span>
            <el-form-item prop="username">
              <el-input v-model="registerForm.username" placeholder="用户名"/>
            </el-form-item>
            <el-form-item prop="email">
              <el-input v-model="registerForm.email" type="email" placeholder="邮箱"/>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="registerForm.password" type="password" placeholder="密码" show-password/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" native-type="submit" :loading="isLoading">注册</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="form-container sign-in">
          <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef"
                   @submit.prevent="handleLogin(loginFormRef)">
            <h1>登录</h1>
            <div class="social-icons">
              <a :href="`${API_BASE_URL}/auth/github`" class="icon"><i class="fa-brands fa-github"></i></a>
              <a :href="`${API_BASE_URL}/auth/qq`" class="icon"><i class="fa-brands fa-qq"></i></a>
            </div>
            <span>或使用邮箱密码登录</span>
            <el-form-item prop="email">
              <el-input v-model="loginForm.email" type="email" placeholder="邮箱"/>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="密码" show-password/>
            </el-form-item>
            <a href="#">忘记密码？</a>
            <el-form-item>
              <el-button type="primary" native-type="submit" :loading="isLoading">登录</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="toggle-container">
          <div class="toggle">
            <div class="toggle-panel toggle-left">
              <h1>欢迎回来！</h1>
              <p>输入您的个人信息以使用所有网站功能</p>
              <button class="hidden" @click="isRegisterActive = false">登录</button>
            </div>
            <div class="toggle-panel toggle-right">
              <h1>你好，朋友！</h1>
              <p>注册并提供您的个人信息，开始我们的旅程吧</p>
              <button class="hidden" @click="isRegisterActive = true">注册</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 样式部分保持不变 */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
}

.page-container {
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
}

.page-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
  opacity: 0;
  transition: opacity 0.4s ease-in-out;
}

.page-container:has(.scaler:hover)::before {
  opacity: 1;
}

.scaler {
  position: relative;
  z-index: 2;
  width: 768px;
  height: 480px;
  transition: transform 0.3s ease;
}

.container {
  border-radius: 30px;
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2);
}

.container p {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.3px;
  margin: 20px 0;
}

.container span {
  font-size: 12px;
}

.container a {
  font-size: 13px;
  text-decoration: none;
  margin: 15px 0 10px;
}

.container button.hidden {
  background-color: transparent;
  border: 1px solid #fff;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 10px 45px;
  text-transform: uppercase;
}

.container form {
  background-color: transparent;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 50px 40px 0;
  height: 100%;
}

.container .el-form-item {
  margin-bottom: 18px;
  width: 100%;
}

.container .el-button {
  width: 100%;
}

.form-container {
  background: linear-gradient(135deg, rgba(245, 245, 244, 0.4), rgba(245, 245, 244, 0.3));
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  transition: all 0.6s ease-in-out, background 0.4s ease-in-out, backdrop-filter 0.4s ease-in-out, -webkit-backdrop-filter 0.4s ease-in-out;
  position: absolute;
  top: 0;
  height: 100%;
}

.sign-in {
  left: 0;
  width: 50%;
  z-index: 2;
}

.sign-up {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.active .sign-in {
  transform: translateX(100%);
  opacity: 0;
}

.container.active .sign-up {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: move 0.6s;
}

@keyframes move {
  0%, 49.99% {
    opacity: 0;
    z-index: 1;
  }
  50%, 100% {
    opacity: 1;
    z-index: 5;
  }
}

.social-icons {
  margin: 20px 0;
}

.social-icons a {
  border: 1px solid #ccc;
  border-radius: 20%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 3px;
  width: 40px;
  height: 40px;
  color: #333;
}

.toggle-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: all 0.6s ease-in-out;
  border-radius: 150px 30px 30px 150px;
  z-index: 1000;
}

.container.active .toggle-container {
  transform: translateX(-100%);
  border-radius: 30px 150px 150px 30px;
}

.toggle {
  background: linear-gradient(135deg, rgba(22, 101, 52, 0.5), rgba(22, 101, 52, 0.4));
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  height: 100%;
  color: #fff;
  position: relative;
  left: -100%;
  width: 200%;
  transform: translateX(0);
  transition: all 0.6s ease-in-out, background 0.4s ease-in-out, backdrop-filter 0.4s ease-in-out, -webkit-backdrop-filter 0.4s ease-in-out;
}

.container.active .toggle {
  transform: translateX(50%);
}

.toggle-panel {
  position: absolute;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 30px;
  text-align: center;
  top: 0;
  transform: translateX(0);
  transition: all 0.6s ease-in-out;
}

.toggle-left {
  transform: translateX(-200%);
}

.container.active .toggle-left {
  transform: translateX(0);
}

.toggle-right {
  right: 0;
  transform: translateX(0);
}

.container.active .toggle-right {
  transform: translateX(200%);
}

.form-container .el-button--primary {
  background-color: #166534;
  border-color: #166534;
  padding: 18px 45px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 8px;
}

.form-container .el-button--primary:hover {
  background-color: #15803d;
  border-color: #15803d;
}

.form-container .el-button--primary:active {
  background-color: #14532D;
  border-color: #14532D;
}

.container:hover .form-container {
  background: linear-gradient(135deg, rgba(245, 245, 244, 0.8), rgba(245, 245, 244, 0.7));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.container:hover .toggle {
  background: linear-gradient(135deg, rgba(22, 101, 52, 0.9), rgba(22, 101, 52, 0.8));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.form-container h1,
.form-container span,
.form-container a {
  color: #1f2937;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

.toggle-panel h1,
.toggle-panel p {
  color: #fff;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.7);
}
</style>