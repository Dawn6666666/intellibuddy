import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFeedback extends Document {
  userId: Types.ObjectId;
  type: 'bug' | 'feature' | 'improvement' | 'other';
  category: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_review' | 'planned' | 'in_progress' | 'completed' | 'rejected';
  rating?: number; // 1-5星评分
  attachments?: string[]; // 附件URL
  screenshots?: string[]; // 截图URL
  userAgent: string;
  url: string;
  deviceInfo?: {
    platform: string;
    browser: string;
    screenResolution: string;
  };
  adminResponse?: string;
  adminUserId?: Types.ObjectId;
  votes: number; // 投票数
  voters: Types.ObjectId[]; // 投票用户ID列表
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['bug', 'feature', 'improvement', 'other'],
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_review', 'planned', 'in_progress', 'completed', 'rejected'],
      default: 'pending',
      index: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    attachments: [String],
    screenshots: [String],
    userAgent: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    deviceInfo: {
      platform: String,
      browser: String,
      screenResolution: String,
    },
    adminResponse: String,
    adminUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    votes: {
      type: Number,
      default: 0,
      index: true,
    },
    voters: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    tags: [String],
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
);

// 索引
feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ status: 1, priority: -1 });
feedbackSchema.index({ type: 1, status: 1 });
feedbackSchema.index({ votes: -1 });

export default mongoose.model<IFeedback>('Feedback', feedbackSchema);


