import express from 'express';
import Assignment from '../models/Assignment';
import Class from '../models/Class';
import User from '../models/User';
import { Notification } from '../models/Notification';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// 创建作业（教师）
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      classId,
      knowledgePoints,
      type,
      difficulty,
      totalScore,
      passingScore,
      questions,
      dueDate,
      startDate,
      duration,
      settings
    } = req.body;
    const userId = (req.user as any)._id.toString();

    // 检查班级是否存在且用户是教师
    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    if (classInfo.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '只有班级教师可以创建作业' });
    }

    const assignment = new Assignment({
      title,
      description,
      classId,
      teacherId: userId,
      knowledgePoints: knowledgePoints || [],
      type: type || 'homework',
      difficulty: difficulty || 'medium',
      totalScore: totalScore || 100,
      passingScore: passingScore || 60,
      questions: questions || [],
      dueDate,
      startDate,
      duration,
      settings: {
        allowRetake: true, // 默认允许重新提交
        showAnswers: true,
        showScore: true,
        randomOrder: false,
        ...settings // 允许前端覆盖默认值
      },
      submissions: []
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    console.error('创建作业失败:', error);
    res.status(500).json({ error: '创建作业失败' });
  }
});

// 获取班级作业列表
router.get('/class/:classId', authMiddleware, async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = (req.user as any)._id.toString();
    const { status } = req.query;

    // 检查权限
    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    const isTeacher = classInfo.teacherId.toString() === userId;
    const isStudent = classInfo.students.some(
      s => s.userId.toString() === userId && s.status === 'active'
    );

    if (!isTeacher && !isStudent) {
      return res.status(403).json({ error: '无权访问' });
    }

    // 构建查询
    const query: any = { classId };
    if (status) {
      query.status = status;
    } else if (isStudent) {
      // 学生只能看到已发布的作业
      query.status = 'published';
    } else {
      // 教师默认不显示归档的作业
      query.status = { $ne: 'archived' };
    }

    const assignments = await Assignment.find(query)
      .sort({ createdAt: -1 })
      .select('-submissions.answers'); // 不返回答案详情

    // 如果是学生，添加提交状态
    if (isStudent) {
      const assignmentsWithStatus = assignments.map(assignment => {
        const submission = assignment.submissions.find(
          s => s.userId.toString() === userId
        );
        return {
          ...assignment.toObject(),
          mySubmission: submission ? {
            submittedAt: submission.submittedAt,
            score: submission.score,
            attempt: submission.attempt,
            status: submission.status
          } : null,
          submissionCount: assignment.submissions.length
        };
      });
      return res.json(assignmentsWithStatus);
    }

    res.json(assignments);
  } catch (error) {
    console.error('获取作业列表失败:', error);
    res.status(500).json({ error: '获取作业列表失败' });
  }
});

// 获取作业详情
router.get('/:assignmentId', authMiddleware, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = (req.user as any)._id.toString();

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: '作业不存在' });
    }

    // 检查权限
    const classInfo = await Class.findById(assignment.classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    const isTeacher = classInfo.teacherId.toString() === userId;
    const isStudent = classInfo.students.some(
      s => s.userId.toString() === userId && s.status === 'active'
    );

    if (!isTeacher && !isStudent) {
      return res.status(403).json({ error: '无权访问' });
    }

    // 学生不能看草稿
    if (isStudent && assignment.status === 'draft') {
      return res.status(403).json({ error: '作业未发布' });
    }

    res.json(assignment);
  } catch (error) {
    console.error('获取作业详情失败:', error);
    res.status(500).json({ error: '获取作业详情失败' });
  }
});

// 更新作业（教师）
router.put('/:assignmentId', authMiddleware, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = (req.user as any)._id.toString();
    const updates = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: '作业不存在' });
    }

    // 检查权限
    if (assignment.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权修改此作业' });
    }

    // 更新允许的字段
    const allowedFields = [
      'title', 'description', 'knowledgePoints', 'type', 'difficulty',
      'totalScore', 'passingScore', 'questions', 'dueDate', 'startDate',
      'duration', 'settings'
    ];
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        (assignment as any)[field] = updates[field];
      }
    });

    await assignment.save();
    res.json(assignment);
  } catch (error) {
    console.error('更新作业失败:', error);
    res.status(500).json({ error: '更新作业失败' });
  }
});

// 发布作业（教师）
router.post('/:assignmentId/publish', authMiddleware, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = (req.user as any)._id.toString();

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: '作业不存在' });
    }

    if (assignment.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权操作' });
    }

    if (assignment.questions.length === 0) {
      return res.status(400).json({ error: '作业至少需要一道题目' });
    }

    assignment.status = 'published';
    await assignment.save();

    // 创建通知 - 向班级所有学生发送作业通知
    try {
      const classDoc = await Class.findById(assignment.classId);
      if (!classDoc) {
        console.warn('⚠ 未找到班级，无法发送通知');
      } else {
        const activeStudents = classDoc.students
          .filter((s: any) => s.status === 'active')
          .map((s: any) => s.userId);

        console.log(`📢 准备向 ${activeStudents.length} 名学生发送作业通知`);

        if (activeStudents.length === 0) {
          console.warn('⚠ 班级中没有活跃学生');
        } else {
          const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
          const dueDateStr = dueDate ? dueDate.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }) : '无截止时间';

          const notifications = activeStudents.map((studentId: any) => ({
            recipientId: studentId,
            recipientType: 'student' as const,
            senderId: userId,
            type: 'assignment' as const,
            title: '新作业发布',
            content: `${classDoc.name} 发布了新作业：${assignment.title}`,
            priority: 'normal' as const,
            relatedId: assignment._id,
            relatedType: 'assignment' as const,
            actionUrl: `/app/my-classes`,
            metadata: {
              assignmentTitle: assignment.title,
              className: classDoc.name,
              dueDate: dueDate,
              dueDateStr: dueDateStr,
              totalScore: assignment.totalScore
            },
            read: false
          }));

          const created = await Notification.insertMany(notifications);
          console.log(`✅ 成功创建 ${created.length} 条通知记录`);
          console.log(`📧 已向以下学生ID发送通知: ${activeStudents.slice(0, 3).join(', ')}${activeStudents.length > 3 ? '...' : ''}`);
        }
      }
    } catch (notifError) {
      console.error('❌ 创建通知失败:', notifError);
      // 不影响作业发布的主流程
    }

    res.json({ message: '作业已发布', assignment });
  } catch (error) {
    console.error('发布作业失败:', error);
    res.status(500).json({ error: '发布作业失败' });
  }
});

// 提交作业（学生）
router.post('/:assignmentId/submit', authMiddleware, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { answers, timeSpent } = req.body;
    const userId = (req.user as any)._id.toString();

    const assignment = await Assignment.findById(assignmentId)
      .populate('questions.questionId');
    if (!assignment) {
      return res.status(404).json({ error: '作业不存在' });
    }

    // 检查作业状态
    if (assignment.status !== 'published') {
      return res.status(400).json({ error: '作业未开放提交' });
    }

    // 检查是否在截止时间内
    if (assignment.dueDate && new Date() > assignment.dueDate) {
      return res.status(400).json({ error: '作业已截止' });
    }

    // 检查是否在开始时间后
    if (assignment.startDate && new Date() < assignment.startDate) {
      return res.status(400).json({ error: '作业尚未开始' });
    }

    // 检查学生是否在班级中
    const classInfo = await Class.findById(assignment.classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    const isStudent = classInfo.students.some(
      s => s.userId.toString() === userId && s.status === 'active'
    );
    if (!isStudent) {
      return res.status(403).json({ error: '您不在此班级中' });
    }

    // 检查提交次数
    const previousSubmissions = assignment.submissions.filter(
      s => s.userId.toString() === userId
    );
    
    if (!assignment.settings.allowRetake && previousSubmissions.length > 0) {
      return res.status(400).json({ error: '不允许重复提交' });
    }

    if (assignment.settings.maxAttempts && 
        previousSubmissions.length >= assignment.settings.maxAttempts) {
      return res.status(400).json({ error: '已达到最大提交次数' });
    }

    // 计算分数 - 实现正确的自动批改逻辑
    let score = 0;
    const processedAnswers = answers.map((answer: any, index: number) => {
      // 通过 questionId 查找对应的题目，而不是用索引
      const assignmentQuestion = assignment.questions.find(
        (q: any) => q.questionId._id.toString() === answer.questionId.toString()
      );
      
      if (!assignmentQuestion) {
        return {
          questionIndex: index,
          questionId: answer.questionId,
          answer: answer.answer,
          isCorrect: false,
          score: 0
        };
      }

      // 获取题目详细信息
      const question = assignmentQuestion.questionId as any;
      const correctAnswer = question.correctAnswer;
      const studentAnswer = answer.answer;
      
      let isCorrect = false;
      let earnedScore = 0;

      // 根据题型判断答案正确性
      if (question.type === 'multiple') {
        // 多选题：需要完全匹配（排序后比较）
        const studentAns = Array.isArray(studentAnswer) 
          ? [...studentAnswer].sort() 
          : [];
        const correctAns = Array.isArray(correctAnswer)
          ? [...correctAnswer].sort()
          : [];
        isCorrect = JSON.stringify(studentAns) === JSON.stringify(correctAns);
      } else if (question.type === 'single' || question.type === 'truefalse') {
        // 单选题和判断题：直接比较
        console.log(`[判断题调试] 题目: ${question.title}`);
        console.log(`[判断题调试] 学生答案:`, studentAnswer, `类型: ${typeof studentAnswer}`);
        console.log(`[判断题调试] 正确答案:`, correctAnswer, `类型: ${typeof correctAnswer}`);
        isCorrect = studentAnswer === correctAnswer;
        console.log(`[判断题调试] 是否正确:`, isCorrect);
      } else if (question.type === 'short' || question.type === 'essay') {
        // 简答题和论述题：不自动批改，需要教师手动批改
        isCorrect = false; // 默认不给分，等待教师批改
      }

      // 如果答对，给满分
      if (isCorrect) {
        earnedScore = assignmentQuestion.score;
        score += earnedScore;
      }

      return {
        questionIndex: index,
        questionId: answer.questionId,
        answer: studentAnswer,
        isCorrect,
        score: earnedScore
      };
    });

    // 获取用户名
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 判断是否迟交
    const isLate = assignment.dueDate && new Date() > assignment.dueDate;
    const submissionStatus = isLate ? 'late' : 'submitted';

    // 添加提交记录（使用处理后的答案，包含批改结果）
    assignment.submissions.push({
      userId: user._id,
      userName: user.username,
      submittedAt: new Date(),
      score,
      answers: processedAnswers,
      timeSpent: timeSpent || 0,
      attempt: previousSubmissions.length + 1,
      status: submissionStatus
    });

    await assignment.save();

    res.json({
      message: '作业提交成功',
      score,
      totalScore: assignment.totalScore,
      passed: score >= assignment.passingScore,
      attempt: previousSubmissions.length + 1
    });
  } catch (error) {
    console.error('提交作业失败:', error);
    res.status(500).json({ error: '提交作业失败' });
  }
});

// 获取学生自己的提交详情
router.get('/:assignmentId/my-submission', authMiddleware, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = (req.user as any)._id.toString();
    const userRole = (req.user as any).role;

    // 只允许学生访问
    if (userRole !== 'student') {
      return res.status(403).json({ error: '只有学生可以查看自己的提交' });
    }

    const assignment = await Assignment.findById(assignmentId)
      .populate('questions.questionId');
    
    if (!assignment) {
      return res.status(404).json({ error: '作业不存在' });
    }

    // 查找学生的提交记录
    const mySubmissions = assignment.submissions.filter(
      s => s.userId.toString() === userId
    ).sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());

    if (mySubmissions.length === 0) {
      return res.status(404).json({ error: '还没有提交记录' });
    }

    // 返回所有提交记录（最新的在前面）
    const submissionsData = mySubmissions.map((submission, index) => {
      // 计算每道题的得分 - 通过 questionId 匹配答案，而不是索引
      const questionResults = assignment.questions.map((q: any, qIndex: number) => {
        const question = q.questionId;
        // 通过 questionId 找到对应的答案
        const answer = submission.answers.find(
          (ans: any) => ans.questionId?.toString() === question?._id?.toString()
        );
        
        return {
          questionIndex: qIndex + 1,
          questionTitle: question?.title || '',
          questionType: question?.type || '',
          score: answer?.score || 0,
          maxScore: q.score,
          isCorrect: answer?.isCorrect || false,
          userAnswer: assignment.settings.showAnswers ? answer?.answer : undefined,
          correctAnswer: assignment.settings.showAnswers ? question?.correctAnswer : undefined
        };
      });

      return {
        attempt: submission.attempt,
        submittedAt: submission.submittedAt,
        score: submission.score,
        totalScore: assignment.totalScore,
        timeSpent: submission.timeSpent,
        status: submission.status,
        isPassed: submission.score >= assignment.passingScore,
        isLatest: index === 0,
        questionResults: assignment.settings.showAnswers ? questionResults : undefined
      };
    });

    res.json({
      assignmentId,
      assignmentTitle: assignment.title,
      assignmentType: assignment.type,
      passingScore: assignment.passingScore,
      totalScore: assignment.totalScore,
      allowRetake: assignment.settings.allowRetake,
      maxAttempts: assignment.settings.maxAttempts,
      showAnswers: assignment.settings.showAnswers,
      showScore: assignment.settings.showScore,
      submissions: submissionsData
    });
  } catch (error) {
    console.error('获取提交详情失败:', error);
    res.status(500).json({ error: '获取提交详情失败' });
  }
});

// 获取作业提交统计（教师）
router.get('/:assignmentId/submissions/stats', authMiddleware, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = (req.user as any)._id.toString();

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: '作业不存在' });
    }

    // 检查权限
    if (assignment.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权访问' });
    }

    // 获取班级信息
    const classInfo = await Class.findById(assignment.classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    const activeStudents = classInfo.students.filter(s => s.status === 'active');
    const totalStudents = activeStudents.length;
    const submittedCount = new Set(
      assignment.submissions.map(s => s.userId.toString())
    ).size;
    const notSubmittedCount = totalStudents - submittedCount;

    // 计算平均分
    const scores = assignment.submissions.map(s => s.score);
    const avgScore = scores.length > 0
      ? scores.reduce((sum, s) => sum + s, 0) / scores.length
      : 0;

    // 及格率
    const passedCount = scores.filter(s => s >= assignment.passingScore).length;
    const passRate = submittedCount > 0 ? (passedCount / submittedCount) * 100 : 0;

    // 分数分布
    const scoreRanges = {
      excellent: scores.filter(s => s >= 90).length, // 优秀
      good: scores.filter(s => s >= 80 && s < 90).length, // 良好
      pass: scores.filter(s => s >= 60 && s < 80).length, // 及格
      fail: scores.filter(s => s < 60).length // 不及格
    };

    res.json({
      assignmentId,
      title: assignment.title,
      totalStudents,
      submittedCount,
      notSubmittedCount,
      submissionRate: totalStudents > 0 ? (submittedCount / totalStudents) * 100 : 0,
      avgScore: Math.round(avgScore * 100) / 100,
      passRate: Math.round(passRate * 100) / 100,
      scoreRanges,
      submissions: assignment.submissions.map((s: any) => ({
        _id: s._id,
        userId: s.userId,
        userName: s.userName,
        submittedAt: s.submittedAt,
        score: s.score,
        attempt: s.attempt,
        status: s.status,
        timeSpent: s.timeSpent
      }))
    });
  } catch (error) {
    console.error('获取提交统计失败:', error);
    res.status(500).json({ error: '获取提交统计失败' });
  }
});

// 获取单个提交详情（教师）
router.get('/submission/:submissionId', authMiddleware, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = (req.user as any)._id.toString();

    // 查找包含此提交的作业
    const assignment = await Assignment.findOne({
      'submissions._id': submissionId
    });

    if (!assignment) {
      return res.status(404).json({ error: '提交记录不存在' });
    }

    // 检查权限（仅教师可查看）
    if (assignment.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权访问' });
    }

    // 找到具体的提交记录
    const submission = assignment.submissions.find(
      (s: any) => s._id.toString() === submissionId
    ) as any;

    if (!submission) {
      return res.status(404).json({ error: '提交记录不存在' });
    }

    // 合并题目和学生答案，方便前端显示
    const questionsWithAnswers = assignment.questions.map((question: any, index: number) => {
      const studentAnswer = submission.answers.find((a: any) => a.questionIndex === index);
      return {
        ...question.toObject(),
        studentAnswer: studentAnswer?.answer,
        correctAnswer: question.correctAnswer
      };
    });

    // 返回详细信息
    res.json({
      _id: submission._id, // 添加_id字段，保持与前端一致
      submissionId: submission._id,
      studentId: submission.userId,
      studentName: submission.userName,
      submittedAt: submission.submittedAt,
      score: submission.score,
      status: submission.status,
      attempt: submission.attempt,
      timeSpent: submission.timeSpent,
      feedback: submission.feedback,
      answers: submission.answers,
      assignmentId: assignment._id, // 添加assignmentId字段
      questions: questionsWithAnswers, // 添加合并后的题目数组
      assignment: {
        id: assignment._id,
        title: assignment.title,
        questions: assignment.questions
      }
    });
  } catch (error) {
    console.error('获取提交详情失败:', error);
    res.status(500).json({ error: '获取提交详情失败' });
  }
});

// 批改作业（教师）
router.post('/submission/:submissionId/grade', authMiddleware, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { score, feedback } = req.body;
    const userId = (req.user as any)._id.toString();

    // 验证输入
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({ error: '分数必须在0-100之间' });
    }

    // 查找包含此提交的作业
    const assignment = await Assignment.findOne({
      'submissions._id': submissionId
    });

    if (!assignment) {
      return res.status(404).json({ error: '提交记录不存在' });
    }

    // 检查权限（仅教师可批改）
    if (assignment.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权批改此作业' });
    }

    // 找到并更新提交记录
    const submission = assignment.submissions.find(
      (s: any) => s._id.toString() === submissionId
    ) as any;

    if (!submission) {
      return res.status(404).json({ error: '提交记录不存在' });
    }

    // 更新分数和评语
    submission.score = score;
    submission.feedback = feedback || '';
    submission.status = 'graded';

    await assignment.save();

    res.json({
      message: '批改成功',
      submission: {
        id: submission._id,
        score: submission.score,
        feedback: submission.feedback,
        status: submission.status
      }
    });
  } catch (error) {
    console.error('批改作业失败:', error);
    res.status(500).json({ error: '批改作业失败' });
  }
});

// 删除作业（教师）
router.delete('/:assignmentId', authMiddleware, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = (req.user as any)._id.toString();

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: '作业不存在' });
    }

    if (assignment.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权删除此作业' });
    }

    // 如果有提交记录，归档而不是删除
    if (assignment.submissions.length > 0) {
      assignment.status = 'archived';
      await assignment.save();
      return res.json({ message: '作业已归档' });
    }

    await Assignment.findByIdAndDelete(assignmentId);
    res.json({ message: '作业已删除' });
  } catch (error) {
    console.error('删除作业失败:', error);
    res.status(500).json({ error: '删除作业失败' });
  }
});

export default router;

