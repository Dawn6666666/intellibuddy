// backend/src/models/KnowledgePoint.ts
import {Schema, model, Document} from 'mongoose';

// 测验题目接口
export interface IQuizQuestion {
    question: string;
    type: 'single' | 'multiple' | 'boolean';
    options: string[];
    correctAnswer: number | number[]; // 单选为数字，多选为数组
    explanation: string;
}

// 图谱位置接口
export interface IGraphPosition {
    x: number;
    y: number;
}

// 直接定义最终的文档接口，包含了所有需要的字段
export interface IKnowledgePoint extends Document {
    id: string;
    title: string;
    subject: string;
    contentSnippet: string;
    status: 'completed' | 'in_progress' | 'not_started';
    prerequisites: string[];
    quiz: IQuizQuestion[];
    difficulty: number; // 1-5难度等级
    estimatedTime: number; // 预计学习时长（分钟）
    graphPosition: IGraphPosition;
}

// Schema 定义
const QuizQuestionSchema = new Schema<IQuizQuestion>({
    question: {type: String, required: true},
    type: {type: String, required: true, enum: ['single', 'multiple', 'boolean']},
    options: [{type: String}],
    correctAnswer: {type: Schema.Types.Mixed, required: true},
    explanation: {type: String, required: true},
}, {_id: false});

const GraphPositionSchema = new Schema<IGraphPosition>({
    x: {type: Number, required: true},
    y: {type: Number, required: true},
}, {_id: false});

const KnowledgePointSchema = new Schema<IKnowledgePoint>({
    id: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    subject: {type: String, required: true},
    contentSnippet: {type: String, required: true},
    status: {type: String, required: true, enum: ['completed', 'in_progress', 'not_started']},
    prerequisites: [{type: String}],
    quiz: {type: [QuizQuestionSchema], default: []},
    difficulty: {type: Number, required: true, min: 1, max: 5, default: 3},
    estimatedTime: {type: Number, required: true, default: 30},
    graphPosition: {type: GraphPositionSchema, required: true},
});

const KnowledgePoint = model<IKnowledgePoint>('KnowledgePoint', KnowledgePointSchema);

export default KnowledgePoint;