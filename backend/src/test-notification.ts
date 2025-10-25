// 测试通知功能脚本
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Notification } from './models/Notification';
import Class from './models/Class';
import Assignment from './models/Assignment';
import User from './models/User';

async function testNotifications() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('错误: MONGO_URI 未在 .env 文件中定义');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ 成功连接到 MongoDB');

    // 1. 查找教师账号
    const teacher = await User.findOne({ email: 'teacher@intellibuddy.com' });
    if (!teacher) {
      console.log('❌ 未找到教师账号');
      return;
    }
    console.log(`\n✅ 找到教师账号: ${teacher.username} (ID: ${teacher._id})`);

    // 2. 查找学生账号
    const students = await User.find({ 
      email: { $in: ['student@intellibuddy.com', 'advanced@intellibuddy.com', 'newuser@intellibuddy.com'] }
    });
    console.log(`\n✅ 找到 ${students.length} 个学生账号:`);
    students.forEach(s => {
      console.log(`   - ${s.username} (${s.email})`);
    });

    // 3. 查找或创建班级
    let classDoc = await Class.findOne({ teacherId: teacher._id });
    
    if (!classDoc) {
      // 创建测试班级
      classDoc = new Class({
        name: '高一（1班）',
        subject: '数学',
        description: '测试班级',
        teacherId: teacher._id,
        students: students.map(s => ({
          userId: s._id,
          joinedAt: new Date(),
          status: 'active'
        })),
        inviteCode: 'TEST' + Math.random().toString(36).substring(7).toUpperCase(),
        settings: {
          allowSelfJoin: true,
          requireApproval: false,
          maxStudents: 50
        }
      });
      await classDoc.save();
      console.log(`\n✅ 创建了测试班级: ${classDoc.name} (ID: ${classDoc._id})`);
    } else {
      console.log(`\n✅ 找到现有班级: ${classDoc.name} (ID: ${classDoc._id})`);
      console.log(`   班级中有 ${classDoc.students.length} 名学生`);
    }

    // 4. 创建测试作业（先不添加题目，因为questionId是必需的）
    const assignment = new Assignment({
      title: '测试作业 - 通知功能验证',
      description: '这是一个测试作业，用于验证通知功能是否正常工作',
      classId: classDoc._id,
      teacherId: teacher._id,
      type: 'homework',
      difficulty: 'medium',
      totalScore: 100,
      passingScore: 60,
      questions: [], // 先创建空的，避免 questionId 验证问题
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后
      status: 'draft',
      settings: {
        allowRetake: true,
        showAnswers: true,
        showScore: true,
        maxAttempts: 3
      },
      submissions: []
    });
    await assignment.save();
    console.log(`\n✅ 创建了测试作业: ${assignment.title} (ID: ${assignment._id})`);

    // 5. 发布作业并创建通知（直接模拟发布流程，因为验证需要至少一道题目）
    console.log(`\n📢 模拟作业发布，创建通知...`);

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
        senderId: teacher._id,
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
      console.log(`📧 已向以下学生ID发送通知:`);
      activeStudents.forEach((id: any, index: number) => {
        const student = students.find(s => s._id.toString() === id.toString());
        console.log(`   ${index + 1}. ${student?.username || id} (${id})`);
      });
    }

    // 6. 验证通知是否创建成功
    console.log(`\n📊 验证通知数据...`);
    for (const studentId of activeStudents) {
      const count = await Notification.countDocuments({
        recipientId: studentId,
        read: false
      });
      const student = students.find(s => s._id.toString() === studentId.toString());
      console.log(`   ${student?.username || studentId}: ${count} 条未读通知`);
    }

    // 7. 显示通知详情
    console.log(`\n📝 通知详情示例:`);
    const sampleNotif = await Notification.findOne({ relatedId: assignment._id });
    if (sampleNotif) {
      console.log(JSON.stringify({
        _id: sampleNotif._id,
        title: sampleNotif.title,
        content: sampleNotif.content,
        type: sampleNotif.type,
        recipientType: sampleNotif.recipientType,
        read: sampleNotif.read,
        metadata: sampleNotif.metadata,
        actionUrl: sampleNotif.actionUrl,
        createdAt: sampleNotif.createdAt
      }, null, 2));
    }

    console.log(`\n✅ 测试完成！`);
    console.log(`\n🎯 下一步操作:`);
    console.log(`   1. 使用学生账号登录: student@intellibuddy.com / Demo2025`);
    console.log(`   2. 将鼠标悬停在右上角的通知图标（铃铛）上`);
    console.log(`   3. 应该会看到新的作业通知`);
    console.log(`   4. 点击通知查看详情`);

  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 已断开数据库连接');
  }
}

testNotifications();

