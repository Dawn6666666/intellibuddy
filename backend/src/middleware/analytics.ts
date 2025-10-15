import { Request, Response, NextFunction } from 'express';

/**
 * 用户行为分析中间件
 * 收集用户行为数据用于后续分析
 */

interface AnalyticsEvent {
  userId?: string;
  sessionId: string;
  event: string;
  path: string;
  method: string;
  timestamp: Date;
  duration?: number;
  statusCode?: number;
  userAgent?: string;
  ip?: string;
  metadata?: Record<string, any>;
}

// 简单的内存存储（生产环境应使用数据库或分析服务）
const analyticsEvents: AnalyticsEvent[] = [];
const MAX_EVENTS = 10000; // 最多保存 10000 条事件

/**
 * 分析中间件
 */
export const analyticsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const sessionId = req.headers['x-session-id'] as string || generateSessionId();
  
  // 记录请求开始
  const event: AnalyticsEvent = {
    userId: (req as any).user?.id,
    sessionId,
    event: 'api_request',
    path: req.path,
    method: req.method,
    timestamp: new Date(),
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress,
  };

  // 监听响应完成
  res.on('finish', () => {
    event.duration = Date.now() - startTime;
    event.statusCode = res.statusCode;
    
    // 保存事件
    saveEvent(event);
  });

  next();
};

/**
 * 保存分析事件
 */
const saveEvent = (event: AnalyticsEvent) => {
  analyticsEvents.push(event);
  
  // 限制数组大小
  if (analyticsEvents.length > MAX_EVENTS) {
    analyticsEvents.shift();
  }
};

/**
 * 生成会话 ID
 */
const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * 获取统计数据
 */
export const getAnalytics = () => {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  const recentEvents = analyticsEvents.filter(e => e.timestamp.getTime() > oneHourAgo);
  const todayEvents = analyticsEvents.filter(e => e.timestamp.getTime() > oneDayAgo);

  return {
    total: analyticsEvents.length,
    lastHour: {
      count: recentEvents.length,
      uniqueUsers: new Set(recentEvents.map(e => e.userId).filter(Boolean)).size,
      averageDuration: calculateAverage(recentEvents.map(e => e.duration).filter(Boolean) as number[]),
    },
    today: {
      count: todayEvents.length,
      uniqueUsers: new Set(todayEvents.map(e => e.userId).filter(Boolean)).size,
      averageDuration: calculateAverage(todayEvents.map(e => e.duration).filter(Boolean) as number[]),
    },
    topPaths: getTopPaths(todayEvents),
    errorRate: calculateErrorRate(todayEvents),
  };
};

/**
 * 计算平均值
 */
const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
};

/**
 * 获取访问最多的路径
 */
const getTopPaths = (events: AnalyticsEvent[], limit = 10) => {
  const pathCounts = new Map<string, number>();
  
  events.forEach(e => {
    pathCounts.set(e.path, (pathCounts.get(e.path) || 0) + 1);
  });

  return Array.from(pathCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([path, count]) => ({ path, count }));
};

/**
 * 计算错误率
 */
const calculateErrorRate = (events: AnalyticsEvent[]): number => {
  if (events.length === 0) return 0;
  
  const errors = events.filter(e => e.statusCode && e.statusCode >= 400).length;
  return (errors / events.length) * 100;
};

/**
 * 记录自定义事件
 */
export const trackEvent = (
  eventName: string,
  userId?: string,
  metadata?: Record<string, any>
) => {
  const event: AnalyticsEvent = {
    userId,
    sessionId: generateSessionId(),
    event: eventName,
    path: '/custom',
    method: 'TRACK',
    timestamp: new Date(),
    metadata,
  };

  saveEvent(event);
};

