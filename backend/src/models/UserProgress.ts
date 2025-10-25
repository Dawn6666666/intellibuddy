// backend/src/models/UserProgress.ts
import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IUserProgress extends Document {
    userId: Types.ObjectId;
    pointId: string;
    status: 'not_started' | 'in_progress' | 'completed';
    quizAttempts: number;
    bestScore: number;
    score?: number; // 别名，指向bestScore
    timeSpent: number; // 学习时长（分钟）
    lastAttemptAt?: Date;
    completedAt?: Date; // 完成时间
    updatedAt?: Date; // 更新时间（timestamps提供）
    createdAt?: Date; // 创建时间（timestamps提供）
}

const UserProgressSchema = new Schema<IUserProgress>({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    pointId: {type: String, required: true},
    status: {
        type: String,
        required: true,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started',
    },
    quizAttempts: {type: Number, default: 0},
    bestScore: {type: Number, default: 0, min: 0, max: 100},
    timeSpent: {type: Number, default: 0},
    lastAttemptAt: {type: Date},
    completedAt: {type: Date},
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// 虚拟属性：score作为bestScore的别名
UserProgressSchema.virtual('score').get(function() {
    return this.bestScore;
});

// 创建复合唯一索引
UserProgressSchema.index({userId: 1, pointId: 1}, {unique: true});

const UserProgress = (mongoose.models.UserProgress as mongoose.Model<IUserProgress>) || model<IUserProgress>('UserProgress', UserProgressSchema);

export default UserProgress;