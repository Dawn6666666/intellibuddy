// backend/src/routes/assessment.ts
import {Router, Response, Request} from 'express';
import {authMiddleware} from './auth';
import Assessment from '../models/Assessment';
import KnowledgePoint from '../models/KnowledgePoint';

const router = Router();

// 获取初始评估题目
router.post('/start', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;

        // 检查用户是否已经完成评估
        const existingAssessment = await Assessment.findOne({userId});
        if (existingAssessment) {
            return res.status(400).json({
                message: '您已经完成了初始评估',
                assessment: existingAssessment,
            });
        }

        // 从各个学科领域选取题目（每个领域2-3题）
        const subjects = ['编程基础', '数据结构', '算法', '计算机网络', '操作系统'];
        const assessmentQuestions = [];

        for (const subject of subjects) {
            const points = await KnowledgePoint.find({
                subject,
                'quiz.0': {$exists: true}, // 确保有测验题
            }).limit(3);

            for (const point of points) {
                // 每个知识点选1-2道题
                const selectedQuestions = point.quiz.slice(0, 2).map(q => ({
                    pointId: point.id,
                    subject: point.subject,
                    difficulty: point.difficulty,
                    question: q.question,
                    type: q.type,
                    options: q.options,
                    // 不发送正确答案
                }));
                assessmentQuestions.push(...selectedQuestions);
            }
        }

        // 打乱题目顺序
        assessmentQuestions.sort(() => Math.random() - 0.5);

        // 限制总题数为15题
        const finalQuestions = assessmentQuestions.slice(0, 15);

        res.json({
            totalQuestions: finalQuestions.length,
            questions: finalQuestions,
        });
    } catch (error) {
        console.error('开始评估失败:', error);
        res.status(500).json({message: '开始评估时发生错误'});
    }
});

// 提交评估答案并生成报告
router.post('/submit', authMiddleware, async (req: Request, res: Response) => {
    try {
        const {answers} = req.body; // answers: [{pointId, questionIndex, answer}]
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({message: '未授权'});
        }

        // 计算分数和能力画像
        const subjectScores: Record<string, {correct: number; total: number}> = {};
        let totalCorrect = 0;

        for (const answer of answers) {
            const point = await KnowledgePoint.findOne({id: answer.pointId});
            if (!point) continue;

            const question = point.quiz[answer.questionIndex];
            if (!question) continue;

            const isCorrect = JSON.stringify(answer.answer) === JSON.stringify(question.correctAnswer);
            if (isCorrect) totalCorrect++;

            // 统计各学科得分
            if (!subjectScores[point.subject]) {
                subjectScores[point.subject] = {correct: 0, total: 0};
            }
            subjectScores[point.subject].total++;
            if (isCorrect) subjectScores[point.subject].correct++;
        }

        // 生成能力画像
        const skillProfile = Object.entries(subjectScores).map(([subject, scores]) => ({
            subject,
            level: Math.round((scores.correct / scores.total) * 100),
        }));

        // 识别弱项（得分率<60%的学科）
        const weaknesses = skillProfile
            .filter(skill => skill.level < 60)
            .map(skill => {
                // 找到该学科的推荐知识点
                const recommendedPoints: string[] = [];
                // 这里简化处理，实际应该根据具体错题分析
                return {
                    subject: skill.subject,
                    reason: `在${skill.subject}领域的测评中得分率为${skill.level}%，建议加强学习。`,
                    recommendedPoints,
                };
            });

        const score = Math.round((totalCorrect / answers.length) * 100);

        // 保存评估结果
        const assessment = new Assessment({
            userId,
            totalQuestions: answers.length,
            correctAnswers: totalCorrect,
            score,
            skillProfile,
            weaknesses,
            recommendedPath: [], // 推荐路径将由learning-path API生成
        });

        await assessment.save();

        res.json({
            score,
            correctAnswers: totalCorrect,
            totalQuestions: answers.length,
            skillProfile,
            weaknesses,
            message: '评估完成！我们已为您生成专属学习路径。',
        });
    } catch (error) {
        console.error('提交评估失败:', error);
        res.status(500).json({message: '提交评估时发生错误'});
    }
});

// 获取评估结果
router.get('/result', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const assessment = await Assessment.findOne({userId});

        if (!assessment) {
            return res.status(404).json({message: '未找到评估结果，请先完成初始评估'});
        }

        res.json(assessment);
    } catch (error) {
        console.error('获取评估结果失败:', error);
        res.status(500).json({message: '获取评估结果时发生错误'});
    }
});

export default router;


