// backend/src/routes/study-time.ts
import { Router, Response, Request } from 'express';
import { authMiddleware } from '../middleware/auth';
import StudySession from '../models/StudySession';
import KnowledgePoint from '../models/KnowledgePoint';

const router = Router();

// 开始学习会话
router.post('/start', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { pointId } = req.body;

        let pointTitle, subject;
        if (pointId) {
            const point = await KnowledgePoint.findOne({ id: pointId });
            if (point) {
                pointTitle = point.title;
                subject = point.subject;
            }
        }

        // 结束之前所有未完成的会话
        const now = new Date();
        const unfinishedSessions = await StudySession.find({ userId, endTime: null });
        
        // 逐个更新每个会话的 duration
        for (const session of unfinishedSessions) {
            session.endTime = now;
            session.duration = Math.floor((now.getTime() - session.startTime.getTime()) / 1000);
            await session.save();
        }

        // 创建新会话
        const session = new StudySession({
            userId,
            pointId,
            pointTitle,
            subject,
            startTime: new Date(),
            active: true,
            activityCount: 0
        });

        await session.save();

        res.json({ sessionId: session._id, message: '学习会话已开始' });
    } catch (error) {
        console.error('开始学习会话失败:', error);
        res.status(500).json({ message: '开始学习会话时发生错误' });
    }
});

// 记录活动（心跳）
router.post('/heartbeat', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ message: '缺少 sessionId' });
        }

        const session = await StudySession.findOne({ _id: sessionId, userId, endTime: null });
        if (!session) {
            return res.status(404).json({ message: '学习会话不存在或已结束' });
        }

        // 更新活动计数
        session.activityCount += 1;
        
        // 计算持续时间
        const now = new Date();
        session.duration = Math.floor((now.getTime() - session.startTime.getTime()) / 1000);
        
        await session.save();

        res.json({ message: '活动已记录', duration: session.duration });
    } catch (error) {
        console.error('记录活动失败:', error);
        res.status(500).json({ message: '记录活动时发生错误' });
    }
});

// 结束学习会话
router.post('/end', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { sessionId } = req.body;

        const session = await StudySession.findOne({ _id: sessionId, userId, endTime: null });
        if (!session) {
            return res.status(404).json({ message: '学习会话不存在或已结束' });
        }

        const now = new Date();
        session.endTime = now;
        session.duration = Math.floor((now.getTime() - session.startTime.getTime()) / 1000);
        
        // 判断是否活跃（如果活动次数少于预期，可能是挂机）
        const expectedActivityCount = Math.floor(session.duration / 60); // 预期每分钟至少1次活动
        session.active = session.activityCount >= expectedActivityCount * 0.3; // 至少30%的活动率

        await session.save();

        res.json({ 
            message: '学习会话已结束',
            duration: session.duration,
            active: session.active
        });
    } catch (error) {
        console.error('结束学习会话失败:', error);
        res.status(500).json({ message: '结束学习会话时发生错误' });
    }
});

// 获取学习时长统计
router.get('/stats', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { startDate, endDate } = req.query;

        const filter: any = { userId, active: true }; // 只统计活跃的学习时间

        if (startDate || endDate) {
            filter.startTime = {};
            if (startDate) filter.startTime.$gte = new Date(startDate as string);
            if (endDate) filter.startTime.$lte = new Date(endDate as string);
        }

        // 总学习时长
        const totalResult = await StudySession.aggregate([
            { $match: filter },
            { $group: { _id: null, totalDuration: { $sum: '$duration' } } }
        ]);
        const totalDuration = totalResult.length > 0 ? totalResult[0].totalDuration : 0;

        // 按学科统计
        const subjectStats = await StudySession.aggregate([
            { $match: { ...filter, subject: { $exists: true, $ne: null } } },
            {
                $group: {
                    _id: '$subject',
                    duration: { $sum: '$duration' },
                    sessionCount: { $sum: 1 }
                }
            },
            { $sort: { duration: -1 } },
            {
                $project: {
                    subject: '$_id',
                    duration: 1,
                    sessionCount: 1,
                    _id: 0
                }
            }
        ]);

        // 按知识点统计（TOP 10）
        const pointStats = await StudySession.aggregate([
            { $match: { ...filter, pointId: { $exists: true, $ne: null } } },
            {
                $group: {
                    _id: '$pointId',
                    pointTitle: { $first: '$pointTitle' },
                    subject: { $first: '$subject' },
                    duration: { $sum: '$duration' },
                    sessionCount: { $sum: 1 }
                }
            },
            { $sort: { duration: -1 } },
            { $limit: 10 },
            {
                $project: {
                    pointId: '$_id',
                    pointTitle: 1,
                    subject: 1,
                    duration: 1,
                    sessionCount: 1,
                    _id: 0
                }
            }
        ]);

        // 按日期统计（最近30天）
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyStats = await StudySession.aggregate([
            { 
                $match: { 
                    userId, 
                    active: true,
                    startTime: { $gte: thirtyDaysAgo }
                } 
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$startTime' }
                    },
                    duration: { $sum: '$duration' },
                    sessionCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    date: '$_id',
                    duration: 1,
                    sessionCount: 1,
                    _id: 0
                }
            }
        ]);

        // 计算学习习惯（最活跃时段）
        const hourlyActivity = await StudySession.aggregate([
            { $match: filter },
            {
                $project: {
                    hour: { $hour: '$startTime' }
                }
            },
            {
                $group: {
                    _id: '$hour',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 3 },
            {
                $project: {
                    hour: '$_id',
                    count: 1,
                    _id: 0
                }
            }
        ]);

        res.json({
            totalDuration,
            totalHours: Math.floor(totalDuration / 3600),
            totalMinutes: Math.floor((totalDuration % 3600) / 60),
            subjectStats,
            pointStats,
            dailyStats,
            mostActiveHours: hourlyActivity
        });
    } catch (error) {
        console.error('获取学习时长统计失败:', error);
        res.status(500).json({ message: '获取学习时长统计时发生错误' });
    }
});

// 获取热力图数据
router.get('/heatmap', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { year } = req.query;

        const targetYear = year ? parseInt(year as string) : new Date().getFullYear();
        const startDate = new Date(targetYear, 0, 1);
        const endDate = new Date(targetYear, 11, 31, 23, 59, 59);

        const heatmapData = await StudySession.aggregate([
            {
                $match: {
                    userId,
                    active: true,
                    startTime: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$startTime' }
                    },
                    duration: { $sum: '$duration' },
                    sessionCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    date: '$_id',
                    duration: 1,
                    sessionCount: 1,
                    // 计算强度等级 (0-4)
                    intensity: {
                        $cond: [
                            { $gte: ['$duration', 7200] }, 4, // >= 2小时
                            {
                                $cond: [
                                    { $gte: ['$duration', 3600] }, 3, // >= 1小时
                                    {
                                        $cond: [
                                            { $gte: ['$duration', 1800] }, 2, // >= 30分钟
                                            {
                                                $cond: [
                                                    { $gte: ['$duration', 600] }, 1, // >= 10分钟
                                                    0
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    _id: 0
                }
            },
            { $sort: { date: 1 } }
        ]);

        // 计算连续学习天数
        let currentStreak = 0;
        let longestStreak = 0;
        let lastDate: Date | null = null;

        const sortedData = heatmapData.sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        for (const data of sortedData) {
            const currentDate = new Date(data.date);
            
            if (!lastDate) {
                currentStreak = 1;
            } else {
                const diffDays = Math.floor(
                    (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
                );
                
                if (diffDays === 1) {
                    currentStreak++;
                } else {
                    longestStreak = Math.max(longestStreak, currentStreak);
                    currentStreak = 1;
                }
            }
            
            lastDate = currentDate;
        }
        longestStreak = Math.max(longestStreak, currentStreak);

        res.json({
            year: targetYear,
            data: heatmapData,
            totalDays: heatmapData.length,
            longestStreak,
            currentStreak
        });
    } catch (error) {
        console.error('获取热力图数据失败:', error);
        res.status(500).json({ message: '获取热力图数据时发生错误' });
    }
});

export default router;

