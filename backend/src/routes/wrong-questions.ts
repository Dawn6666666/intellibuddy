// backend/src/routes/wrong-questions.ts
import { Router, Response, Request } from 'express';
import { authMiddleware } from './auth';
import WrongQuestion from '../models/WrongQuestion';
import KnowledgePoint from '../models/KnowledgePoint';
import { getChatCompletion } from './ai';

const router = Router();

// 获取用户的错题列表
router.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { subject, mastered, pointId } = req.query;

        const filter: any = { userId };
        if (subject) filter.subject = subject;
        if (mastered !== undefined) filter.mastered = mastered === 'true';
        if (pointId) filter.pointId = pointId;

        const wrongQuestions = await WrongQuestion.find(filter)
            .sort({ lastAttemptAt: -1 })
            .lean();

        res.json({ wrongQuestions });
    } catch (error) {
        console.error('获取错题列表失败:', error);
        res.status(500).json({ message: '获取错题列表时发生错误' });
    }
});

// 获取错题统计
router.get('/stats', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;

        // 按学科统计
        const subjectStats = await WrongQuestion.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: '$subject',
                    total: { $sum: 1 },
                    mastered: {
                        $sum: { $cond: [{ $eq: ['$mastered', true] }, 1, 0] }
                    },
                    unmastered: {
                        $sum: { $cond: [{ $eq: ['$mastered', false] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    subject: '$_id',
                    total: 1,
                    mastered: 1,
                    unmastered: 1,
                    _id: 0
                }
            }
        ]);

        // 按知识点统计
        const pointStats = await WrongQuestion.aggregate([
            { $match: { userId, mastered: false } },
            {
                $group: {
                    _id: '$pointId',
                    pointTitle: { $first: '$pointTitle' },
                    subject: { $first: '$subject' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $project: {
                    pointId: '$_id',
                    pointTitle: 1,
                    subject: 1,
                    count: 1,
                    _id: 0
                }
            }
        ]);

        // 总体统计
        const totalWrong = await WrongQuestion.countDocuments({ userId });
        const totalMastered = await WrongQuestion.countDocuments({ userId, mastered: true });

        res.json({
            totalWrong,
            totalMastered,
            totalUnmastered: totalWrong - totalMastered,
            masteryRate: totalWrong > 0 ? Math.round((totalMastered / totalWrong) * 100) : 0,
            subjectStats,
            weakestPoints: pointStats
        });
    } catch (error) {
        console.error('获取错题统计失败:', error);
        res.status(500).json({ message: '获取错题统计时发生错误' });
    }
});

// 添加错题（通常由测验系统自动调用）
router.post('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { pointId, question, options, type, userAnswer, correctAnswer, explanation, difficulty } = req.body;

        // 获取知识点信息
        const point = await KnowledgePoint.findOne({ id: pointId });
        if (!point) {
            return res.status(404).json({ message: '知识点不存在' });
        }

        // 检查是否已存在相同错题
        const existing = await WrongQuestion.findOne({
            userId,
            pointId,
            question
        });

        if (existing) {
            // 更新错题信息
            existing.retryCount += 1;
            existing.lastAttemptAt = new Date();
            existing.userAnswer = userAnswer;
            await existing.save();
            return res.json({ wrongQuestion: existing, updated: true });
        }

        // 创建新错题
        const wrongQuestion = new WrongQuestion({
            userId,
            pointId,
            pointTitle: point.title,
            subject: point.subject,
            question,
            options,
            type,
            userAnswer,
            correctAnswer,
            explanation,
            difficulty: difficulty || point.difficulty
        });

        await wrongQuestion.save();
        res.status(201).json({ wrongQuestion });
    } catch (error) {
        console.error('添加错题失败:', error);
        res.status(500).json({ message: '添加错题时发生错误' });
    }
});

// 生成 AI 深度解析
router.post('/:id/analyze', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const wrongQuestion = await WrongQuestion.findOne({ _id: id, userId });
        if (!wrongQuestion) {
            return res.status(404).json({ message: '错题不存在' });
        }

        // 如果已有 AI 解析，直接返回
        if (wrongQuestion.aiAnalysis) {
            return res.json({ aiAnalysis: wrongQuestion.aiAnalysis });
        }

        // 构建提示词
        const userAnswerText = Array.isArray(wrongQuestion.userAnswer)
            ? wrongQuestion.userAnswer.map(i => wrongQuestion.options[i]).join(', ')
            : wrongQuestion.options[wrongQuestion.userAnswer as number];

        const correctAnswerText = Array.isArray(wrongQuestion.correctAnswer)
            ? wrongQuestion.correctAnswer.map(i => wrongQuestion.options[i]).join(', ')
            : wrongQuestion.options[wrongQuestion.correctAnswer as number];

        const prompt = `作为一名经验丰富的计算机科学教师，请深度分析以下错题，帮助学生理解错误原因并掌握正确知识：

**知识点**: ${wrongQuestion.pointTitle} (${wrongQuestion.subject})

**题目**: ${wrongQuestion.question}

**选项**:
${wrongQuestion.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}

**学生的答案**: ${userAnswerText}
**正确答案**: ${correctAnswerText}

**标准解析**: ${wrongQuestion.explanation}

请提供：
1. **错误原因分析**：为什么学生会选择这个答案？可能的误解是什么？
2. **知识点详解**：用更通俗易懂的方式解释这个知识点的核心概念
3. **记忆技巧**：提供便于记忆的口诀、类比或联想方法
4. **相关知识拓展**：这个知识点与其他知识点的关联

请用清晰、友好的语言，就像面对面辅导学生一样。`;

        const aiAnalysis = await getChatCompletion([
            { role: 'user', content: prompt }
        ]);

        // 保存 AI 解析
        wrongQuestion.aiAnalysis = aiAnalysis;
        await wrongQuestion.save();

        res.json({ aiAnalysis });
    } catch (error) {
        console.error('生成 AI 解析失败:', error);
        res.status(500).json({ message: '生成 AI 解析时发生错误' });
    }
});

// 标记错题为已掌握
router.put('/:id/master', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const wrongQuestion = await WrongQuestion.findOneAndUpdate(
            { _id: id, userId },
            { mastered: true, lastAttemptAt: new Date() },
            { new: true }
        );

        if (!wrongQuestion) {
            return res.status(404).json({ message: '错题不存在' });
        }

        res.json({ wrongQuestion });
    } catch (error) {
        console.error('标记错题失败:', error);
        res.status(500).json({ message: '标记错题时发生错误' });
    }
});

// 重置错题为未掌握
router.put('/:id/reset', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const wrongQuestion = await WrongQuestion.findOneAndUpdate(
            { _id: id, userId },
            { mastered: false, lastAttemptAt: new Date() },
            { new: true }
        );

        if (!wrongQuestion) {
            return res.status(404).json({ message: '错题不存在' });
        }

        res.json({ wrongQuestion });
    } catch (error) {
        console.error('重置错题失败:', error);
        res.status(500).json({ message: '重置错题时发生错误' });
    }
});

// 删除错题
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const wrongQuestion = await WrongQuestion.findOneAndDelete({ _id: id, userId });
        if (!wrongQuestion) {
            return res.status(404).json({ message: '错题不存在' });
        }

        res.json({ message: '错题已删除' });
    } catch (error) {
        console.error('删除错题失败:', error);
        res.status(500).json({ message: '删除错题时发生错误' });
    }
});

export default router;

