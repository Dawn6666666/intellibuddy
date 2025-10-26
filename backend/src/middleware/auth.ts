// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-key';

/**
 * 认证中间件 - 验证 JWT Token
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log(`🔐 [后端 authMiddleware] 收到请求: ${req.method} ${req.path}`);
  
  const authHeader = req.header('Authorization');
  console.log(`  📤 Authorization header:`, authHeader ? `${authHeader.substring(0, 20)}...` : '无');
  
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    console.log(`  ❌ 缺少 Token，返回 401`);
    res.status(401).json({ message: '未授权的访问，缺少Token' });
    return;
  }

  try {
    console.log(`  🔍 开始验证 Token...`);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    console.log(`  ✅ Token 解码成功，userId: ${decoded.userId}`);
    
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      console.log(`  ❌ 用户不存在: ${decoded.userId}`);
      res.status(401).json({ message: '用户不存在' });
      return;
    }

    console.log(`  ✅ 用户验证成功: ${user.username} (${user.email})`);
    req.user = user;
    next();
  } catch (error: any) {
    console.log(`  ❌ Token 验证失败:`, error.message);
    res.status(401).json({ message: '无效的Token' });
  }
};

/**
 * 可选认证中间件 - 如果有 token 则验证，没有则继续
 */
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (user) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Token 无效，但不阻止请求继续
    next();
  }
};

