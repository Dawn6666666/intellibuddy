// backend/src/routes/quiz.ts
import {Router, Response, Request} from 'express';
import {authMiddleware} from './auth';
import KnowledgePoint from '../models/KnowledgePoint';
import UserProgress from '../models/UserProgress';

const router = Router();

// 获取指定知识点的测验题（不包含正确答案）
router.get('/:pointId', authMiddleware, async (req: Request, res: Response) => {
    try {
        const {pointId} = req.params;
        const knowledgePoint = await KnowledgePoint.findOne({id: pointId});

        if (!knowledgePoint) {
            return res.status(404).json({message: '知识点不存在'});
        }

        // 移除正确答案，防止作弊
        const quizWithoutAnswers = knowledgePoint.quiz.map(q => ({
            question: q.question,
            type: q.type,
            options: q.options,
        }));

        res.json({
            pointId: knowledgePoint.id,
            title: knowledgePoint.title,
            quiz: quizWithoutAnswers,
        });
    } catch (error) {
        console.error('获取测验题失败:', error);
        res.status(500).json({message: '获取测验题时发生错误'});
    }
});

// 提交测验答案
router.post('/submit', authMiddleware, async (req: Request, res: Response) => {
    try {
        const {pointId, answers} = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({message: '未授权'});
        }

        const knowledgePoint = await KnowledgePoint.findOne({id: pointId});
        if (!knowledgePoint) {
            return res.status(404).json({message: '知识点不存在'});
        }

        // 计算分数
        let correctCount = 0;
        const results = knowledgePoint.quiz.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);
            if (isCorrect) correctCount++;

            return {
                questionIndex: index,
                isCorrect,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
            };
        });

        const score = Math.round((correctCount / knowledgePoint.quiz.length) * 100);
        const passed = score >= 60; // 60分及格

        // 更新用户进度
        const progress = await UserProgress.findOneAndUpdate(
            {userId, pointId},
            {
                $inc: {quizAttempts: 1},
                $max: {bestScore: score},
                $set: {
                    status: passed ? 'completed' : 'in_progress',
                    lastAttemptAt: new Date(),
                },
            },
            {upsert: true, new: true}
        );

        res.json({
            score,
            passed,
            correctCount,
            totalQuestions: knowledgePoint.quiz.length,
            results,
            progress: {
                status: progress.status,
                attempts: progress.quizAttempts,
                bestScore: progress.bestScore,
            },
        });
    } catch (error) {
        console.error('提交测验失败:', error);
        res.status(500).json({message: '提交测验时发生错误'});
    }
});

export default router;


