// backend/src/models/UserProgress.ts
import {Schema, model, Document, Types} from 'mongoose';

export interface IUserProgress extends Document {
    userId: Types.ObjectId;
    pointId: string;
    status: 'not_started' | 'in_progress' | 'completed';
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
}, {
    timestamps: true,
    // 1. 移除了这里错误的 unique 和 index 选项
});

// 2. 新增：在这里使用 index() 方法来创建复合唯一索引
UserProgressSchema.index({userId: 1, pointId: 1}, {unique: true});


const UserProgress = model<IUserProgress>('UserProgress', UserProgressSchema);

export default UserProgress;