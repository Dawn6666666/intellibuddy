// backend/src/routes/stats.ts
import express from 'express';
import { authMiddleware } from '../middleware/auth';
import Assignment from '../models/Assignment';
import Class from '../models/Class';
import User from '../models/User';

const router = express.Router();

// 获取本周活跃学生数（教师）
router.get('/active-students-this-week', authMiddleware, async (req, res) => {
  try {
    const userId = (req.user as any)._id.toString();

    // 获取本周的开始和结束时间
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // 周日
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // 获取教师的所有班级
    const classes = await Class.find({ teacherId: userId, status: 'active' });
    
    if (classes.length === 0) {
      return res.json({ count: 0, students: [] });
    }

    // 收集所有学生ID
    const allStudentIds = new Set<string>();
    classes.forEach(cls => {
      cls.students.forEach(student => {
        if (student.status === 'active') {
          allStudentIds.add(student.userId.toString());
        }
      });
    });

    // 查找本周有提交作业的学生
    const assignments = await Assignment.find({
      teacherId: userId,
      'submissions.submittedAt': {
        $gte: startOfWeek,
        $lt: endOfWeek
      }
    });

    // 统计活跃学生
    const activeStudentIds = new Set<string>();
    assignments.forEach(assignment => {
      assignment.submissions.forEach(submission => {
        const submittedAt = new Date(submission.submittedAt);
        if (submittedAt >= startOfWeek && submittedAt < endOfWeek) {
          activeStudentIds.add(submission.userId.toString());
        }
      });
    });

    // 获取学生详细信息
    const activeStudents = await User.find({
      _id: { $in: Array.from(activeStudentIds) }
    }).select('username email avatar');

    res.json({
      count: activeStudents.length,
      totalStudents: allStudentIds.size,
      students: activeStudents.map(student => ({
        id: student._id,
        username: student.username,
        email: student.email,
        avatar: student.avatar
      })),
      weekStart: startOfWeek,
      weekEnd: endOfWeek
    });
  } catch (error) {
    console.error('获取活跃学生失败:', error);
    res.status(500).json({ error: '获取活跃学生失败' });
  }
});

// 获取教师统计概览
router.get('/teacher-overview', authMiddleware, async (req, res) => {
  try {
    const userId = (req.user as any)._id.toString();

    // 获取班级数量
    const classCount = await Class.countDocuments({ teacherId: userId, status: 'active' });

    // 获取学生总数
    const classes = await Class.find({ teacherId: userId, status: 'active' });
    const studentIds = new Set<string>();
    classes.forEach(cls => {
      cls.students.forEach(student => {
        if (student.status === 'active') {
          studentIds.add(student.userId.toString());
        }
      });
    });

    // 获取作业数量
    const assignmentCount = await Assignment.countDocuments({
      teacherId: userId,
      status: { $in: ['published', 'draft'] }
    });

    // 获取待批改作业数量
    const pendingGradingCount = await Assignment.aggregate([
      { $match: { teacherId: userId } },
      { $unwind: '$submissions' },
      { $match: { 'submissions.status': 'submitted' } },
      { $count: 'total' }
    ]);

    res.json({
      classCount,
      studentCount: studentIds.size,
      assignmentCount,
      pendingGradingCount: pendingGradingCount[0]?.total || 0
    });
  } catch (error) {
    console.error('获取教师统计概览失败:', error);
    res.status(500).json({ error: '获取教师统计概览失败' });
  }
});

export default router;

