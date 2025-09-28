// backend/src/routes/auth.ts
import {Router, Request, Response, NextFunction} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, {IUser} from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-key';

// --- 注册和登录路由 (保持不变) ... ---
router.post('/register', async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({message: '请填写所有必填项'});
        }
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: '该邮箱已被注册'});
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new User({username, email, passwordHash});
        await newUser.save();
        const token = jwt.sign({userId: newUser._id}, JWT_SECRET, {expiresIn: '7d'});
        res.status(201).json({token, user: {_id: newUser._id, username: newUser.username, email: newUser.email}});
    } catch (error) {
        res.status(500).json({message: '服务器错误'});
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: '邮箱或密码错误'});
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({message: '邮箱或密码错误'});
        }
        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '7d'});
        res.json({token, user: {_id: user._id, username: user.username, email: user.email}});
    } catch (error) {
        res.status(500).json({message: '服务器错误'});
    }
});

// --- Token 验证中间件和类型定义 ---

// 1. 新增 export
export interface AuthRequest extends Request {
    user?: IUser;
}

// 2. 新增 export
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({message: '未授权的访问，缺少Token'});
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await User.findById(decoded.userId).select('-passwordHash');
        if (!user) {
            return res.status(401).json({message: '用户不存在'});
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({message: '无效的Token'});
    }
};

// --- 获取当前用户信息的路由 (保持不变) ---
router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
    res.json(req.user);
});

export default router;