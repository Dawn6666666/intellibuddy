// backend/src/models/WrongQuestion.ts
import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IWrongQuestion extends Document {
    userId: Types.ObjectId;
    pointId: string;
    pointTitle: string;
    subject: string;
    question: string;
    options: string[];
    type: 'single' | 'multiple' | 'boolean';
    userAnswer: number | number[];
    correctAnswer: number | number[];
    explanation: string;
    aiAnalysis?: string; // AI 生成的深度解析
    retryCount: number;
    lastAttemptAt: Date;
    mastered: boolean;
    difficulty?: number;
    createdAt: Date;
}

const WrongQuestionSchema = new Schema<IWrongQuestion>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    pointId: { type: String, required: true, index: true },
    pointTitle: { type: String, required: true },
    subject: { type: String, required: true, index: true },
    question: { type: String, required: true },
    options: [{ type: String }],
    type: { type: String, enum: ['single', 'multiple', 'boolean'], required: true },
    userAnswer: { type: Schema.Types.Mixed, required: true },
    correctAnswer: { type: Schema.Types.Mixed, required: true },
    explanation: { type: String, required: true },
    aiAnalysis: { type: String },
    retryCount: { type: Number, default: 0 },
    lastAttemptAt: { type: Date, default: Date.now },
    mastered: { type: Boolean, default: false, index: true },
    difficulty: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

// 复合索引：用于快速查询用户的特定知识点错题
WrongQuestionSchema.index({ userId: 1, pointId: 1 });
WrongQuestionSchema.index({ userId: 1, mastered: 1 });
WrongQuestionSchema.index({ userId: 1, subject: 1 });

const WrongQuestion = (mongoose.models.WrongQuestion as mongoose.Model<IWrongQuestion>) || model<IWrongQuestion>('WrongQuestion', WrongQuestionSchema);

export default WrongQuestion;

