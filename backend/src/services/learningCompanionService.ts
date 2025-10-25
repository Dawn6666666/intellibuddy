// backend/src/services/learningCompanionService.ts
import { getChatCompletion, ChatMessage } from './ai';
import UserProgress from '../models/UserProgress';
import StudySession from '../models/StudySession';
import WrongQuestion from '../models/WrongQuestion';
import KnowledgePoint from '../models/KnowledgePoint';
import UserAchievement from '../models/Achievement';
import User from '../models/User';
import { Types } from 'mongoose';

/**
 * AI学习伙伴服务
 * 定期检查学习进度，就像真实的学习伙伴
 * 提供鼓励、建议和个性化消息
 */

export interface CompanionMessage {
  type: 'weekly_summary' | 'encouragement' | 'celebration' | 'reminder' | 'suggestion';
  title: string;
  content: string;
  emotionTone: 'positive' | 'encouraging' | 'celebrating' | 'gentle_reminder';
  actionable?: boolean;
  relatedPoints?: string[];
  createdAt: Date;
}

/**
 * 生成每周学习总结
 */
export async function generateWeeklySummary(userId: Types.ObjectId): Promise<CompanionMessage> {
  const user = await User.findById(userId).select('username').lean();
  const userName = user?.username || '同学';

  // 获取本周学习数据
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const thisWeekProgress = await UserProgress.find({
    userId,
    status: 'completed',
    completedAt: { $gte: weekAgo },
  }).lean();

  const thisWeekSessions = await StudySession.find({
    userId,
    startTime: { $gte: weekAgo },
  }).lean();

  const thisWeekStudyTime = thisWeekSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const hours = Math.floor(thisWeekStudyTime / 3600);
  const minutes = Math.floor((thisWeekStudyTime % 3600) / 60);

  // 获取上周数据进行对比
  const lastWeekStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const lastWeekEnd = weekAgo;

  const lastWeekProgress = await UserProgress.find({
    userId,
    status: 'completed',
    completedAt: { $gte: lastWeekStart, $lt: lastWeekEnd },
  }).lean();

  const lastWeekSessions = await StudySession.find({
    userId,
    startTime: { $gte: lastWeekStart, $lt: lastWeekEnd },
  }).lean();

  const lastWeekStudyTime = lastWeekSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  // 计算提升百分比
  const pointsImprovement =
    lastWeekProgress.length > 0
      ? Math.round(((thisWeekProgress.length - lastWeekProgress.length) / lastWeekProgress.length) * 100)
      : 0;

  const timeImprovement =
    lastWeekStudyTime > 0
      ? Math.round(((thisWeekStudyTime - lastWeekStudyTime) / lastWeekStudyTime) * 100)
      : 0;

  // 获取本周完成的知识点标题
  const completedPointIds = thisWeekProgress.map(p => p.pointId);
  const completedPoints = await KnowledgePoint.find({ id: { $in: completedPointIds } })
    .select('title subject')
    .lean();

  const prompt = `作为 ${userName} 的AI学习伙伴，请生成一份温暖、富有激励性的每周学习总结（200字以内）：

**本周学习数据**:
- 完成知识点: ${thisWeekProgress.length} 个
- 学习时长: ${hours}小时${minutes}分钟
- 对比上周: 知识点${pointsImprovement > 0 ? '增加' : '减少'}${Math.abs(pointsImprovement)}%，时长${timeImprovement > 0 ? '增加' : '减少'}${Math.abs(timeImprovement)}%

**本周完成的内容**:
${completedPoints.map(p => `- ${p.title} (${p.subject})`).join('\n')}

请用第二人称，语气亲切友好，包含：
1. 对本周成绩的肯定
2. 具体进步的夸赞
3. 下周的鼓励和期待

用 emoji 增加亲和力。`;

  const aiContent = await generateCompanionMessage(prompt);

  return {
    type: 'weekly_summary',
    title: '📊 本周学习总结',
    content: aiContent,
    emotionTone: 'positive',
    actionable: false,
    createdAt: new Date(),
  };
}

/**
 * 生成鼓励消息（学习低谷期）
 */
export async function generateEncouragement(userId: Types.ObjectId): Promise<CompanionMessage | null> {
  const user = await User.findById(userId).select('username').lean();
  const userName = user?.username || '同学';

  // 检测学习低谷：最近7天学习时间很少或完成度低
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const recentSessions = await StudySession.find({
    userId,
    startTime: { $gte: weekAgo },
  }).lean();

  const recentProgress = await UserProgress.find({
    userId,
    status: 'completed',
    completedAt: { $gte: weekAgo },
  }).lean();

  const totalStudyTime = recentSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const avgScore = recentProgress.length > 0
    ? recentProgress.reduce((sum, p) => sum + (p.bestScore || 0), 0) / recentProgress.length
    : 0;

  // 判断是否需要鼓励
  const needsEncouragement =
    (totalStudyTime < 3600 && recentProgress.length < 2) || // 学习时间少于1小时且完成少于2个
    avgScore < 60; // 或者平均分低于60

  if (!needsEncouragement) return null;

  // 获取用户之前的高光时刻
  const allProgress = await UserProgress.find({
    userId,
    status: 'completed',
  })
    .sort({ completedAt: -1 })
    .limit(20)
    .lean();

  const bestScore = Math.max(...allProgress.map(p => p.bestScore || 0));
  const totalCompleted = allProgress.length;

  const prompt = `作为 ${userName} 的AI学习伙伴，Ta最近似乎遇到了学习低谷，请生成一段真诚、温暖的鼓励（150字以内）：

**当前情况**:
- 最近7天学习时间: ${Math.floor(totalStudyTime / 60)}分钟
- 最近完成知识点: ${recentProgress.length}个
- 最近平均分: ${avgScore.toFixed(1)}分

**历史亮点**:
- 历史最高分: ${bestScore}分
- 累计完成: ${totalCompleted}个知识点

请：
1. 理解Ta可能遇到的困难
2. 回顾Ta之前的成就
3. 给予真诚的鼓励和建议
4. 语气要像朋友般温暖

用 emoji 增加情感表达。`;

  const aiContent = await generateCompanionMessage(prompt);

  return {
    type: 'encouragement',
    title: '💪 别灰心，你可以的！',
    content: aiContent,
    emotionTone: 'encouraging',
    actionable: true,
    createdAt: new Date(),
  };
}

/**
 * 生成庆祝消息（高光时刻）
 */
export async function generateCelebration(
  userId: Types.ObjectId,
  milestone: {
    type: 'high_score' | 'streak' | 'completion' | 'speed';
    value: number;
    description: string;
  }
): Promise<CompanionMessage> {
  const user = await User.findById(userId).select('username').lean();
  const userName = user?.username || '同学';

  const prompt = `作为 ${userName} 的AI学习伙伴，Ta刚刚达成了一个重要里程碑！请生成一段充满庆祝感的祝贺（100字以内）：

**里程碑类型**: ${milestone.type === 'high_score' ? '高分成就' : milestone.type === 'streak' ? '连续学习' : milestone.type === 'completion' ? '完成目标' : '学习速度'}
**具体成就**: ${milestone.description}

请：
1. 热烈庆祝这个成就
2. 肯定Ta的努力和坚持
3. 鼓励继续保持
4. 语气要充满喜悦和自豪

多用庆祝的 emoji！`;

  const aiContent = await generateCompanionMessage(prompt);

  return {
    type: 'celebration',
    title: '🎉 太棒了！',
    content: aiContent,
    emotionTone: 'celebrating',
    actionable: false,
    createdAt: new Date(),
  };
}

/**
 * 生成学习提醒（长时间未学习）
 */
export async function generateReminder(userId: Types.ObjectId): Promise<CompanionMessage | null> {
  const user = await User.findById(userId).select('username').lean();
  const userName = user?.username || '同学';

  // 获取最后一次学习时间
  const lastSession = await StudySession.findOne({ userId })
    .sort({ startTime: -1 })
    .lean();

  if (!lastSession) return null;

  const daysSinceLastStudy = (Date.now() - new Date(lastSession.startTime).getTime()) / (1000 * 60 * 60 * 24);

  // 如果少于3天，不提醒
  if (daysSinceLastStudy < 3) return null;

  // 获取上次学习的知识点
  const lastProgress = await UserProgress.findOne({
    userId,
    updatedAt: { $gte: new Date(lastSession.startTime) },
  })
    .sort({ updatedAt: -1 })
    .lean();

  let lastPointTitle = '';
  if (lastProgress) {
    const point = await KnowledgePoint.findOne({ id: lastProgress.pointId }).select('title').lean();
    lastPointTitle = point?.title || '';
  }

  const prompt = `作为 ${userName} 的AI学习伙伴，Ta已经${Math.floor(daysSinceLastStudy)}天没有学习了。请生成一段温柔的提醒（100字以内）：

**上次学习**: ${Math.floor(daysSinceLastStudy)}天前
**上次内容**: ${lastPointTitle || '未知'}

请：
1. 温柔地提醒Ta
2. 不要让Ta有压力感
3. 激发Ta重新开始的兴趣
4. 语气要像朋友的关心

用 emoji 增加亲切感。`;

  const aiContent = await generateCompanionMessage(prompt);

  return {
    type: 'reminder',
    title: '👋 好久不见！',
    content: aiContent,
    emotionTone: 'gentle_reminder',
    actionable: true,
    createdAt: new Date(),
  };
}

/**
 * 生成个性化学习建议
 */
export async function generateSuggestion(
  userId: Types.ObjectId,
  issue: {
    type: string;
    description: string;
    suggestion: string;
  }
): Promise<CompanionMessage> {
  const user = await User.findById(userId).select('username').lean();
  const userName = user?.username || '同学';

  const prompt = `作为 ${userName} 的AI学习伙伴，我注意到Ta的学习中有个需要关注的地方。请生成一段友好的建议（150字以内）：

**问题类型**: ${issue.type}
**具体情况**: ${issue.description}
**初步建议**: ${issue.suggestion}

请：
1. 以朋友的口吻提出建议
2. 不要让Ta感到被批评
3. 提供具体可行的改进方法
4. 表达对Ta的信心

用 emoji 让语气更友好。`;

  const aiContent = await generateCompanionMessage(prompt);

  return {
    type: 'suggestion',
    title: '💡 一个小建议',
    content: aiContent,
    emotionTone: 'encouraging',
    actionable: true,
    createdAt: new Date(),
  };
}

/**
 * 调用AI生成伙伴消息
 */
async function generateCompanionMessage(prompt: string): Promise<string> {
  try {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `你是一位温暖、真诚的AI学习伙伴，名叫「智伴」。你的特点是：
- 语气亲切友好，像朋友而不是老师
- 善于鼓励和激励，但不浮夸
- 理解学习的艰辛，能够共情
- 提供的建议具体可行
- 经常用合适的 emoji 增加亲和力
- 语言简洁有力，不啰嗦`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return await getChatCompletion(messages, { maxTokens: 500 });
  } catch (error) {
    console.error('生成伙伴消息失败:', error);
    return '你好！我是你的学习伙伴，虽然现在系统有点忙，但我一直在关注你的进步！加油！💪';
  }
}

/**
 * 自动检测并推送合适的消息
 */
export async function autoGenerateCompanionMessage(
  userId: Types.ObjectId
): Promise<CompanionMessage | null> {
  // 1. 检查是否需要提醒
  const reminder = await generateReminder(userId);
  if (reminder) return reminder;

  // 2. 检查是否需要鼓励
  const encouragement = await generateEncouragement(userId);
  if (encouragement) return encouragement;

  // 3. 检查是否有值得庆祝的成就
  const recentAchievements = await UserAchievement.find({
    userId,
    completed: true,
    unlockedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // 最近24小时
  }).lean();

  if (recentAchievements.length > 0) {
    const achievement = recentAchievements[0];
    return await generateCelebration(userId, {
      type: 'completion',
      value: 1,
      description: `解锁成就: ${achievement.achievementId}`,
    });
  }

  // 4. 默认返回null
  return null;
}

/**
 * 获取今日推荐消息
 * 每天只生成一次
 */
export async function getTodayCompanionMessage(userId: Types.ObjectId): Promise<CompanionMessage | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 检查今天是否已经生成过消息
  // 这里需要一个存储机制，暂时每次都生成

  return await autoGenerateCompanionMessage(userId);
}

