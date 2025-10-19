// backend/src/models/Achievement.ts
import mongoose, { Schema, Document } from 'mongoose';

/**
 * 成就类型
 */
export type AchievementType = 
  | 'study_time'      // 学习时长成就
  | 'knowledge_master' // 知识点掌握成就
  | 'streak'          // 连续学习成就
  | 'quiz_perfect'    // 完美答题成就
  | 'early_bird'      // 早鸟成就
  | 'night_owl'       // 夜猫子成就
  | 'explorer'        // 探索者成就
  | 'fast_learner';   // 快速学习者成就

/**
 * 成就等级
 */
export type AchievementLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

/**
 * 成就定义接口
 */
export interface IAchievementDefinition {
  id: string;
  type: AchievementType;
  level: AchievementLevel;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  points: number;
}

/**
 * 用户成就接口
 */
export interface IUserAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  achievementId: string;
  achievementType: AchievementType;
  achievementLevel: AchievementLevel;
  unlockedAt: Date;
  progress: number;
  maxProgress: number;
  completed: boolean;
}

const userAchievementSchema = new Schema<IUserAchievement>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  achievementId: {
    type: String,
    required: true,
    index: true,
  },
  achievementType: {
    type: String,
    required: true,
    enum: [
      'study_time',
      'knowledge_master',
      'streak',
      'quiz_perfect',
      'early_bird',
      'night_owl',
      'explorer',
      'fast_learner',
    ],
  },
  achievementLevel: {
    type: String,
    required: true,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
  },
  unlockedAt: {
    type: Date,
    default: null,
  },
  progress: {
    type: Number,
    default: 0,
  },
  maxProgress: {
    type: Number,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// 复合索引
userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });
userAchievementSchema.index({ userId: 1, completed: 1 });

const UserAchievement = (mongoose.models.UserAchievement as mongoose.Model<IUserAchievement>) || mongoose.model<IUserAchievement>('UserAchievement', userAchievementSchema);

export default UserAchievement;

/**
 * 成就定义列表
 */
export const ACHIEVEMENT_DEFINITIONS: IAchievementDefinition[] = [
  // 学习时长成就
  {
    id: 'study_time_bronze',
    type: 'study_time',
    level: 'bronze',
    name: '初学者',
    description: '累计学习1小时',
    icon: '⏱️',
    requirement: 3600, // 1小时（秒）
    points: 10,
  },
  {
    id: 'study_time_silver',
    type: 'study_time',
    level: 'silver',
    name: '勤奋学习者',
    description: '累计学习10小时',
    icon: '⏱️',
    requirement: 36000, // 10小时
    points: 50,
  },
  {
    id: 'study_time_gold',
    type: 'study_time',
    level: 'gold',
    name: '学习达人',
    description: '累计学习50小时',
    icon: '⏱️',
    requirement: 180000, // 50小时
    points: 200,
  },
  {
    id: 'study_time_platinum',
    type: 'study_time',
    level: 'platinum',
    name: '学习大师',
    description: '累计学习100小时',
    icon: '⏱️',
    requirement: 360000, // 100小时
    points: 500,
  },

  // 知识点掌握成就
  {
    id: 'knowledge_bronze',
    type: 'knowledge_master',
    level: 'bronze',
    name: '知识新手',
    description: '完成5个知识点',
    icon: '📚',
    requirement: 5,
    points: 20,
  },
  {
    id: 'knowledge_silver',
    type: 'knowledge_master',
    level: 'silver',
    name: '知识能手',
    description: '完成20个知识点',
    icon: '📚',
    requirement: 20,
    points: 80,
  },
  {
    id: 'knowledge_gold',
    type: 'knowledge_master',
    level: 'gold',
    name: '知识专家',
    description: '完成50个知识点',
    icon: '📚',
    requirement: 50,
    points: 250,
  },
  {
    id: 'knowledge_platinum',
    type: 'knowledge_master',
    level: 'platinum',
    name: '知识宗师',
    description: '完成100个知识点',
    icon: '📚',
    requirement: 100,
    points: 600,
  },

  // 连续学习成就
  {
    id: 'streak_bronze',
    type: 'streak',
    level: 'bronze',
    name: '坚持3天',
    description: '连续学习3天',
    icon: '🔥',
    requirement: 3,
    points: 30,
  },
  {
    id: 'streak_silver',
    type: 'streak',
    level: 'silver',
    name: '坚持7天',
    description: '连续学习7天',
    icon: '🔥',
    requirement: 7,
    points: 100,
  },
  {
    id: 'streak_gold',
    type: 'streak',
    level: 'gold',
    name: '坚持30天',
    description: '连续学习30天',
    icon: '🔥',
    requirement: 30,
    points: 500,
  },
  {
    id: 'streak_platinum',
    type: 'streak',
    level: 'platinum',
    name: '坚持100天',
    description: '连续学习100天',
    icon: '🔥',
    requirement: 100,
    points: 2000,
  },

  // 完美答题成就
  {
    id: 'perfect_bronze',
    type: 'quiz_perfect',
    level: 'bronze',
    name: '完美开始',
    description: '获得1次满分',
    icon: '💯',
    requirement: 1,
    points: 15,
  },
  {
    id: 'perfect_silver',
    type: 'quiz_perfect',
    level: 'silver',
    name: '完美学生',
    description: '获得10次满分',
    icon: '💯',
    requirement: 10,
    points: 100,
  },
  {
    id: 'perfect_gold',
    type: 'quiz_perfect',
    level: 'gold',
    name: '完美主义者',
    description: '获得50次满分',
    icon: '💯',
    requirement: 50,
    points: 400,
  },

  // 早鸟成就
  {
    id: 'early_bird',
    type: 'early_bird',
    level: 'gold',
    name: '早起的鸟儿',
    description: '在早上6-8点学习10次',
    icon: '🌅',
    requirement: 10,
    points: 150,
  },

  // 夜猫子成就
  {
    id: 'night_owl',
    type: 'night_owl',
    level: 'gold',
    name: '夜猫子',
    description: '在晚上22-24点学习10次',
    icon: '🌙',
    requirement: 10,
    points: 150,
  },

  // 探索者成就
  {
    id: 'explorer',
    type: 'explorer',
    level: 'gold',
    name: '知识探索者',
    description: '学习5个不同学科',
    icon: '🗺️',
    requirement: 5,
    points: 200,
  },

  // 快速学习者成就
  {
    id: 'fast_learner',
    type: 'fast_learner',
    level: 'silver',
    name: '快速学习者',
    description: '在一天内完成5个知识点',
    icon: '⚡',
    requirement: 5,
    points: 120,
  },
];

