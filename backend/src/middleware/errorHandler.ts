// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

/**
 * 自定义错误类
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 异步错误包装器
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 全局错误处理中间件
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // 默认错误状态码
  let statusCode = 500;
  let message = '服务器内部错误';
  let isOperational = false;

  // 处理自定义应用错误
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }
  // 处理 MongoDB 错误
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = '数据验证失败';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = '无效的数据格式';
  } else if ((err as any).code === 11000) {
    statusCode = 409;
    message = '数据已存在';
  }
  // 处理 JWT 错误
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = '无效的认证令牌';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = '认证令牌已过期';
  }
  // 其他错误
  else if (err.message) {
    message = err.message;
  }

  // 记录错误日志
  if (statusCode >= 500) {
    console.error('[Error Handler] 服务器错误:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  } else {
    console.warn('[Error Handler] 客户端错误:', {
      message: err.message,
      url: req.originalUrl,
      method: req.method,
    });
  }

  // 返回错误响应
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  });
};

/**
 * 404 Not Found 处理器
 */
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `路由 ${req.originalUrl} 不存在`,
  });
};

