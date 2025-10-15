// backend/src/middleware/rateLimiter.ts
import { Request, Response, NextFunction } from 'express';

/**
 * 简单的内存限流器
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // 定期清理过期记录
    setInterval(() => this.cleanup(), windowMs);
  }

  /**
   * 检查是否超过限流
   */
  isRateLimited(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];

    // 过滤掉过期的请求
    const validRequests = requests.filter(time => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return true;
    }

    // 记录新请求
    validRequests.push(now);
    this.requests.set(key, validRequests);

    return false;
  }

  /**
   * 清理过期记录
   */
  private cleanup() {
    const now = Date.now();
    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => now - time < this.windowMs);
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }

  /**
   * 重置指定键的限流
   */
  reset(key: string) {
    this.requests.delete(key);
  }
}

// 创建不同类型的限流器
export const globalLimiter = new RateLimiter(60000, 100); // 全局：每分钟100次
export const aiLimiter = new RateLimiter(60000, 20); // AI接口：每分钟20次
export const authLimiter = new RateLimiter(900000, 20); // 认证接口：每15分钟20次（放宽限制）

/**
 * 限流中间件工厂
 */
export const createRateLimitMiddleware = (limiter: RateLimiter, keyGenerator?: (req: Request) => string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 生成限流键（默认使用 IP + 用户ID）
    const key = keyGenerator
      ? keyGenerator(req)
      : `${req.ip}:${(req as any).user?._id || 'anonymous'}`;

    if (limiter.isRateLimited(key)) {
      return res.status(429).json({
        success: false,
        message: '请求过于频繁，请稍后再试',
      });
    }

    next();
  };
};

/**
 * AI 接口限流中间件
 */
export const aiRateLimitMiddleware = createRateLimitMiddleware(
  aiLimiter,
  req => `ai:${req.ip}:${(req as any).user?._id || 'anonymous'}`
);

/**
 * 认证接口限流中间件
 */
export const authRateLimitMiddleware = createRateLimitMiddleware(
  authLimiter,
  req => `auth:${req.ip}`
);

/**
 * 全局限流中间件
 */
export const globalRateLimitMiddleware = createRateLimitMiddleware(globalLimiter);

