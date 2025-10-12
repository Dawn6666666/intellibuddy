// backend/src/models/Assessment.ts
import {Schema, model, Document, Types} from 'mongoose';

// 用户能力画像
export interface ISkillProfile {
    subject: string; // 学科领域（如：编程基础、数据结构、算法）
    level: number; // 能力等级 0-100
}

// 弱项分析
export interface IWeakness {
    subject: string;
    reason: string; // 分析原因
    recommendedPoints: string[]; // 推荐学习的知识点ID
}

export interface IAssessment extends Document {
    userId: Types.ObjectId;
    completedAt: Date;
    totalQuestions: number;
    correctAnswers: number;
    score: number; // 总分
    skillProfile: ISkillProfile[];
    weaknesses: IWeakness[];
    recommendedPath: string[]; // 推荐学习路径（知识点ID数组）
}

const SkillProfileSchema = new Schema<ISkillProfile>({
    subject: {type: String, required: true},
    level: {type: Number, required: true, min: 0, max: 100},
}, {_id: false});

const WeaknessSchema = new Schema<IWeakness>({
    subject: {type: String, required: true},
    reason: {type: String, required: true},
    recommendedPoints: [{type: String}],
}, {_id: false});

const AssessmentSchema = new Schema<IAssessment>({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
    completedAt: {type: Date, default: Date.now},
    totalQuestions: {type: Number, required: true},
    correctAnswers: {type: Number, required: true},
    score: {type: Number, required: true, min: 0, max: 100},
    skillProfile: {type: [SkillProfileSchema], required: true},
    weaknesses: {type: [WeaknessSchema], default: []},
    recommendedPath: [{type: String}],
}, {
    timestamps: true,
});

const Assessment = model<IAssessment>('Assessment', AssessmentSchema);

export default Assessment;


