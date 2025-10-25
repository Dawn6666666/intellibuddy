import mongoose, { Schema, Document } from 'mongoose';

export interface IPoints extends Document {
  userId: mongoose.Types.ObjectId;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  level: number;
  levelName: string;
  nextLevelPoints: number;
  history: {
    type: 'earn' | 'spend' | 'expire';
    amount: number;
    reason: string;
    description?: string;
    relatedId?: mongoose.Types.ObjectId;
    relatedType?: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PointsSchema = new Schema<IPoints>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  levelName: { type: String, default: '初学者' },
  nextLevelPoints: { type: Number, default: 100 },
  history: [{
    type: {
      type: String,
      enum: ['earn', 'spend', 'expire'],
      required: true
    },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    description: { type: String },
    relatedId: { type: Schema.Types.ObjectId },
    relatedType: { type: String },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// 索引
PointsSchema.index({ userId: 1 });
PointsSchema.index({ level: 1 });

// 静态方法：获取等级信息
PointsSchema.statics.getLevelInfo = function(totalPoints: number) {
  const levels = [
    { level: 1, name: '初学者', minPoints: 0, maxPoints: 99 },
    { level: 2, name: '学徒', minPoints: 100, maxPoints: 299 },
    { level: 3, name: '学者', minPoints: 300, maxPoints: 599 },
    { level: 4, name: '专家', minPoints: 600, maxPoints: 999 },
    { level: 5, name: '大师', minPoints: 1000, maxPoints: 1999 },
    { level: 6, name: '宗师', minPoints: 2000, maxPoints: 3999 },
    { level: 7, name: '传奇', minPoints: 4000, maxPoints: 7999 },
    { level: 8, name: '神话', minPoints: 8000, maxPoints: 15999 },
    { level: 9, name: '至尊', minPoints: 16000, maxPoints: 31999 },
    { level: 10, name: '无上', minPoints: 32000, maxPoints: Infinity }
  ];

  for (const levelInfo of levels) {
    if (totalPoints >= levelInfo.minPoints && totalPoints <= levelInfo.maxPoints) {
      return {
        ...levelInfo,
        nextLevelPoints: levelInfo.maxPoints === Infinity ? 0 : levelInfo.maxPoints + 1
      };
    }
  }

  return levels[0];
};

// 实例方法：添加积分
PointsSchema.methods.addPoints = function(amount: number, reason: string, description?: string) {
  this.balance += amount;
  this.totalEarned += amount;
  this.history.push({
    type: 'earn',
    amount,
    reason,
    description,
    createdAt: new Date()
  });

  // 更新等级
  const levelInfo = (this.constructor as any).getLevelInfo(this.totalEarned);
  this.level = levelInfo.level;
  this.levelName = levelInfo.name;
  this.nextLevelPoints = levelInfo.nextLevelPoints;

  return this.save();
};

// 实例方法：消费积分
PointsSchema.methods.spendPoints = function(amount: number, reason: string, description?: string) {
  if (this.balance < amount) {
    throw new Error('积分不足');
  }

  this.balance -= amount;
  this.totalSpent += amount;
  this.history.push({
    type: 'spend',
    amount,
    reason,
    description,
    createdAt: new Date()
  });

  return this.save();
};

export default mongoose.model<IPoints>('Points', PointsSchema);

