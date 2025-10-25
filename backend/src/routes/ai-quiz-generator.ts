// backend/src/routes/ai-quiz-generator.ts
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { Types } from 'mongoose';
import {
  generatePersonalizedQuiz,
  generateQuickQuiz,
  generateSimilarQuestions,
  QuizGenerationRequest,
} from '../services/aiQuizGenerator';

const router = Router();

/**
 * POST /api/ai-quiz/generate
 * 生成个性化练习题
 */
router.post('/generate', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id as Types.ObjectId;

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const request: QuizGenerationRequest = {
      subject: req.body.subject,
      weakPoints: req.body.weakPoints || [],
      difficulty: req.body.difficulty || 3,
      count: Math.min(req.body.count || 10, 20), // 最多20题
      questionTypes: req.body.questionTypes,
    };

    // 验证必填字段
    if (!request.subject) {
      return res.status(400).json({
        success: false,
        message: '缺少必填字段: subject',
      });
    }

    const result = await generatePersonalizedQuiz(userId, request);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('生成AI题目失败:', error);
    res.status(500).json({
      success: false,
      message: 'AI出题失败',
      error: error.message,
    });
  }
});

/**
 * POST /api/ai-quiz/quick/:pointId
 * 快速生成知识点练习题
 */
router.post('/quick/:pointId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { pointId } = req.params;
    const count = Math.min(parseInt(req.body.count) || 5, 10);

    const questions = await generateQuickQuiz(pointId, count);

    res.json({
      success: true,
      questions,
    });
  } catch (error: any) {
    console.error('快速出题失败:', error);
    res.status(500).json({
      success: false,
      message: '快速出题失败',
      error: error.message,
    });
  }
});

/**
 * POST /api/ai-quiz/similar/:wrongQuestionId
 * 基于错题生成类似题目
 */
router.post('/similar/:wrongQuestionId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id as Types.ObjectId;
    const wrongQuestionId = new Types.ObjectId(req.params.wrongQuestionId);
    const count = Math.min(parseInt(req.body.count) || 3, 5);

    const questions = await generateSimilarQuestions(userId, wrongQuestionId, count);

    res.json({
      success: true,
      questions,
    });
  } catch (error: any) {
    console.error('生成相似题目失败:', error);
    res.status(500).json({
      success: false,
      message: '生成相似题目失败',
      error: error.message,
    });
  }
});

export default router;

