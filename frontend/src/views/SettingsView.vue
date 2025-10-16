<template>
  <div class="settings-view">
    <div class="page-header">
      <h1><i class="fa-solid fa-cog"></i> 系统设置</h1>
      <p>个性化您的学习体验</p>
    </div>

    <div class="settings-content">
      <!-- 外观设置 -->
      <div class="card appearance-card">
        <div class="card-header">
          <h2><i class="fa-solid fa-palette"></i> 外观设置</h2>
        </div>
        <div class="card-body">
          <div class="setting-item">
            <div class="setting-info">
              <h3>主题模式</h3>
              <p>选择您喜欢的界面主题</p>
            </div>
            <div class="setting-control">
              <el-segmented v-model="themeStore.theme" :options="themeOptions" @change="handleThemeChange">
                <template #default="{ item }">
                  <div class="theme-option">
                    <i :class="item.icon"></i>
                    <span>{{ item.label }}</span>
                  </div>
                </template>
              </el-segmented>
            </div>
          </div>

          <el-divider />

          <div class="setting-item">
            <div class="setting-info">
              <h3>字体大小</h3>
              <p>调整界面文字大小</p>
            </div>
            <div class="setting-control">
              <el-radio-group v-model="fontSize">
                <el-radio-button label="small">小</el-radio-button>
                <el-radio-button label="medium">中</el-radio-button>
                <el-radio-button label="large">大</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>

      <!-- 通知设置 -->
      <div class="card notification-card">
        <div class="card-header">
          <h2><i class="fa-solid fa-bell"></i> 通知设置</h2>
        </div>
        <div class="card-body">
          <div class="setting-item">
            <div class="setting-info">
              <h3>学习提醒</h3>
              <p>每日学习计划提醒</p>
            </div>
            <div class="setting-control">
              <el-switch v-model="notifications.study" />
            </div>
          </div>

          <el-divider />

          <div class="setting-item">
            <div class="setting-info">
              <h3>系统通知</h3>
              <p>接收系统更新和重要通知</p>
            </div>
            <div class="setting-control">
              <el-switch v-model="notifications.system" />
            </div>
          </div>

          <el-divider />

          <div class="setting-item">
            <div class="setting-info">
              <h3>邮件通知</h3>
              <p>通过邮件接收重要更新</p>
            </div>
            <div class="setting-control">
              <el-switch v-model="notifications.email" />
            </div>
          </div>
        </div>
      </div>

      <!-- 学习偏好 -->
      <div class="card preference-card">
        <div class="card-header">
          <h2><i class="fa-solid fa-graduation-cap"></i> 学习偏好</h2>
        </div>
        <div class="card-body">
          <div class="setting-item">
            <div class="setting-info">
              <h3>自动播放视频</h3>
              <p>进入学习页面时自动播放视频</p>
            </div>
            <div class="setting-control">
              <el-switch v-model="preferences.autoPlayVideo" />
            </div>
          </div>

          <el-divider />

          <div class="setting-item">
            <div class="setting-info">
              <h3>难度偏好</h3>
              <p>默认题目难度</p>
            </div>
            <div class="setting-control">
              <el-select v-model="preferences.difficulty" placeholder="选择难度">
                <el-option label="简单" value="easy" />
                <el-option label="中等" value="medium" />
                <el-option label="困难" value="hard" />
              </el-select>
            </div>
          </div>

          <el-divider />

          <div class="setting-item">
            <div class="setting-info">
              <h3>每日学习目标</h3>
              <p>每天希望学习的时间（分钟）</p>
            </div>
            <div class="setting-control">
              <el-input-number 
                v-model="preferences.dailyGoal" 
                :min="15" 
                :max="480" 
                :step="15"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 隐私与安全 -->
      <div class="card privacy-card">
        <div class="card-header">
          <h2><i class="fa-solid fa-shield-halved"></i> 隐私与安全</h2>
        </div>
        <div class="card-body">
          <div class="setting-item">
            <div class="setting-info">
              <h3>学习数据分析</h3>
              <p>允许系统分析学习数据以提供个性化建议</p>
            </div>
            <div class="setting-control">
              <el-switch v-model="privacy.analytics" />
            </div>
          </div>

          <el-divider />

          <div class="setting-item">
            <div class="setting-info">
              <h3>显示学习进度</h3>
              <p>在个人主页公开显示学习进度</p>
            </div>
            <div class="setting-control">
              <el-switch v-model="privacy.showProgress" />
            </div>
          </div>

          <el-divider />

          <div class="setting-item danger-zone">
            <div class="setting-info">
              <h3>清除学习数据</h3>
              <p>清除所有学习进度和答题记录</p>
            </div>
            <div class="setting-control">
              <el-button type="danger" plain @click="handleClearData">
                <i class="fa-solid fa-trash"></i> 清除数据
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="save-actions">
        <el-button type="primary" size="large" @click="handleSaveSettings" :loading="isSaving">
          <i class="fa-solid fa-save"></i> 保存设置
        </el-button>
        <el-button size="large" @click="handleResetSettings">
          <i class="fa-solid fa-undo"></i> 恢复默认
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isSaving = ref(false)

const themeOptions = [
  { label: '浅色', value: 'light', icon: 'fa-solid fa-sun' },
  { label: '深色', value: 'dark', icon: 'fa-solid fa-moon' }
]

const fontSize = ref('medium')

const notifications = reactive({
  study: true,
  system: true,
  email: false
})

const preferences = reactive({
  autoPlayVideo: false,
  difficulty: 'medium',
  dailyGoal: 60
})

const privacy = reactive({
  analytics: true,
  showProgress: true
})

onMounted(() => {
  loadSettings()
})

const loadSettings = () => {
  // 从 localStorage 加载设置
  const savedSettings = localStorage.getItem('userSettings')
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings)
      fontSize.value = settings.fontSize || 'medium'
      Object.assign(notifications, settings.notifications || notifications)
      Object.assign(preferences, settings.preferences || preferences)
      Object.assign(privacy, settings.privacy || privacy)
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }
}

const handleThemeChange = (value: string) => {
  ElMessage.success(`已切换到${value === 'dark' ? '深色' : '浅色'}模式`)
}

const handleSaveSettings = () => {
  isSaving.value = true
  
  const settings = {
    fontSize: fontSize.value,
    notifications: { ...notifications },
    preferences: { ...preferences },
    privacy: { ...privacy }
  }
  
  localStorage.setItem('userSettings', JSON.stringify(settings))
  
  setTimeout(() => {
    isSaving.value = false
    ElMessage.success('设置保存成功')
  }, 500)
}

const handleResetSettings = () => {
  ElMessageBox.confirm('确定要恢复默认设置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    fontSize.value = 'medium'
    notifications.study = true
    notifications.system = true
    notifications.email = false
    preferences.autoPlayVideo = false
    preferences.difficulty = 'medium'
    preferences.dailyGoal = 60
    privacy.analytics = true
    privacy.showProgress = true
    
    localStorage.removeItem('userSettings')
    ElMessage.success('已恢复默认设置')
  }).catch(() => {})
}

const handleClearData = () => {
  ElMessageBox.confirm(
    '此操作将清除所有学习进度和答题记录，且不可恢复。确定要继续吗？',
    '危险操作',
    {
      confirmButtonText: '确定清除',
      cancelButtonText: '取消',
      type: 'error',
      confirmButtonClass: 'el-button--danger'
    }
  ).then(() => {
    ElMessage.info('此功能暂未实现')
  }).catch(() => {})
}
</script>

<style scoped>
.settings-view {
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

.settings-content {
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

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.setting-item.danger-zone {
  border-top: 2px solid #f56c6c;
  padding-top: 24px;
  margin-top: 16px;
}

.setting-info {
  flex: 1;
  padding-right: 24px;
}

.setting-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.setting-info p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
}

.setting-control {
  flex-shrink: 0;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
}

.save-actions {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  justify-content: center;
}

:deep(.el-divider) {
  margin: 16px 0;
}

:deep(.el-segmented) {
  background-color: var(--card-bg);
}
</style>

