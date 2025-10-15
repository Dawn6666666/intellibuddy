// backend/src/services/achievementService.ts
import mongoose from 'mongoose';
import UserAchievement, { ACHIEVEMENT_DEFINITIONS, AchievementType, IAchievementDefinition } from '../models/Achievement';
import UserProgress from '../models/UserProgress';
import StudySession from '../models/StudySession';

/**
 * 成就服务
 */
export class AchievementService {
  /**
   * 初始化用户成就
   */
  static async initializeUserAchievements(userId: mongoose.Types.ObjectId) {
    const existingAchievements = await UserAchievement.find({ userId });
    
    if (existingAchievements.length > 0) {
      return; // 已初始化
    }

    // 为用户创建所有成就记录
    const achievements = ACHIEVEMENT_DEFINITIONS.map(def => ({
      userId,
      achievementId: def.id,
      achievementType: def.type,
      achievementLevel: def.level,
      progress: 0,
      maxProgress: def.requirement,
      completed: false,
    }));

    await UserAchievement.insertMany(achievements);
    console.log(`[Achievement] 为用户 ${userId} 初始化了 ${achievements.length} 个成就`);
  }

  /**
   * 更新成就进度
   */
  static async updateAchievementProgress(
    userId: mongoose.Types.ObjectId,
    type: AchievementType,
    progress: number
  ) {
    const achievements = await UserAchievement.find({
      userId,
      achievementType: type,
      completed: false,
    });

    const newlyUnlocked: IAchievementDefinition[] = [];

    for (const achievement of achievements) {
      const def = ACHIEVEMENT_DEFINITIONS.find(d => d.id === achievement.achievementId);
      if (!def) continue;

      achievement.progress = Math.min(progress, def.requirement);

      if (achievement.progress >= def.requirement && !achievement.completed) {
        achievement.completed = true;
        achievement.unlockedAt = new Date();
        newlyUnlocked.push(def);
        console.log(`[Achievement] 用户 ${userId} 解锁成就: ${def.name}`);
      }

      await achievement.save();
    }

    return newlyUnlocked;
  }

  /**
   * 检查并更新学习时长成就
   */
  static async checkStudyTimeAchievements(userId: mongoose.Types.ObjectId) {
    const sessions = await StudySession.find({ userId, endTime: { $ne: null } });
    const totalSeconds = sessions.reduce((sum, session) => sum + session.duration, 0);

    return await this.updateAchievementProgress(userId, 'study_time', totalSeconds);
  }

  /**
   * 检查并更新知识点掌握成就
   */
  static async checkKnowledgeMasterAchievements(userId: mongoose.Types.ObjectId) {
    const completedCount = await UserProgress.countDocuments({
      userId,
      status: 'completed',
    });

    return await this.updateAchievementProgress(userId, 'knowledge_master', completedCount);
  }

  /**
   * 检查并更新连续学习成就
   */
  static async checkStreakAchievements(userId: mongoose.Types.ObjectId) {
    const sessions = await StudySession.find({
      userId,
      endTime: { $ne: null },
    }).sort({ startTime: -1 });

    if (sessions.length === 0) return [];

    // 计算连续学习天数
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastSessionDate = new Date(sessions[0].startTime);
    lastSessionDate.setHours(0, 0, 0, 0);

    // 检查最近一次学习是否是今天或昨天
    const daysDiff = Math.floor((today.getTime() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 1) {
      streak = 0; // 中断了
    } else {
      const dates = new Set<string>();
      dates.add(lastSessionDate.toDateString());

      for (let i = 1; i < sessions.length; i++) {
        const sessionDate = new Date(sessions[i].startTime);
        sessionDate.setHours(0, 0, 0, 0);
        const dateStr = sessionDate.toDateString();

        if (!dates.has(dateStr)) {
          const prevDate = new Date(sessions[i - 1].startTime);
          prevDate.setHours(0, 0, 0, 0);
          const diff = Math.floor((prevDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

          if (diff === 1) {
            dates.add(dateStr);
            streak++;
          } else {
            break; // 中断了
          }
        }
      }
    }

    return await this.updateAchievementProgress(userId, 'streak', streak);
  }

  /**
   * 检查并更新完美答题成就
   */
  static async checkPerfectQuizAchievements(userId: mongoose.Types.ObjectId, score: number) {
    if (score < 100) return [];

    const achievement = await UserAchievement.findOne({
      userId,
      achievementType: 'quiz_perfect',
      completed: false,
    }).sort({ maxProgress: 1 });

    if (achievement) {
      achievement.progress += 1;
      if (achievement.progress >= achievement.maxProgress) {
        achievement.completed = true;
        achievement.unlockedAt = new Date();
        await achievement.save();

        const def = ACHIEVEMENT_DEFINITIONS.find(d => d.id === achievement.achievementId);
        return def ? [def] : [];
      }
      await achievement.save();
    }

    return [];
  }

  /**
   * 获取用户所有成就
   */
  static async getUserAchievements(userId: mongoose.Types.ObjectId) {
    const userAchievements = await UserAchievement.find({ userId });

    return userAchievements.map(ua => {
      const def = ACHIEVEMENT_DEFINITIONS.find(d => d.id === ua.achievementId);
      return {
        ...ua.toObject(),
        definition: def,
      };
    });
  }

  /**
   * 获取用户成就统计
   */
  static async getUserAchievementStats(userId: mongoose.Types.ObjectId) {
    const total = ACHIEVEMENT_DEFINITIONS.length;
    const completed = await UserAchievement.countDocuments({ userId, completed: true });
    const totalPoints = await UserAchievement.aggregate([
      { $match: { userId, completed: true } },
      {
        $lookup: {
          from: 'achievements',
          localField: 'achievementId',
          foreignField: 'id',
          as: 'def',
        },
      },
      {
        $group: {
          _id: null,
          points: { $sum: '$points' },
        },
      },
    ]);

    const points = totalPoints.length > 0 ? totalPoints[0].points : 0;

    // 计算用户等级（基于积分）
    const level = Math.floor(points / 100) + 1;

    return {
      total,
      completed,
      percentage: Math.round((completed / total) * 100),
      points,
      level,
    };
  }
}

