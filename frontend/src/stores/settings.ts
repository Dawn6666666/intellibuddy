import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'
import { notificationService } from '@/utils/notification'

export interface NotificationSettings {
  study: boolean
  system: boolean
  email: boolean
}

export interface PreferenceSettings {
  difficulty: 'easy' | 'medium' | 'hard'
  dailyGoal: number
}

export interface PrivacySettings {
  analytics: boolean
  showProgress: boolean
}

export interface UserSettings {
  fontSize: 'small' | 'medium' | 'large'
  notifications: NotificationSettings
  preferences: PreferenceSettings
  privacy: PrivacySettings
}

export const useSettingsStore = defineStore('settings', () => {
  // 字体大小
  const fontSize = ref<'small' | 'medium' | 'large'>('medium')
  
  // 通知设置
  const notifications = reactive<NotificationSettings>({
    study: true,
    system: true,
    email: false
  })
  
  // 学习偏好
  const preferences = reactive<PreferenceSettings>({
    difficulty: 'medium',
    dailyGoal: 60
  })
  
  // 隐私设置
  const privacy = reactive<PrivacySettings>({
    analytics: true,
    showProgress: true
  })
  
  // 从 localStorage 加载设置
  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('userSettings')
      if (savedSettings) {
        const settings: UserSettings = JSON.parse(savedSettings)
        fontSize.value = settings.fontSize || 'medium'
        Object.assign(notifications, settings.notifications || notifications)
        Object.assign(preferences, settings.preferences || preferences)
        Object.assign(privacy, settings.privacy || privacy)
        
        // 应用字体大小
        applyFontSize(fontSize.value)
      }
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }
  
  // 保存设置到 localStorage
  const saveSettings = () => {
    const settings: UserSettings = {
      fontSize: fontSize.value,
      notifications: { ...notifications },
      preferences: { ...preferences },
      privacy: { ...privacy }
    }
    localStorage.setItem('userSettings', JSON.stringify(settings))
  }
  
  // 应用字体大小到页面
  const applyFontSize = (size: 'small' | 'medium' | 'large') => {
    const root = document.documentElement
    
    switch (size) {
      case 'small':
        root.style.fontSize = '14px'
        break
      case 'medium':
        root.style.fontSize = '16px'
        break
      case 'large':
        root.style.fontSize = '18px'
        break
    }
  }
  
  // 更新字体大小
  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    fontSize.value = size
    applyFontSize(size)
    saveSettings()
  }
  
  // 更新通知设置
  const updateNotifications = async (key: keyof NotificationSettings, value: boolean) => {
    notifications[key] = value
    
    // 如果启用了学习提醒或系统通知，请求浏览器通知权限
    if ((key === 'study' || key === 'system') && value) {
      await notificationService.requestPermission()
    }
    
    saveSettings()
  }
  
  // 发送学习提醒
  const sendStudyReminder = async (message: string) => {
    if (notifications.study) {
      await notificationService.sendStudyReminder(message)
    }
  }
  
  // 发送系统通知
  const sendSystemNotification = async (message: string) => {
    if (notifications.system) {
      await notificationService.sendSystemNotification(message)
    }
  }
  
  // 更新学习偏好
  const updatePreferences = <K extends keyof PreferenceSettings>(key: K, value: PreferenceSettings[K]) => {
    preferences[key] = value
    saveSettings()
  }
  
  // 更新隐私设置
  const updatePrivacy = (key: keyof PrivacySettings, value: boolean) => {
    privacy[key] = value
    saveSettings()
  }
  
  // 恢复默认设置
  const resetSettings = () => {
    fontSize.value = 'medium'
    notifications.study = true
    notifications.system = true
    notifications.email = false
    preferences.difficulty = 'medium'
    preferences.dailyGoal = 60
    privacy.analytics = true
    privacy.showProgress = true
    
    applyFontSize('medium')
    localStorage.removeItem('userSettings')
  }
  
  // 监听设置变化并自动保存
  watch([fontSize, notifications, preferences, privacy], () => {
    saveSettings()
  }, { deep: true })
  
  return {
    fontSize,
    notifications,
    preferences,
    privacy,
    loadSettings,
    saveSettings,
    setFontSize,
    updateNotifications,
    updatePreferences,
    updatePrivacy,
    resetSettings,
    sendStudyReminder,
    sendSystemNotification
  }
})

