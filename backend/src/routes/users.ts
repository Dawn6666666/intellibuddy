import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import StudySession from '../models/StudySession';
import UserProgress from '../models/UserProgress';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// 配置文件上传
// 检测环境：Serverless 使用内存存储，本地使用磁盘存储
const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;

const storage = isServerless 
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
            const uploadDir = path.join(__dirname, '../../uploads/avatars');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        },
        filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, `avatar-${req.user?._id}-${uniqueSuffix}${ext}`);
        }
    });

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter: function (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('只支持 JPEG、PNG、GIF、WebP 格式的图片'));
        }
    }
});

// 上传头像
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req: Request, res: Response) => {
    const startTime = Date.now();
    console.log('📸 [头像上传] 开始处理...');
    
    try {
        if (!req.file) {
            console.error('📸 [头像上传] 错误: 未收到文件');
            return res.status(400).json({ message: '请选择要上传的图片' });
        }
        
        console.log('📸 [头像上传] 文件信息:', {
            filename: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
        
        const userId = req.user?._id;
        
        let avatarUrl: string;
        
        if (req.file.buffer) {
            // 内存存储（Serverless 环境）：将图片转换为 Base64 存储在数据库中
            console.log('📸 [头像上传] 使用内存存储，转换为 Base64');
            const base64Image = req.file.buffer.toString('base64');
            const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;
            avatarUrl = dataUri;
        } else {
            // 磁盘存储（本地环境）：使用文件系统存储
            console.log('📸 [头像上传] 使用文件系统存储');
            avatarUrl = `/uploads/avatars/${req.file.filename}`;
            
            // 删除旧头像（如果存在且不是第三方头像或 Base64）
            const user = await User.findById(userId);
            if (user?.avatarUrl && 
                user.avatarUrl.startsWith('/uploads/') && 
                !user.avatarUrl.startsWith('data:')) {
                const oldAvatarPath = path.join(__dirname, '../../', user.avatarUrl);
                if (fs.existsSync(oldAvatarPath)) {
                    try {
                        fs.unlinkSync(oldAvatarPath);
                        console.log('📸 [头像上传] 已删除旧头像:', oldAvatarPath);
                    } catch (deleteError: any) {
                        console.warn('📸 [头像上传] 删除旧头像失败（可忽略）:', deleteError.message);
                    }
                }
            }
        }
        
        // 更新数据库
        await User.findByIdAndUpdate(userId, { avatarUrl });
        
        const elapsed = Date.now() - startTime;
        console.log(`✅ [头像上传] 成功 - 耗时: ${elapsed}ms`, {
            userId,
            avatarUrl: avatarUrl.substring(0, 50) + '...',
            isServerless
        });
        
        res.json({
            message: '头像上传成功',
            avatarUrl
        });
    } catch (error: any) {
        const elapsed = Date.now() - startTime;
        console.error(`❌ [头像上传] 失败 - 耗时: ${elapsed}ms`, {
            userId: req.user?._id,
            errorMessage: error.message,
            errorStack: error.stack
        });
        res.status(500).json({ message: error.message || '头像上传失败' });
    }
});

// 更新个人资料
router.put('/profile', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { username } = req.body;
        
        if (!username || username.trim().length < 2) {
            return res.status(400).json({ message: '用户名至少需要 2 个字符' });
        }
        
        if (username.length > 20) {
            return res.status(400).json({ message: '用户名不能超过 20 个字符' });
        }
        
        const user = await User.findByIdAndUpdate(
            userId,
            { username: username.trim() },
            { new: true }
        ).select('-passwordHash');
        
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        
        console.log('用户更新个人资料', {
            userId,
            username: user.username
        });
        
        res.json({
            message: '个人资料更新成功',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl
            }
        });
    } catch (error: any) {
        console.error('更新个人资料失败', error, {
            userId: req.user?._id,
            errorMessage: error.message
        });
        res.status(500).json({ message: '更新失败，请稍后重试' });
    }
});

// 修改密码
router.put('/password', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: '请输入当前密码和新密码' });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ message: '新密码至少需要 6 位' });
        }
        
        // 获取用户（包含密码）
        const user = await User.findById(userId).select('+passwordHash');
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        
        // 检查是否设置了密码（第三方登录用户可能没有密码）
        if (!user.passwordHash) {
            return res.status(400).json({ message: '您的账号未设置密码，无法修改' });
        }
        
        // 验证当前密码
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: '当前密码错误' });
        }
        
        // 加密新密码
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.passwordHash = hashedPassword;
        await user.save();
        
        console.log('用户修改密码', { userId });
        
        res.json({ message: '密码修改成功' });
    } catch (error: any) {
        console.error('修改密码失败', error, {
            userId: req.user?._id,
            errorMessage: error.message
        });
        res.status(500).json({ message: '修改失败，请稍后重试' });
    }
});

// 清除用户学习数据
router.delete('/learning-data', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        
        // 删除学习记录
        await StudySession.deleteMany({ userId });
        
        // 重置学习进度
        await UserProgress.updateMany(
            { userId },
            { 
                status: 'not_started',
                masteryLevel: 0,
                lastStudiedAt: null,
                completedAt: null
            }
        );
        
        console.log('用户清除学习数据', { userId });
        
        res.json({ message: '学习数据已清除' });
    } catch (error: any) {
        console.error('清除学习数据失败', error, {
            userId: req.user?._id,
            errorMessage: error.message
        });
        res.status(500).json({ message: '清除失败，请稍后重试' });
    }
});

// 获取用户个人统计数据
router.get('/me/stats', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;

        // 获取总学习时长（秒）
        const totalDuration = await StudySession.aggregate([
            { $match: { userId } },
            { $group: { _id: null, total: { $sum: '$duration' } } },
        ]).then(result => result[0]?.total || 0);

        // 转换为小时
        const totalHours = Math.floor(totalDuration / 3600);

        // 获取完成的知识点数（作为"完成课程"）
        const completedCourses = await UserProgress.countDocuments({
            userId,
            status: 'completed'
        });

        // 计算学习积分（基于学习时长和完成的课程）
        // 规则：每小时10分，每完成一个知识点50分
        const points = Math.floor(totalDuration / 360) + (completedCourses * 50);

        // 获取所有用户的总积分来计算排名
        const allUsersStats = await Promise.all(
            (await User.find().select('_id')).map(async (user) => {
                const userDuration = await StudySession.aggregate([
                    { $match: { userId: user._id } },
                    { $group: { _id: null, total: { $sum: '$duration' } } },
                ]).then(result => result[0]?.total || 0);

                const userCompleted = await UserProgress.countDocuments({
                    userId: user._id,
                    status: 'completed'
                });

                return Math.floor(userDuration / 360) + (userCompleted * 50);
            })
        );

        // 计算排名百分比
        const totalUsers = allUsersStats.length;
        const betterThanCount = allUsersStats.filter(p => p > points).length; // 修复：统计比当前用户积分高的用户数
        const rankPercentage = totalUsers > 1 ? Math.round((betterThanCount / (totalUsers - 1)) * 100) : 0; // 修复：排除自己

        // 获取上月的统计数据来计算增长趋势
        const lastMonthStart = new Date();
        lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
        lastMonthStart.setDate(1);
        lastMonthStart.setHours(0, 0, 0, 0);

        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);
        thisMonthStart.setHours(0, 0, 0, 0);

        const lastMonthDuration = await StudySession.aggregate([
            { 
                $match: { 
                    userId,
                    startTime: { $gte: lastMonthStart, $lt: thisMonthStart }
                } 
            },
            { $group: { _id: null, total: { $sum: '$duration' } } },
        ]).then(result => result[0]?.total || 0);

        const thisMonthDuration = await StudySession.aggregate([
            { 
                $match: { 
                    userId,
                    startTime: { $gte: thisMonthStart }
                } 
            },
            { $group: { _id: null, total: { $sum: '$duration' } } },
        ]).then(result => result[0]?.total || 0);

        // 计算增长百分比
        const durationChange = lastMonthDuration > 0 
            ? Math.round(((thisMonthDuration - lastMonthDuration) / lastMonthDuration) * 100)
            : 0;

        res.json({
            totalStudyTime: {
                hours: totalHours,
                seconds: totalDuration,
                display: `${totalHours}h`,
                change: durationChange
            },
            completedCourses: {
                count: completedCourses,
                change: 0 // TODO: 实现课程完成数的月度对比
            },
            points: {
                total: points,
                display: points.toLocaleString(),
                change: 0 // TODO: 实现积分的月度对比
            },
            ranking: {
                percentage: rankPercentage,
                display: `Top ${rankPercentage}%`,
                change: 0 // TODO: 实现排名的月度对比
            }
        });
    } catch (error: any) {
        console.error('获取用户统计数据失败', error);
        res.status(500).json({ message: '获取统计数据失败' });
    }
});

export default router;
