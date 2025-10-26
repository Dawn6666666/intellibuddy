import express from 'express';
import { authMiddleware } from '../middleware/auth';
import Class from '../models/Class';
import User from '../models/User';
import StudySession from '../models/StudySession';
import UserProgress from '../models/UserProgress';
import WrongQuestion from '../models/WrongQuestion';
import Assignment from '../models/Assignment';

const router = express.Router();

// 获取班级整体数据分析
router.get('/class/:classId/overview', authMiddleware, async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = (req.user as any)._id.toString();

    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    // 检查权限
    if (classInfo.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权访问' });
    }

    const activeStudents = classInfo.students.filter(s => s.status === 'active');
    const studentIds = activeStudents.map(s => s.userId);

    // 获取班级学习总时长
    const totalDuration = await StudySession.aggregate([
      { $match: { userId: { $in: studentIds } } },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]).then(result => result[0]?.total || 0);

    // 获取班级知识点掌握情况
    const progressData = await UserProgress.find({ userId: { $in: studentIds } });
    const totalKnowledge = progressData.length;
    const masteredKnowledge = progressData.filter(p => p.bestScore >= 80).length;

    // 获取作业统计
    const assignments = await Assignment.find({ classId });
    const totalAssignments = assignments.length;
    const completedAssignments = assignments.filter(a => {
      const submittedStudents = new Set(a.submissions.map((s: any) => s.userId.toString()));
      return submittedStudents.size === studentIds.length;
    }).length;

    // 获取错题统计
    const totalWrongQuestions = await WrongQuestion.countDocuments({ 
      userId: { $in: studentIds } 
    });

    // 获取活跃学生数（最近7天）
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeSessions = await StudySession.distinct('userId', {
      userId: { $in: studentIds },
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      classId,
      className: classInfo.name,
      overview: {
        totalStudents: activeStudents.length,
        activeStudents: activeSessions.length,
        totalDuration: Math.round(totalDuration),
        avgDurationPerStudent: Math.round(totalDuration / activeStudents.length) || 0,
        totalKnowledge,
        masteredKnowledge,
        masteryRate: totalKnowledge > 0 ? Math.round((masteredKnowledge / totalKnowledge) * 100) : 0,
        totalAssignments,
        completedAssignments,
        assignmentCompletionRate: totalAssignments > 0 
          ? Math.round((completedAssignments / totalAssignments) * 100) 
          : 0,
        totalWrongQuestions
      }
    });
  } catch (error) {
    console.error('获取班级概览失败:', error);
    res.status(500).json({ error: '获取班级概览失败' });
  }
});

// 获取学生排名
router.get('/class/:classId/student-rankings', authMiddleware, async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = (req.user as any)._id.toString();
    const { sortBy = 'score' } = req.query; // score, studyTime, progress

    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    if (classInfo.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权访问' });
    }

    const activeStudents = classInfo.students.filter(s => s.status === 'active');
    
    const studentRankings = await Promise.all(
      activeStudents.map(async (student) => {
        const studentId = student.userId;

        // 学习时长
        const sessions = await StudySession.find({ userId: studentId });
        const totalTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

        // 知识点掌握情况
        const userProgress = await UserProgress.find({ userId: studentId });
        const masteredCount = userProgress.filter(up => up.bestScore >= 80).length;
        const totalKnowledge = userProgress.length;
        const progressRate = totalKnowledge > 0 
          ? Math.round((masteredCount / totalKnowledge) * 100) 
          : 0;

        // 平均分数
        const avgScore = userProgress.length > 0
          ? Math.round(userProgress.reduce((sum, up) => sum + up.bestScore, 0) / userProgress.length)
          : 0;

        // 作业完成情况
        const assignments = await Assignment.find({ classId });
        const submittedAssignments = assignments.filter(a => 
          a.submissions.some((s: any) => s.userId.toString() === studentId.toString())
        ).length;
        const assignmentCompletionRate = assignments.length > 0
          ? Math.round((submittedAssignments / assignments.length) * 100)
          : 0;

        // 错题数
        const wrongQuestionsCount = await WrongQuestion.countDocuments({ userId: studentId });

        // 最后活跃时间
        const lastActive = sessions.length > 0 
          ? sessions[sessions.length - 1].createdAt 
          : student.joinedAt;

        return {
          userId: studentId,
          userName: student.userName,
          totalTime,
          masteredCount,
          totalKnowledge,
          progressRate,
          avgScore,
          assignmentCompletionRate,
          wrongQuestionsCount,
          lastActive
        };
      })
    );

    // 根据sortBy排序
    studentRankings.sort((a, b) => {
      switch (sortBy) {
        case 'studyTime':
          return b.totalTime - a.totalTime;
        case 'progress':
          return b.progressRate - a.progressRate;
        case 'score':
        default:
          return b.avgScore - a.avgScore;
      }
    });

    // 添加排名
    const rankedStudents = studentRankings.map((student, index) => ({
      ...student,
      rank: index + 1
    }));

    res.json({
      classId,
      sortBy,
      students: rankedStudents
    });
  } catch (error) {
    console.error('获取学生排名失败:', error);
    res.status(500).json({ error: '获取学生排名失败' });
  }
});

// 获取薄弱知识点分析
router.get('/class/:classId/weak-points', authMiddleware, async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = (req.user as any)._id.toString();

    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    if (classInfo.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权访问' });
    }

    const activeStudents = classInfo.students.filter(s => s.status === 'active');
    const studentIds = activeStudents.map(s => s.userId);

    // 获取所有学生的知识点掌握情况
    const progressData = await UserProgress.find({ 
      userId: { $in: studentIds } 
    }).populate('pointId', 'title subject difficulty');

    // 按知识点分组统计
    const knowledgePointStats: { [key: string]: any } = {};
    
    progressData.forEach(progress => {
      const pointId = progress.pointId?._id?.toString();
      if (!pointId) return;

      const point = progress.pointId as any;
      
      if (!knowledgePointStats[pointId]) {
        knowledgePointStats[pointId] = {
          pointId,
          title: point.title || '未知知识点',
          subject: point.subject || '未分类',
          difficulty: point.difficulty || 'medium',
          totalStudents: 0,
          masteredStudents: 0,
          avgScore: 0,
          totalScore: 0,
          lowScoreStudents: []
        };
      }

      knowledgePointStats[pointId].totalStudents++;
      knowledgePointStats[pointId].totalScore += progress.bestScore;
      
      if (progress.bestScore >= 80) {
        knowledgePointStats[pointId].masteredStudents++;
      }

      if (progress.bestScore < 60) {
        knowledgePointStats[pointId].lowScoreStudents.push({
          userId: progress.userId,
          score: progress.bestScore
        });
      }
    });

    // 计算平均分和掌握率
    const weakPointsArray = Object.values(knowledgePointStats).map((stats: any) => {
      stats.avgScore = Math.round(stats.totalScore / stats.totalStudents);
      stats.masteryRate = Math.round((stats.masteredStudents / stats.totalStudents) * 100);
      stats.lowScoreCount = stats.lowScoreStudents.length;
      delete stats.totalScore;
      delete stats.lowScoreStudents; // 删除详细的学生列表，只保留数量
      return stats;
    });

    // 按平均分排序，找出薄弱知识点（平均分<70或掌握率<50%）
    const weakPoints = weakPointsArray
      .filter(point => point.avgScore < 70 || point.masteryRate < 50)
      .sort((a, b) => a.avgScore - b.avgScore)
      .slice(0, 20); // 返回最薄弱的20个知识点

    // 按学科分组统计
    const bySubject: { [key: string]: any } = {};
    weakPoints.forEach(point => {
      const subject = point.subject;
      if (!bySubject[subject]) {
        bySubject[subject] = {
          subject,
          weakPointCount: 0,
          avgScore: 0,
          totalScore: 0
        };
      }
      bySubject[subject].weakPointCount++;
      bySubject[subject].totalScore += point.avgScore;
    });

    Object.values(bySubject).forEach((stats: any) => {
      stats.avgScore = Math.round(stats.totalScore / stats.weakPointCount);
      delete stats.totalScore;
    });

    res.json({
      classId,
      weakPoints,
      bySubject: Object.values(bySubject),
      summary: {
        totalWeakPoints: weakPoints.length,
        avgWeakPointScore: weakPoints.length > 0
          ? Math.round(weakPoints.reduce((sum, p) => sum + p.avgScore, 0) / weakPoints.length)
          : 0
      }
    });
  } catch (error) {
    console.error('获取薄弱知识点失败:', error);
    res.status(500).json({ error: '获取薄弱知识点失败' });
  }
});

// 获取班级学习趋势
router.get('/class/:classId/learning-trend', authMiddleware, async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = (req.user as any)._id.toString();
    const { period = '30d' } = req.query;

    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    if (classInfo.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权访问' });
    }

    const activeStudents = classInfo.students.filter(s => s.status === 'active');
    const studentIds = activeStudents.map(s => s.userId);

    // 计算时间范围
    const now = new Date();
    let startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // 获取学习会话
    const sessions = await StudySession.find({
      userId: { $in: studentIds },
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    // 按日期分组统计
    const dailyStats: { [key: string]: any } = {};
    sessions.forEach(session => {
      const date = session.createdAt.toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = {
          date,
          totalDuration: 0,
          sessionCount: 0,
          activeStudents: new Set()
        };
      }
      dailyStats[date].totalDuration += session.duration || 0;
      dailyStats[date].sessionCount++;
      dailyStats[date].activeStudents.add(session.userId.toString());
    });

    // 转换为数组
    const trendData = Object.values(dailyStats).map((stats: any) => ({
      date: stats.date,
      totalDuration: stats.totalDuration,
      avgDuration: Math.round(stats.totalDuration / stats.activeStudents.size) || 0,
      sessionCount: stats.sessionCount,
      activeStudents: stats.activeStudents.size
    }));

    res.json({
      classId,
      period,
      trend: trendData
    });
  } catch (error) {
    console.error('获取学习趋势失败:', error);
    res.status(500).json({ error: '获取学习趋势失败' });
  }
});

// 获取作业统计分析
router.get('/class/:classId/assignment-analytics', authMiddleware, async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = (req.user as any)._id.toString();

    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    if (classInfo.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权访问' });
    }

    const assignments = await Assignment.find({ classId });
    const activeStudents = classInfo.students.filter(s => s.status === 'active');
    const totalStudents = activeStudents.length;

    const assignmentStats = assignments.map(assignment => {
      const submittedCount = new Set(
        assignment.submissions.map((s: any) => s.userId.toString())
      ).size;

      const scores = assignment.submissions.map((s: any) => s.score);
      const avgScore = scores.length > 0
        ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
        : 0;

      const passedCount = scores.filter(s => s >= assignment.passingScore).length;

      return {
        assignmentId: assignment._id,
        title: assignment.title,
        type: assignment.type,
        totalStudents,
        submittedCount,
        submissionRate: totalStudents > 0 
          ? Math.round((submittedCount / totalStudents) * 100) 
          : 0,
        avgScore,
        passRate: submittedCount > 0 
          ? Math.round((passedCount / submittedCount) * 100) 
          : 0,
        dueDate: assignment.dueDate
      };
    });

    // 按类型统计
    const byType: { [key: string]: any } = {};
    assignmentStats.forEach(stat => {
      const type = stat.type || 'homework';
      if (!byType[type]) {
        byType[type] = {
          type,
          count: 0,
          avgSubmissionRate: 0,
          avgScore: 0,
          totalSubmissionRate: 0,
          totalScore: 0
        };
      }
      byType[type].count++;
      byType[type].totalSubmissionRate += stat.submissionRate;
      byType[type].totalScore += stat.avgScore;
    });

    Object.values(byType).forEach((stats: any) => {
      stats.avgSubmissionRate = Math.round(stats.totalSubmissionRate / stats.count);
      stats.avgScore = Math.round(stats.totalScore / stats.count);
      delete stats.totalSubmissionRate;
      delete stats.totalScore;
    });

    res.json({
      classId,
      assignments: assignmentStats,
      byType: Object.values(byType),
      summary: {
        totalAssignments: assignments.length,
        avgSubmissionRate: assignmentStats.length > 0
          ? Math.round(
              assignmentStats.reduce((sum, a) => sum + a.submissionRate, 0) / 
              assignmentStats.length
            )
          : 0,
        avgScore: assignmentStats.length > 0
          ? Math.round(
              assignmentStats.reduce((sum, a) => sum + a.avgScore, 0) / 
              assignmentStats.length
            )
          : 0
      }
    });
  } catch (error) {
    console.error('获取作业统计失败:', error);
    res.status(500).json({ error: '获取作业统计失败' });
  }
});

// 生成个性化建议
router.get('/class/:classId/suggestions', authMiddleware, async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = (req.user as any)._id.toString();

    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    if (classInfo.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权访问' });
    }

    const activeStudents = classInfo.students.filter(s => s.status === 'active');
    const studentIds = activeStudents.map(s => s.userId);

    // 获取各种统计数据
    const progressData = await UserProgress.find({ userId: { $in: studentIds } });
    const avgMastery = progressData.length > 0
      ? progressData.reduce((sum, p) => sum + p.bestScore, 0) / progressData.length
      : 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSessions = await StudySession.countDocuments({
      userId: { $in: studentIds },
      createdAt: { $gte: sevenDaysAgo }
    });

    const assignments = await Assignment.find({ classId });
    const avgSubmissionRate = assignments.length > 0
      ? assignments.reduce((sum, a) => {
          const submittedCount = new Set(
            a.submissions.map((s: any) => s.userId.toString())
          ).size;
          return sum + (submittedCount / activeStudents.length);
        }, 0) / assignments.length * 100
      : 0;

    // 生成建议
    const suggestions = [];

    if (avgMastery < 60) {
      suggestions.push({
        type: 'warning',
        category: '知识掌握',
        title: '班级整体掌握度偏低',
        description: `班级平均掌握度为 ${Math.round(avgMastery)}%，低于及格线。`,
        action: '建议针对薄弱知识点组织专题复习课，加强基础知识讲解。',
        priority: 'high'
      });
    } else if (avgMastery < 75) {
      suggestions.push({
        type: 'info',
        category: '知识掌握',
        title: '部分知识点需要强化',
        description: `班级平均掌握度为 ${Math.round(avgMastery)}%，有提升空间。`,
        action: '建议查看薄弱知识点列表，针对性地布置练习作业。',
        priority: 'medium'
      });
    }

    if (recentSessions < activeStudents.length * 3) {
      suggestions.push({
        type: 'warning',
        category: '学习活跃度',
        title: '班级活跃度较低',
        description: '最近一周学习活跃度不足，部分学生可能缺乏学习动力。',
        action: '建议通过作业、测验等方式激发学生学习积极性，或进行一对一沟通。',
        priority: 'high'
      });
    }

    if (avgSubmissionRate < 70) {
      suggestions.push({
        type: 'warning',
        category: '作业完成',
        title: '作业提交率偏低',
        description: `平均作业提交率为 ${Math.round(avgSubmissionRate)}%，需要改善。`,
        action: '建议跟进未提交作业的学生，了解原因并提供帮助。同时可以考虑调整作业难度或截止时间。',
        priority: 'high'
      });
    }

    // 查找需要关注的学生
    const studentStats = await Promise.all(
      activeStudents.slice(0, 10).map(async (student) => {
        const studentProgress = await UserProgress.find({ userId: student.userId });
        const studentAvgScore = studentProgress.length > 0
          ? studentProgress.reduce((sum, p) => sum + p.bestScore, 0) / studentProgress.length
          : 0;

        const studentSessions = await StudySession.find({
          userId: student.userId,
          createdAt: { $gte: sevenDaysAgo }
        });

        return {
          userName: student.userName,
          avgScore: studentAvgScore,
          recentSessions: studentSessions.length
        };
      })
    );

    const needAttention = studentStats.filter(s => s.avgScore < 50 || s.recentSessions === 0);
    if (needAttention.length > 0) {
      suggestions.push({
        type: 'info',
        category: '学生关注',
        title: '部分学生需要特别关注',
        description: `有 ${needAttention.length} 名学生的学习情况需要重点关注。`,
        action: `建议与这些学生进行一对一交流：${needAttention.slice(0, 3).map(s => s.userName).join('、')}${needAttention.length > 3 ? ' 等' : ''}。`,
        priority: 'medium'
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        type: 'success',
        category: '整体情况',
        title: '班级学习状态良好',
        description: '班级整体学习情况表现优秀，请继续保持！',
        action: '可以适当增加一些挑战性内容，帮助学生进一步提升。',
        priority: 'low'
      });
    }

    res.json({
      classId,
      suggestions,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('生成建议失败:', error);
    res.status(500).json({ error: '生成建议失败' });
  }
});

export default router;

