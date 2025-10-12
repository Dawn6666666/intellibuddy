// backend/src/models/UserProgress.ts
import {Schema, model, Document, Types} from 'mongoose';

export interface IUserProgress extends Document {
    userId: Types.ObjectId;
    pointId: string;
    status: 'not_started' | 'in_progress' | 'completed';
    quizAttempts: number;
    bestScore: number;
    timeSpent: number; // 学习时长（分钟）
    lastAttemptAt?: Date;
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
}, {
    timestamps: true,
});

// 创建复合唯一索引
UserProgressSchema.index({userId: 1, pointId: 1}, {unique: true});

const UserProgress = model<IUserProgress>('UserProgress', UserProgressSchema);

export default UserProgress;