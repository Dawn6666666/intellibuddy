import express from 'express';
import Question from '../models/Question';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// 创建题目（教师）
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = (req.user as any)._id.toString();
    const userRole = (req.user as any).role;

    // 检查是否是教师
    if (userRole !== 'teacher') {
      return res.status(403).json({ error: '只有教师可以创建题目' });
    }

    const questionData = {
      ...req.body,
      teacherId: userId
    };

    const question = new Question(questionData);
    await question.save();

    res.status(201).json(question);
  } catch (error: any) {
    console.error('创建题目失败:', error);
    res.status(500).json({ error: '创建题目失败', details: error.message });
  }
});

// 获取教师的题目列表（带筛选和分页）
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const userId = (req.user as any)._id.toString();
    const userRole = (req.user as any).role;

    if (userRole !== 'teacher') {
      return res.status(403).json({ error: '只有教师可以访问' });
    }

    const {
      page = 1,
      limit = 20,
      type,
      difficulty,
      tag,
      search
    } = req.query;

    // 构建查询条件
    const query: any = { teacherId: userId };

    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [questions, total] = await Promise.all([
      Question.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Question.countDocuments(query)
    ]);

    res.json({
      questions,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error: any) {
    console.error('获取题目列表失败:', error);
    res.status(500).json({ error: '获取题目列表失败', details: error.message });
  }
});

// 获取单个题目详情（教师端 - 包含答案）
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)._id.toString();
    const userRole = (req.user as any).role;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ error: '题目不存在' });
    }

    // 教师可以查看自己的题目或公开题目
    if (userRole === 'teacher') {
      if (question.teacherId.toString() !== userId && !question.isPublic) {
        return res.status(403).json({ error: '无权访问此题目' });
      }
      return res.json(question);
    }

    // 学生只能看到不含答案的版本
    const safeQuestion = (question as any).toSafeObject();
    res.json(safeQuestion);
  } catch (error: any) {
    console.error('获取题目详情失败:', error);
    res.status(500).json({ error: '获取题目详情失败', details: error.message });
  }
});

// 更新题目（教师）
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)._id.toString();
    const userRole = (req.user as any).role;

    if (userRole !== 'teacher') {
      return res.status(403).json({ error: '只有教师可以编辑题目' });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ error: '题目不存在' });
    }

    if (question.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '只能编辑自己创建的题目' });
    }

    // 更新题目
    Object.assign(question, req.body);
    await question.save();

    res.json(question);
  } catch (error: any) {
    console.error('更新题目失败:', error);
    res.status(500).json({ error: '更新题目失败', details: error.message });
  }
});

// 删除题目（教师）
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)._id.toString();
    const userRole = (req.user as any).role;

    if (userRole !== 'teacher') {
      return res.status(403).json({ error: '只有教师可以删除题目' });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ error: '题目不存在' });
    }

    if (question.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '只能删除自己创建的题目' });
    }

    // 检查题目是否被使用
    if (question.usageCount > 0) {
      return res.status(400).json({ 
        error: '该题目已被使用，无法删除',
        usageCount: question.usageCount
      });
    }

    await Question.findByIdAndDelete(id);

    res.json({ message: '题目删除成功' });
  } catch (error: any) {
    console.error('删除题目失败:', error);
    res.status(500).json({ error: '删除题目失败', details: error.message });
  }
});

// 批量获取题目（用于作业显示）
router.post('/batch', authMiddleware, async (req, res) => {
  try {
    const { questionIds } = req.body;
    const userRole = (req.user as any).role;

    if (!Array.isArray(questionIds)) {
      return res.status(400).json({ error: 'questionIds 必须是数组' });
    }

    const questions = await Question.find({ _id: { $in: questionIds } });

    // 如果是学生，返回不含答案的版本
    if (userRole === 'student') {
      const safeQuestions = questions.map(q => (q as any).toSafeObject());
      return res.json(safeQuestions);
    }

    res.json(questions);
  } catch (error: any) {
    console.error('批量获取题目失败:', error);
    res.status(500).json({ error: '批量获取题目失败', details: error.message });
  }
});

// 获取公开题库（教师）
router.get('/public/list', authMiddleware, async (req, res) => {
  try {
    const userRole = (req.user as any).role;

    if (userRole !== 'teacher') {
      return res.status(403).json({ error: '只有教师可以访问题库' });
    }

    const {
      page = 1,
      limit = 20,
      type,
      difficulty,
      tag,
      search
    } = req.query;

    const query: any = { isPublic: true };

    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [questions, total] = await Promise.all([
      Question.find(query)
        .sort({ usageCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('teacherId', 'name')
        .lean(),
      Question.countDocuments(query)
    ]);

    res.json({
      questions,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error: any) {
    console.error('获取公开题库失败:', error);
    res.status(500).json({ error: '获取公开题库失败', details: error.message });
  }
});

// 复制题目到自己的题库
router.post('/:id/copy', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)._id.toString();
    const userRole = (req.user as any).role;

    if (userRole !== 'teacher') {
      return res.status(403).json({ error: '只有教师可以复制题目' });
    }

    const originalQuestion = await Question.findById(id);

    if (!originalQuestion) {
      return res.status(404).json({ error: '题目不存在' });
    }

    if (!originalQuestion.isPublic && originalQuestion.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权复制此题目' });
    }

    // 创建副本
    const newQuestion = new Question({
      ...originalQuestion.toObject(),
      _id: undefined,
      teacherId: userId,
      isPublic: false,
      usageCount: 0,
      createdAt: undefined,
      updatedAt: undefined
    });

    await newQuestion.save();

    res.status(201).json(newQuestion);
  } catch (error: any) {
    console.error('复制题目失败:', error);
    res.status(500).json({ error: '复制题目失败', details: error.message });
  }
});

export default router;

