// backend/src/models/StudySession.ts
import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IStudySession extends Document {
    userId: Types.ObjectId;
    pointId?: string;
    pointTitle?: string;
    subject?: string;
    startTime: Date;
    endTime?: Date;
    duration: number; // 秒
    active: boolean; // 是否为活跃学习（非挂机）
    activityCount: number; // 活动次数（用于判断是否挂机）
}

const StudySessionSchema = new Schema<IStudySession>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    pointId: { type: String, index: true },
    pointTitle: { type: String },
    subject: { type: String, index: true },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date },
    duration: { type: Number, default: 0 }, // 秒
    active: { type: Boolean, default: true },
    activityCount: { type: Number, default: 0 }
}, {
    timestamps: true,
});

// 复合索引：用于快速查询用户的学习记录
StudySessionSchema.index({ userId: 1, startTime: -1 });
StudySessionSchema.index({ userId: 1, pointId: 1 });

const StudySession = (mongoose.models.StudySession as mongoose.Model<IStudySession>) || model<IStudySession>('StudySession', StudySessionSchema);

export default StudySession;

