import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId;
  recipientType: 'student' | 'teacher' | 'all';
  senderId?: mongoose.Types.ObjectId;
  type: 'assignment' | 'grade' | 'class' | 'system' | 'announcement';
  title: string;
  content: string;
  relatedId?: mongoose.Types.ObjectId;
  relatedType?: 'assignment' | 'class' | 'submission';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  readAt?: Date;
  actionUrl?: string;
  metadata?: {
    assignmentTitle?: string;
    className?: string;
    dueDate?: Date;
    score?: number;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema({
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  recipientType: {
    type: String,
    enum: ['student', 'teacher', 'all'],
    default: 'student'
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['assignment', 'grade', 'class', 'system', 'announcement'],
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  relatedId: {
    type: Schema.Types.ObjectId
  },
  relatedType: {
    type: String,
    enum: ['assignment', 'class', 'submission']
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date
  },
  actionUrl: {
    type: String
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// 索引优化
NotificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ recipientId: 1, type: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

