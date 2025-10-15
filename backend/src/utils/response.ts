// backend/src/utils/response.ts
import { Response } from 'express';

/**
 * 统一的 API 响应格式
 */
export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

/**
 * 成功响应
 */
export const successResponse = <T = any>(
  res: Response,
  data?: T,
  message: string = '操作成功',
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  } as APIResponse<T>);
};

/**
 * 错误响应
 */
export const errorResponse = (
  res: Response,
  message: string = '操作失败',
  statusCode: number = 500,
  error?: string
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(error && { error }),
    timestamp: new Date().toISOString(),
  } as APIResponse);
};

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const paginatedResponse = <T = any>(
  res: Response,
  items: T[],
  page: number,
  limit: number,
  total: number,
  message: string = '获取成功'
): Response => {
  return res.status(200).json({
    success: true,
    message,
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    } as PaginatedResponse<T>,
    timestamp: new Date().toISOString(),
  });
};

