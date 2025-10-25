/**
 * 错误追踪和监控服务
 */

export interface ErrorLog {
  id: string;
  timestamp: number;
  type: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  userId?: string;
  context?: Record<string, any>;
}

export interface PerformanceLog {
  id: string;
  timestamp: number;
  metric: string;
  value: number;
  unit: string;
  context?: Record<string, any>;
}

class ErrorTrackingService {
  private errors: ErrorLog[] = [];
  private performances: PerformanceLog[] = [];
  private maxLogs = 100;
  private errorHandlers: Array<(error: ErrorLog) => void> = [];
  private performanceHandlers: Array<(perf: PerformanceLog) => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    // 全局错误监听
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'error',
        message: event.message,
        stack: event.error?.stack,
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Promise rejection 监听
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'error',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        context: {
          promise: true,
        },
      });
    });

    // 资源加载错误监听
    window.addEventListener(
      'error',
      (event) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK') {
          this.logError({
            type: 'error',
            message: `Resource failed to load: ${(target as any).src || (target as any).href}`,
            context: {
              tagName: target.tagName,
              resourceUrl: (target as any).src || (target as any).href,
            },
          });
        }
      },
      true
    );

    // 监听网络错误
    this.monitorNetworkErrors();
  }

  private monitorNetworkErrors() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          this.logError({
            type: 'warning',
            message: `HTTP ${response.status}: ${response.statusText}`,
            context: {
              url: args[0]?.toString(),
              status: response.status,
              statusText: response.statusText,
            },
          });
        }
        return response;
      } catch (error: any) {
        this.logError({
          type: 'error',
          message: `Network request failed: ${error.message}`,
          stack: error.stack,
          context: {
            url: args[0]?.toString(),
          },
        });
        throw error;
      }
    };
  }

  logError(options: Partial<ErrorLog>) {
    const error: ErrorLog = {
      id: this.generateId(),
      timestamp: Date.now(),
      type: options.type || 'error',
      message: options.message || 'Unknown error',
      stack: options.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.getUserId(),
      context: options.context,
    };

    this.errors.push(error);
    this.trimLogs(this.errors, this.maxLogs);

    // 触发错误处理器
    this.errorHandlers.forEach((handler) => {
      try {
        handler(error);
      } catch (e) {
        console.error('Error in error handler:', e);
      }
    });

    // 在开发环境打印到控制台
    if (import.meta.env.DEV) {
      console.error('[Error Tracking]', error);
    }

    // 发送到服务器（可选）
    this.sendToServer(error);
  }

  logPerformance(metric: string, value: number, unit: string = 'ms', context?: Record<string, any>) {
    const perf: PerformanceLog = {
      id: this.generateId(),
      timestamp: Date.now(),
      metric,
      value,
      unit,
      context,
    };

    this.performances.push(perf);
    this.trimLogs(this.performances, this.maxLogs);

    // 触发性能处理器
    this.performanceHandlers.forEach((handler) => {
      try {
        handler(perf);
      } catch (e) {
        console.error('Error in performance handler:', e);
      }
    });

    if (import.meta.env.DEV) {
      console.log('[Performance Tracking]', perf);
    }
  }

  private trimLogs<T>(logs: T[], maxLength: number) {
    if (logs.length > maxLength) {
      logs.splice(0, logs.length - maxLength);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserId(): string | undefined {
    // 从 localStorage 或其他地方获取用户 ID
    try {
      const userStore = localStorage.getItem('user');
      if (userStore) {
        const user = JSON.parse(userStore);
        return user._id || user.id;
      }
    } catch (e) {
      // Ignore
    }
    return undefined;
  }

  private async sendToServer(error: ErrorLog) {
    // 实现发送到服务器的逻辑
    try {
      // 可以批量发送以减少请求
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(error),
      // });
    } catch (e) {
      // 发送失败时静默处理
      console.warn('Failed to send error to server:', e);
    }
  }

  // 手动记录错误
  captureError(error: Error, context?: Record<string, any>) {
    this.logError({
      type: 'error',
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  // 手动记录警告
  captureWarning(message: string, context?: Record<string, any>) {
    this.logError({
      type: 'warning',
      message,
      context,
    });
  }

  // 手动记录信息
  captureInfo(message: string, context?: Record<string, any>) {
    this.logError({
      type: 'info',
      message,
      context,
    });
  }

  // 注册错误处理器
  onError(handler: (error: ErrorLog) => void) {
    this.errorHandlers.push(handler);
    return () => {
      const index = this.errorHandlers.indexOf(handler);
      if (index > -1) {
        this.errorHandlers.splice(index, 1);
      }
    };
  }

  // 注册性能处理器
  onPerformance(handler: (perf: PerformanceLog) => void) {
    this.performanceHandlers.push(handler);
    return () => {
      const index = this.performanceHandlers.indexOf(handler);
      if (index > -1) {
        this.performanceHandlers.splice(index, 1);
      }
    };
  }

  // 获取错误日志
  getErrors(count?: number): ErrorLog[] {
    if (count) {
      return this.errors.slice(-count);
    }
    return [...this.errors];
  }

  // 获取性能日志
  getPerformances(count?: number): PerformanceLog[] {
    if (count) {
      return this.performances.slice(-count);
    }
    return [...this.performances];
  }

  // 清除日志
  clearLogs() {
    this.errors = [];
    this.performances = [];
  }

  // 获取错误统计
  getErrorStats() {
    const stats = {
      total: this.errors.length,
      byType: {
        error: 0,
        warning: 0,
        info: 0,
      },
      recent: this.errors.slice(-10),
    };

    this.errors.forEach((error) => {
      stats.byType[error.type]++;
    });

    return stats;
  }

  // 获取性能统计
  getPerformanceStats() {
    const stats: Record<string, { count: number; avg: number; min: number; max: number }> = {};

    this.performances.forEach((perf) => {
      if (!stats[perf.metric]) {
        stats[perf.metric] = {
          count: 0,
          avg: 0,
          min: Infinity,
          max: -Infinity,
        };
      }

      const metric = stats[perf.metric];
      metric.count++;
      metric.avg = (metric.avg * (metric.count - 1) + perf.value) / metric.count;
      metric.min = Math.min(metric.min, perf.value);
      metric.max = Math.max(metric.max, perf.value);
    });

    return stats;
  }

  // 设置用户上下文
  setUserContext(userId: string, email?: string, username?: string) {
    // 可以将用户信息保存到错误上下文中
    (window as any).__errorTrackingUserContext__ = {
      userId,
      email,
      username,
    };
  }

  // 设置自定义标签
  setTags(tags: Record<string, string>) {
    (window as any).__errorTrackingTags__ = {
      ...(window as any).__errorTrackingTags__,
      ...tags,
    };
  }

  // 添加面包屑（用户行为追踪）
  addBreadcrumb(category: string, message: string, data?: any) {
    if (!((window as any).__errorTrackingBreadcrumbs__)) {
      (window as any).__errorTrackingBreadcrumbs__ = [];
    }

    (window as any).__errorTrackingBreadcrumbs__.push({
      timestamp: Date.now(),
      category,
      message,
      data,
    });

    // 只保留最近 30 条
    if ((window as any).__errorTrackingBreadcrumbs__.length > 30) {
      (window as any).__errorTrackingBreadcrumbs__.shift();
    }
  }
}

// 创建单例
export const errorTracking = new ErrorTrackingService();

// Vue 错误处理器
export function setupVueErrorHandler(app: any) {
  app.config.errorHandler = (err: Error, instance: any, info: string) => {
    errorTracking.captureError(err, {
      component: instance?.$options?.name || 'Unknown',
      info,
      props: instance?.$props,
    });
  };

  app.config.warnHandler = (msg: string, instance: any, trace: string) => {
    errorTracking.captureWarning(msg, {
      component: instance?.$options?.name || 'Unknown',
      trace,
    });
  };
}

// 导出类型
export type { ErrorTrackingService };


