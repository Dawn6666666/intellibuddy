// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

/**
 * 错误码枚举
 */
export enum ErrorCode {
  // 客户端错误 (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  
  // 服务器错误 (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
}

/**
 * 自定义错误类
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code: ErrorCode;

  constructor(
    message: string, 
    statusCode: number = 500, 
    code: ErrorCode = ErrorCode.INTERNAL_ERROR
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 异步错误包装器
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => unknown | Promise<unknown>
) => {
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
  // 默认错误状态码和错误码
  let statusCode = 500;
  let message = '服务器内部错误';
  let code = ErrorCode.INTERNAL_ERROR;
  let isOperational = false;

  // 处理自定义应用错误
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
    isOperational = err.isOperational;
  }
  // 处理 MongoDB 错误
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = '数据验证失败';
    code = ErrorCode.VALIDATION_ERROR;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = '无效的数据格式';
    code = ErrorCode.BAD_REQUEST;
  } else if ((err as any).code === 11000) {
    statusCode = 409;
    message = '数据已存在（重复的键值）';
    code = ErrorCode.CONFLICT;
    // 提取重复的字段名
    const field = Object.keys((err as any).keyPattern || {})[0];
    if (field) {
      message = `${field} 已存在`;
    }
  }
  // 处理 JWT 错误
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = '无效的认证令牌';
    code = ErrorCode.UNAUTHORIZED;
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = '认证令牌已过期，请重新登录';
    code = ErrorCode.UNAUTHORIZED;
  }
  // 处理数据库连接错误
  else if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
    statusCode = 503;
    message = '数据库连接失败，请稍后重试';
    code = ErrorCode.DATABASE_ERROR;
  }
  // 其他错误
  else if (err.message) {
    message = err.message;
  }

  // 记录错误日志
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    statusCode,
    code,
    message: err.message,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: (req as any).user?.userId || 'anonymous',
  };

  if (statusCode >= 500) {
    console.error('[ERROR]', JSON.stringify({
      ...logData,
      stack: err.stack,
    }, null, 2));
  } else if (statusCode >= 400) {
    console.warn('[WARN]', JSON.stringify(logData, null, 2));
  }

  // 生产环境不返回堆栈信息
  const isDevelopment = process.env.NODE_ENV === 'development';

  // 返回错误响应
  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(isDevelopment
      ? {
          error: err.message,
          stack: err.stack,
          details: (err as any).details || undefined,
        }
      : {}),
  });
};

/**
 * 404 Not Found 处理器
 */
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
  console.warn(`[404] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  
  res.status(404).json({
    success: false,
    message: `路由 ${req.originalUrl} 不存在`,
    code: ErrorCode.NOT_FOUND,
  });
};

/**
 * 创建常用错误的便捷函数
 */
export const createError = {
  badRequest: (message: string = '请求参数错误') => 
    new AppError(message, 400, ErrorCode.BAD_REQUEST),
    
  unauthorized: (message: string = '未授权，请先登录') => 
    new AppError(message, 401, ErrorCode.UNAUTHORIZED),
    
  forbidden: (message: string = '没有权限访问此资源') => 
    new AppError(message, 403, ErrorCode.FORBIDDEN),
    
  notFound: (resource: string = '资源') => 
    new AppError(`${resource}不存在`, 404, ErrorCode.NOT_FOUND),
    
  conflict: (message: string = '资源冲突') => 
    new AppError(message, 409, ErrorCode.CONFLICT),
    
  tooManyRequests: (message: string = '请求过于频繁，请稍后再试') => 
    new AppError(message, 429, ErrorCode.TOO_MANY_REQUESTS),
    
  internal: (message: string = '服务器内部错误') => 
    new AppError(message, 500, ErrorCode.INTERNAL_ERROR),
    
  serviceUnavailable: (message: string = '服务暂时不可用') => 
    new AppError(message, 503, ErrorCode.SERVICE_UNAVAILABLE),
    
  databaseError: (message: string = '数据库操作失败') => 
    new AppError(message, 500, ErrorCode.DATABASE_ERROR),
    
  aiServiceError: (message: string = 'AI 服务暂时不可用') => 
    new AppError(message, 503, ErrorCode.AI_SERVICE_ERROR),
};

