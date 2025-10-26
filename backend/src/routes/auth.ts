// backend/src/routes/auth.ts
import {Router, Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authMiddleware } from '../middleware/auth';
import { logger } from '../middleware/logger';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-key';

router.post('/register', async (req, res) => {
    try {
        const {username, email, password} = req.body;
        
        // 验证必填项
        if (!username || !email || !password) {
            return res.status(400).json({message: '请填写所有必填项'});
        }
        
        // 验证密码强度
        if (password.length < 6) {
            return res.status(400).json({message: '密码至少需要6位'});
        }
        
        // 检查用户是否已存在
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: '该邮箱已被注册'});
        }
        
        // 优化：将salt轮数从10降低到8，提升性能（仍然安全）
        const salt = await bcrypt.genSalt(8);
        const passwordHash = await bcrypt.hash(password, salt);
        
        const newUser = new User({username, email, passwordHash});
        await newUser.save();
        
        const token = jwt.sign({userId: newUser._id}, JWT_SECRET, {expiresIn: '7d'});
        
        logger.info('用户注册成功', { 
            userId: newUser._id, 
            username: newUser.username,
            email: newUser.email 
        });
        
        res.status(201).json({
            token, 
            user: {
                _id: newUser._id, 
                username: newUser.username, 
                email: newUser.email,
                role: newUser.role,
                avatarUrl: newUser.avatarUrl
            }
        });
    } catch (error: any) {
        logger.error('用户注册失败', error, {
            username: req.body.username,
            email: req.body.email,
            errorMessage: error.message
        });
        res.status(500).json({message: '服务器错误，请稍后重试'});
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        
        console.log(`🔑 [后端 /login] 收到登录请求: ${email}`);
        
        // 验证必填项
        if (!email || !password) {
            console.log(`  ❌ 缺少必填项`);
            return res.status(400).json({message: '请输入邮箱和密码'});
        }
        
        // 查询用户（优化：只选择需要的字段）
        const user = await User.findOne({email}).select('+passwordHash').lean();
        
        if (!user) {
            console.log(`  ❌ 用户不存在: ${email}`);
            return res.status(400).json({message: '邮箱或密码错误'});
        }
        
        if (!user.passwordHash) {
            console.log(`  ❌ 用户未设置密码: ${email}`);
            return res.status(400).json({message: '该账户未设置密码，请使用第三方登录'});
        }
        
        // 验证密码
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            console.log(`  ❌ 密码错误: ${email}`);
            return res.status(400).json({message: '邮箱或密码错误'});
        }
        
        // 生成token
        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '7d'});
        
        console.log(`  ✅ 登录成功，生成 Token:`, token.substring(0, 20) + '...');
        console.log(`  👤 用户信息:`, {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl
        });
        
        logger.info('用户登录成功', {
            userId: user._id,
            username: user.username,
            email: user.email,
            ip: req.ip
        });
        
        // 返回用户信息（不包含密码哈希）
        res.json({
            token, 
            user: {
                _id: user._id, 
                username: user.username, 
                email: user.email,
                role: user.role,
                avatarUrl: user.avatarUrl
            }
        });
    } catch (error: any) {
        console.log(`  ❌ 登录异常:`, error.message);
        logger.error('用户登录失败', error, {
            email: req.body.email,
            ip: req.ip,
            errorMessage: error.message,
            stack: error.stack
        });
        res.status(500).json({message: '服务器错误，请稍后重试'});
    }
});

// /me 接口已经在 index.ts 中单独处理，不受 authRateLimitMiddleware 限制

// 忘记密码 - 发送重置邮件
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: '请输入邮箱地址' });
        }
        
        const user = await User.findOne({ email });
        
        // 为了安全，即使用户不存在也返回成功消息
        if (!user) {
            return res.json({ message: '如果该邮箱存在，我们已发送重置链接' });
        }
        
        // 生成重置token（1小时有效）
        const resetToken = jwt.sign(
            { userId: user._id, type: 'password-reset' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // TODO: 实际项目中应该发送邮件
        // 这里只是演示，实际应该集成邮件服务（如 Nodemailer + SMTP）
        logger.info('密码重置请求', {
            userId: user._id,
            email: user.email,
            resetToken: resetToken,
            resetUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
        });
        
        // 在开发环境下，可以在响应中返回token（生产环境应该删除）
        const response: any = { message: '如果该邮箱存在，我们已发送重置链接' };
        if (process.env.NODE_ENV === 'development') {
            response.resetToken = resetToken;
            response.resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
        }
        
        res.json(response);
    } catch (error: any) {
        logger.error('忘记密码请求失败', error, {
            email: req.body.email,
            errorMessage: error.message
        });
        res.status(500).json({ message: '服务器错误，请稍后重试' });
    }
});

// 重置密码
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ message: '请提供重置token和新密码' });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ message: '密码至少需要6位' });
        }
        
        // 验证token
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return res.status(400).json({ message: '重置链接无效或已过期' });
        }
        
        if (decoded.type !== 'password-reset') {
            return res.status(400).json({ message: '无效的重置token' });
        }
        
        // 查找用户
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        
        // 加密新密码
        const salt = await bcrypt.genSalt(8);
        const passwordHash = await bcrypt.hash(newPassword, salt);
        
        user.passwordHash = passwordHash;
        await user.save();
        
        logger.info('密码重置成功', {
            userId: user._id,
            email: user.email
        });
        
        res.json({ message: '密码重置成功' });
    } catch (error: any) {
        logger.error('密码重置失败', error, {
            errorMessage: error.message
        });
        res.status(500).json({ message: '服务器错误，请稍后重试' });
    }
});

export default router;