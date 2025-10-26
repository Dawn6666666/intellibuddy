/**
 * 浏览器通知工具类
 */

// 类型声明
type NotificationPermissionType = 'default' | 'granted' | 'denied'

interface NotificationOptions {
  body?: string
  icon?: string
  badge?: string
  tag?: string
  data?: unknown
  requireInteraction?: boolean
  silent?: boolean
}

export class NotificationService {
  private static instance: NotificationService
  private permission: NotificationPermissionType = 'default'

  private constructor() {
    this.checkPermission()
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  /**
   * 检查通知权限
   */
  private checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission
    }
  }

  /**
   * 请求通知权限
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('此浏览器不支持桌面通知')
      return false
    }

    if (this.permission === 'granted') {
      return true
    }

    const permission = await Notification.requestPermission()
    this.permission = permission
    return permission === 'granted'
  }

  /**
   * 发送通知
   */
  async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission()
      if (!granted) {
        console.warn('用户拒绝了通知权限')
        return
      }
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      })

      // 点击通知时聚焦窗口
      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      // 3秒后自动关闭
      setTimeout(() => {
        notification.close()
      }, 3000)
    } catch (error) {
      console.error('发送通知失败:', error)
    }
  }

  /**
   * 发送学习提醒
   */
  async sendStudyReminder(message: string): Promise<void> {
    await this.sendNotification('学习提醒', {
      body: message,
      icon: '/favicon.ico',
      tag: 'study-reminder'
    })
  }

  /**
   * 发送系统通知
   */
  async sendSystemNotification(message: string): Promise<void> {
    await this.sendNotification('系统通知', {
      body: message,
      icon: '/favicon.ico',
      tag: 'system-notification'
    })
  }

  /**
   * 检查是否支持通知
   */
  isSupported(): boolean {
    return 'Notification' in window
  }

  /**
   * 获取当前权限状态
   */
  getPermission(): NotificationPermissionType {
    return this.permission
  }
}

export const notificationService = NotificationService.getInstance()

