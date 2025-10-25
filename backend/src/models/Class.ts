import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  description?: string;
  teacherId: mongoose.Types.ObjectId;
  teacherName: string;
  students: {
    userId: mongoose.Types.ObjectId;
    userName: string;
    joinedAt: Date;
    status: 'active' | 'inactive';
  }[];
  subject?: string;
  grade?: string;
  semester?: string;
  settings: {
    allowStudentInvite: boolean;
    requireApproval: boolean;
    maxStudents?: number;
  };
  inviteCode: string;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>({
  name: { type: String, required: true },
  description: { type: String },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  teacherName: { type: String, required: true },
  students: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  }],
  subject: { type: String },
  grade: { type: String },
  semester: { type: String },
  settings: {
    allowStudentInvite: { type: Boolean, default: false },
    requireApproval: { type: Boolean, default: true },
    maxStudents: { type: Number }
  },
  inviteCode: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'archived'], default: 'active' }
}, {
  timestamps: true
});

// 索引
ClassSchema.index({ teacherId: 1, status: 1 });
ClassSchema.index({ inviteCode: 1 });
ClassSchema.index({ 'students.userId': 1 });

export default mongoose.model<IClass>('Class', ClassSchema);

