import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { Class } from '../models/Class';

const router = express.Router();

// 获取当前用户的通知列表
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!._id;
    const { page = 1, limit = 20, unreadOnly = false, type } = req.query;

    const query: any = { recipientId: userId };
    
    if (unreadOnly === 'true') {
      query.read = false;
    }
    
    if (type) {
      query.type = type;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('senderId', 'username avatarUrl')
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ recipientId: userId, read: false })
    ]);

    res.json({
      notifications,
      total,
      unreadCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('获取通知失败:', error);
    res.status(500).json({ error: '获取通知失败' });
  }
});

// 获取未读通知数量
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!._id;
    const count = await Notification.countDocuments({ 
      recipientId: userId, 
      read: false 
    });
    res.json({ count });
  } catch (error) {
    console.error('获取未读数量失败:', error);
    res.status(500).json({ error: '获取未读数量失败' });
  }
});

// 标记单个通知为已读
router.put('/:notificationId/read', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!._id;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipientId: userId },
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: '通知不存在' });
    }

    res.json(notification);
  } catch (error) {
    console.error('标记已读失败:', error);
    res.status(500).json({ error: '标记已读失败' });
  }
});

// 标记所有通知为已读
router.put('/mark-all-read', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!._id;
    
    await Notification.updateMany(
      { recipientId: userId, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ message: '所有通知已标记为已读' });
  } catch (error) {
    console.error('标记全部已读失败:', error);
    res.status(500).json({ error: '标记全部已读失败' });
  }
});

// 删除通知
router.delete('/:notificationId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!._id;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipientId: userId
    });

    if (!notification) {
      return res.status(404).json({ error: '通知不存在' });
    }

    res.json({ message: '通知已删除' });
  } catch (error) {
    console.error('删除通知失败:', error);
    res.status(500).json({ error: '删除通知失败' });
  }
});

// 批量删除已读通知
router.delete('/batch/read', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!._id;
    
    const result = await Notification.deleteMany({
      recipientId: userId,
      read: true
    });

    res.json({ 
      message: '已读通知已清空',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('清空已读通知失败:', error);
    res.status(500).json({ error: '清空已读通知失败' });
  }
});

// 创建通知（仅教师和管理员）
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = req.user!;
    
    // 检查权限
    if (user.role !== 'teacher' && user.role !== 'admin') {
      return res.status(403).json({ error: '无权限创建通知' });
    }

    const {
      recipientIds,
      classId,
      type,
      title,
      content,
      priority = 'normal',
      relatedId,
      relatedType,
      actionUrl,
      metadata
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: '标题和内容不能为空' });
    }

    let recipients: any[] = [];

    // 如果指定了班级，获取班级所有学生
    if (classId) {
      const classDoc = await Class.findById(classId);
      if (!classDoc) {
        return res.status(404).json({ error: '班级不存在' });
      }
      recipients = classDoc.students
        .filter(s => s.status === 'active')
        .map(s => s.userId);
    } else if (recipientIds && Array.isArray(recipientIds)) {
      recipients = recipientIds;
    } else {
      return res.status(400).json({ error: '必须指定接收者或班级' });
    }

    // 批量创建通知
    const notifications = recipients.map(recipientId => ({
      recipientId,
      recipientType: 'student',
      senderId: user._id,
      type,
      title,
      content,
      priority,
      relatedId,
      relatedType,
      actionUrl,
      metadata,
      read: false
    }));

    const created = await Notification.insertMany(notifications);

    res.json({
      message: '通知创建成功',
      count: created.length
    });
  } catch (error) {
    console.error('创建通知失败:', error);
    res.status(500).json({ error: '创建通知失败' });
  }
});

export default router;

