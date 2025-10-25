import { useSettingsStore } from '@/stores/settings'

/**
 * 学习提醒服务
 */
export class StudyReminderService {
  private static instance: StudyReminderService
  private timerId: number | null = null
  private lastStudyTime: number = Date.now()

  private constructor() {
    this.loadLastStudyTime()
  }

  static getInstance(): StudyReminderService {
    if (!StudyReminderService.instance) {
      StudyReminderService.instance = new StudyReminderService()
    }
    return StudyReminderService.instance
  }

  /**
   * 加载上次学习时间
   */
  private loadLastStudyTime() {
    const saved = localStorage.getItem('lastStudyTime')
    if (saved) {
      this.lastStudyTime = parseInt(saved, 10)
    }
  }

  /**
   * 保存学习时间
   */
  updateLastStudyTime() {
    this.lastStudyTime = Date.now()
    localStorage.setItem('lastStudyTime', this.lastStudyTime.toString())
  }

  /**
   * 启动学习提醒
   */
  start() {
    if (this.timerId) {
      return // 已经启动
    }

    // 每30分钟检查一次
    this.timerId = window.setInterval(() => {
      this.checkAndRemind()
    }, 30 * 60 * 1000) // 30分钟

    // 立即检查一次
    this.checkAndRemind()
  }

  /**
   * 停止学习提醒
   */
  stop() {
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  }

  /**
   * 检查并发送提醒
   */
  private async checkAndRemind() {
    const settingsStore = useSettingsStore()
    
    if (!settingsStore.notifications.study) {
      return // 学习提醒已关闭
    }

    const now = Date.now()
    const hoursSinceLastStudy = (now - this.lastStudyTime) / (1000 * 60 * 60)

    // 如果超过2小时没有学习，发送提醒
    if (hoursSinceLastStudy >= 2) {
      const dailyGoal = settingsStore.preferences.dailyGoal
      await settingsStore.sendStudyReminder(
        `您今天的学习目标是 ${dailyGoal} 分钟，快来继续学习吧！💪`
      )
    }
  }

  /**
   * 检查每日学习目标
   */
  async checkDailyGoal(studiedMinutes: number) {
    const settingsStore = useSettingsStore()
    const dailyGoal = settingsStore.preferences.dailyGoal

    if (studiedMinutes >= dailyGoal) {
      await settingsStore.sendSystemNotification(
        `🎉 恭喜！您已完成今天的学习目标（${dailyGoal}分钟）！`
      )
    }
  }
}

export const studyReminderService = StudyReminderService.getInstance()

