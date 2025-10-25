import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  description?: string;
  classId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  knowledgePoints: mongoose.Types.ObjectId[];
  type: 'practice' | 'quiz' | 'homework' | 'exam';
  difficulty: 'easy' | 'medium' | 'hard';
  totalScore: number;
  passingScore: number;
  questions: {
    questionId: mongoose.Types.ObjectId;
    score: number;
  }[];
  dueDate?: Date;
  startDate?: Date;
  duration?: number; // 分钟
  settings: {
    allowRetake: boolean;
    maxAttempts?: number;
    showAnswers: boolean;
    showScore: boolean;
    randomOrder: boolean;
  };
  submissions: {
    userId: mongoose.Types.ObjectId;
    userName: string;
    submittedAt: Date;
    score: number;
    answers: any[];
    timeSpent: number;
    attempt: number;
    status: 'submitted' | 'graded' | 'late';
  }[];
  status: 'draft' | 'published' | 'closed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  description: { type: String },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  knowledgePoints: [{ type: Schema.Types.ObjectId, ref: 'KnowledgePoint' }],
  type: { 
    type: String, 
    enum: ['practice', 'quiz', 'homework', 'exam'], 
    default: 'homework' 
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    default: 'medium' 
  },
  totalScore: { type: Number, required: true, default: 100 },
  passingScore: { type: Number, required: true, default: 60 },
  questions: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    score: { type: Number, required: true }
  }],
  dueDate: { type: Date },
  startDate: { type: Date },
  duration: { type: Number },
  settings: {
    allowRetake: { type: Boolean, default: false },
    maxAttempts: { type: Number },
    showAnswers: { type: Boolean, default: true },
    showScore: { type: Boolean, default: true },
    randomOrder: { type: Boolean, default: false }
  },
  submissions: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    score: { type: Number },
    answers: [{ type: Schema.Types.Mixed }],
    timeSpent: { type: Number },
    attempt: { type: Number, default: 1 },
    status: { 
      type: String, 
      enum: ['submitted', 'graded', 'late'], 
      default: 'submitted' 
    }
  }],
  status: { 
    type: String, 
    enum: ['draft', 'published', 'closed', 'archived'], 
    default: 'draft' 
  }
}, {
  timestamps: true
});

// 索引
AssignmentSchema.index({ classId: 1, status: 1 });
AssignmentSchema.index({ teacherId: 1 });
AssignmentSchema.index({ 'submissions.userId': 1 });
AssignmentSchema.index({ dueDate: 1 });

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);

