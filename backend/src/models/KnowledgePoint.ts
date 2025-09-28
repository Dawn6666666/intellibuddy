// backend/src/models/KnowledgePoint.ts
import {Schema, model, Document} from 'mongoose';

// 直接定义最终的文档接口，包含了所有需要的字段
export interface IKnowledgePoint extends Document {
    id: string;
    title: string;
    subject: string;
    contentSnippet: string;
    status: 'completed' | 'in_progress' | 'not_started';
    prerequisites: string[];
}

// Schema 定义保持不变
const KnowledgePointSchema = new Schema<IKnowledgePoint>({
    id: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    subject: {type: String, required: true},
    contentSnippet: {type: String, required: true},
    status: {type: String, required: true, enum: ['completed', 'in_progress', 'not_started']},
    prerequisites: [{type: String}],
});

const KnowledgePoint = model<IKnowledgePoint>('KnowledgePoint', KnowledgePointSchema);

export default KnowledgePoint;