import mongoose, { Schema, Document } from 'mongoose';

// 选择题选项接口
export interface IOption {
  id: string;
  content: string;
  isCorrect?: boolean; // 后端存储，前端不返回
}

// 题目接口
export interface IQuestion extends Document {
  title: string; // 题目标题
  type: 'single' | 'multiple' | 'truefalse' | 'short' | 'essay'; // 题型
  content: string; // 题目内容（可以是富文本/Markdown）
  options?: IOption[]; // 选择题选项（单选、多选、判断题使用）
  correctAnswer?: string | string[]; // 正确答案
  analysis?: string; // 题目解析
  difficulty: 'easy' | 'medium' | 'hard'; // 难度
  knowledgePoints?: mongoose.Types.ObjectId[]; // 关联知识点
  tags?: string[]; // 标签
  teacherId: mongoose.Types.ObjectId; // 创建者
  isPublic: boolean; // 是否公开（题库共享）
  usageCount: number; // 使用次数
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['single', 'multiple', 'truefalse', 'short', 'essay'], 
    required: true 
  },
  content: { type: String, required: true },
  options: [{
    id: { type: String, required: true },
    content: { type: String, required: true },
    isCorrect: { type: Boolean }
  }],
  correctAnswer: { type: Schema.Types.Mixed }, // 可以是字符串或数组
  analysis: { type: String },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    default: 'medium' 
  },
  knowledgePoints: [{ type: Schema.Types.ObjectId, ref: 'KnowledgePoint' }],
  tags: [{ type: String }],
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: false },
  usageCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// 索引
QuestionSchema.index({ teacherId: 1, type: 1 });
QuestionSchema.index({ difficulty: 1 });
QuestionSchema.index({ tags: 1 });
QuestionSchema.index({ isPublic: 1 });
QuestionSchema.index({ knowledgePoints: 1 });

// 方法：获取题目（不包含答案）
QuestionSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  
  // 移除正确答案标记（学生端使用）
  if (obj.options) {
    obj.options = obj.options.map((opt: IOption) => ({
      id: opt.id,
      content: opt.content
      // 不返回 isCorrect
    }));
  }
  
  // 移除正确答案和解析
  delete obj.correctAnswer;
  delete obj.analysis;
  
  return obj;
};

export default mongoose.model<IQuestion>('Question', QuestionSchema);

