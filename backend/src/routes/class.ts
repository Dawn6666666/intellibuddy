import express from 'express';
import Class from '../models/Class';
import User from '../models/User';
import { authMiddleware } from '../middleware/auth';
import crypto from 'crypto';
import KnowledgePoint from '../models/KnowledgePoint';
import StudySession from '../models/StudySession';
import UserProgress from '../models/UserProgress';

const router = express.Router();

// 生成唯一邀请码
function generateInviteCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// 创建班级（教师）
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, subject, grade, semester, settings} = req.body;
    const authUser = req.user as any;
    const userId = authUser._id.toString();

    // 检查用户是否为教师
    const user = await User.findById(userId);
    if (!user || user.role !== 'teacher') {
      return res.status(403).json({ error: '只有教师可以创建班级' });
    }

    // 生成唯一邀请码
    let inviteCode = generateInviteCode();
    while (await Class.findOne({ inviteCode })) {
      inviteCode = generateInviteCode();
    }

    const newClass = new Class({
      name,
      description,
      teacherId: userId,
      teacherName: user.username,
      subject,
      grade,
      semester,
      settings: settings || {},
      inviteCode,
      students: []
    });

    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    console.error('创建班级失败:', error);
    res.status(500).json({ error: '创建班级失败' });
  }
});

// 获取我的班级列表
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const authUser = req.user as any;
    const userId = authUser._id.toString();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    let classes;
    if (user.role === 'teacher') {
      // 教师：获取自己创建的班级
      classes = await Class.find({ 
        teacherId: userId, 
        status: 'active' 
      }).sort({ createdAt: -1 });
    } else {
      // 学生：获取自己加入的班级
      classes = await Class.find({ 
        'students.userId': userId,
        'students.status': 'active',
        status: 'active' 
      }).sort({ createdAt: -1 });
    }

    res.json(classes);
  } catch (error) {
    console.error('获取班级列表失败:', error);
    res.status(500).json({ error: '获取班级列表失败' });
  }
});

// 获取我加入的班级列表（学生专用）
router.get('/joined', authMiddleware, async (req, res) => {
  try {
    const authUser = req.user as any;
    const userId = authUser._id.toString();

    // 查找学生加入的所有班级
    const classes = await Class.find({ 
      'students.userId': userId,
      'students.status': 'active',
      status: 'active' 
    })
    .populate('teacherId', 'username email avatarUrl')
    .sort({ createdAt: -1 });

    // 为每个班级添加学生的加入时间
    const classesWithJoinTime = classes.map(cls => {
      const classObj = cls.toObject();
      const studentInfo = cls.students.find(
        s => s.userId.toString() === userId && s.status === 'active'
      );
      return {
        ...classObj,
        teacher: classObj.teacherId, // 重命名字段
        joinedAt: studentInfo?.joinedAt
      };
    });

    res.json(classesWithJoinTime);
  } catch (error) {
    console.error('获取已加入班级失败:', error);
    res.status(500).json({ error: '获取已加入班级失败' });
  }
});

// 获取班级详情
router.get('/:classId', authMiddleware, async (req, res) => {
  try {
    const { classId } = req.params;
    const authUser = req.user as any;
    const userId = authUser._id.toString();

    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    // 检查权限：教师或班级成员
    const isTeacher = classInfo.teacherId.toString() === userId;
    const isStudent = classInfo.students.some(
      s => s.userId.toString() === userId && s.status === 'active'
    );

    if (!isTeacher && !isStudent) {
      return res.status(403).json({ error: '无权访问此班级' });
    }

    res.json(classInfo);
  } catch (error) {
    console.error('获取班级详情失败:', error);
    res.status(500).json({ error: '获取班级详情失败' });
  }
});

// 更新班级信息（教师）
router.put('/:classId', authMiddleware, async (req, res) => {
  try {
    const { classId } = req.params;
    const authUser = req.user as any;
    const userId = authUser._id.toString();
    const updates = req.body;

    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    // 检查权限：只有教师可以更新
    if (classInfo.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权修改此班级' });
    }

    // 更新允许的字段
    const allowedFields = ['name', 'description', 'subject', 'grade', 'semester', 'settings'];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        (classInfo as any)[field] = updates[field];
      }
    });

    await classInfo.save();
    res.json(classInfo);
  } catch (error) {
    console.error('更新班级失败:', error);
    res.status(500).json({ error: '更新班级失败' });
  }
});

// 通过邀请码加入班级（学生）
router.post('/join', authMiddleware, async (req, res) => {
  try {
    // 从请求体获取邀请码
    const inviteCode = req.body.inviteCode;
    const authUser = req.user as any;
    const userId = authUser._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    const classInfo = await Class.findOne({ inviteCode, status: 'active' });
    if (!classInfo) {
      return res.status(404).json({ error: '无效的邀请码' });
    }

    // 检查是否已经加入
    const alreadyJoined = classInfo.students.some(
      s => s.userId.toString() === userId
    );
    if (alreadyJoined) {
      return res.status(400).json({ error: '您已经加入此班级' });
    }

    // 检查人数限制
    if (classInfo.settings.maxStudents) {
      const activeStudents = classInfo.students.filter(s => s.status === 'active').length;
      if (activeStudents >= classInfo.settings.maxStudents) {
        return res.status(400).json({ error: '班级人数已满' });
      }
    }

    // 添加学生
    classInfo.students.push({
      userId: user._id,
      userName: user.username,
      joinedAt: new Date(),
      status: 'active'
    });

    await classInfo.save();
    res.json({ message: '成功加入班级', class: classInfo });
  } catch (error) {
    console.error('加入班级失败:', error);
    res.status(500).json({ error: '加入班级失败' });
  }
});

// 移除学生（教师）
router.delete('/:classId/students/:studentId', authMiddleware, async (req, res) => {
  try {
    const { classId, studentId } = req.params;
    const authUser = req.user as any;
    const userId = authUser._id.toString();

    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    // 检查权限：只有教师可以移除学生
    if (classInfo.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权操作' });
    }

    // 查找并更新学生状态
    const student = classInfo.students.find(
      s => s.userId.toString() === studentId
    );
    if (!student) {
      return res.status(404).json({ error: '学生不在此班级' });
    }

    student.status = 'inactive';
    await classInfo.save();

    res.json({ message: '学生已移除' });
  } catch (error) {
    console.error('移除学生失败:', error);
    res.status(500).json({ error: '移除学生失败' });
  }
});

// 退出班级（学生）
router.post('/:classId/leave', authMiddleware, async (req, res) => {
  try {
    const { classId } = req.params;
    const authUser = req.user as any;
    const userId = authUser._id.toString();

    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    // 查找学生
    const student = classInfo.students.find(
      s => s.userId.toString() === userId
    );
    if (!student) {
      return res.status(404).json({ error: '您不在此班级' });
    }

    student.status = 'inactive';
    await classInfo.save();

    res.json({ message: '已退出班级' });
  } catch (error) {
    console.error('退出班级失败:', error);
    res.status(500).json({ error: '退出班级失败' });
  }
});

// 归档班级（教师）
router.post('/:classId/archive', authMiddleware, async (req, res) => {
  try {
    const { classId } = req.params;
    const authUser = req.user as any;
    const userId = authUser._id.toString();

    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    // 检查权限
    if (classInfo.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权操作' });
    }

    classInfo.status = 'archived';
    await classInfo.save();

    res.json({ message: '班级已归档' });
  } catch (error) {
    console.error('归档班级失败:', error);
    res.status(500).json({ error: '归档班级失败' });
  }
});

// 获取班级学生学习统计（教师）
router.get('/:classId/students/stats', authMiddleware, async (req, res) => {
  try {
    const { classId } = req.params;
    const authUser = req.user as any;
    const userId = authUser._id.toString();

    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ error: '班级不存在' });
    }

    // 检查权限
    if (classInfo.teacherId.toString() !== userId) {
      return res.status(403).json({ error: '无权访问' });
    }

    // 获取学生学习数据
    const StudySession = (await import('../models/StudySession')).default;
    const KnowledgePoint = (await import('../models/KnowledgePoint')).default;

    const activeStudents = classInfo.students.filter(s => s.status === 'active');
    const studentStats = await Promise.all(
      activeStudents.map(async (student) => {
        // 学习时长
        const sessions = await StudySession.find({ userId: student.userId });
        const totalTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        const sessionCount = sessions.length;

        // 知识点掌握情况
        const userProgress = await UserProgress.find({ userId: student.userId });
        const masteredCount = userProgress.filter(up => up.bestScore >= 80).length;
        const totalKnowledge = userProgress.length;

        // 平均分数
        const avgScore = userProgress.length > 0
          ? userProgress.reduce((sum, up) => sum + up.bestScore, 0) / userProgress.length
          : 0;

        return {
          userId: student.userId,
          userName: student.userName,
          joinedAt: student.joinedAt,
          totalTime,
          sessionCount,
          masteredCount,
          totalKnowledge,
          avgScore: Math.round(avgScore),
          lastActive: sessions.length > 0 
            ? (sessions[sessions.length - 1] as any).createdAt 
            : student.joinedAt
        };
      })
    );

    res.json({
      classId,
      className: classInfo.name,
      totalStudents: activeStudents.length,
      students: studentStats
    });
  } catch (error) {
    console.error('获取学生统计失败:', error);
    res.status(500).json({ error: '获取学生统计失败' });
  }
});

export default router;

