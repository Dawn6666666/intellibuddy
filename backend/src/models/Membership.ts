import mongoose, { Schema, Document } from 'mongoose';

export interface IMembership extends Document {
  userId: mongoose.Types.ObjectId;
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'expired' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  paymentMethod?: string;
  features: {
    maxKnowledgePoints: number;
    maxAIQuestions: number;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    customThemes: boolean;
    exportData: boolean;
    adFree: boolean;
  };
  usage: {
    knowledgePoints: number;
    aiQuestions: number;
    lastResetDate: Date;
  };
  transactions: {
    transactionId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const MembershipSchema = new Schema<IMembership>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  tier: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  autoRenew: { type: Boolean, default: false },
  paymentMethod: { type: String },
  features: {
    maxKnowledgePoints: { type: Number, default: 50 },
    maxAIQuestions: { type: Number, default: 20 },
    advancedAnalytics: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
    customThemes: { type: Boolean, default: false },
    exportData: { type: Boolean, default: false },
    adFree: { type: Boolean, default: false }
  },
  usage: {
    knowledgePoints: { type: Number, default: 0 },
    aiQuestions: { type: Number, default: 0 },
    lastResetDate: { type: Date, default: Date.now }
  },
  transactions: [{
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'CNY' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// 索引
MembershipSchema.index({ userId: 1 });
MembershipSchema.index({ tier: 1, status: 1 });
MembershipSchema.index({ endDate: 1 });

// 静态方法：获取会员等级特权
MembershipSchema.statics.getTierFeatures = function(tier: string) {
  const features: any = {
    free: {
      maxKnowledgePoints: 50,
      maxAIQuestions: 20,
      advancedAnalytics: false,
      prioritySupport: false,
      customThemes: false,
      exportData: false,
      adFree: false
    },
    basic: {
      maxKnowledgePoints: 200,
      maxAIQuestions: 100,
      advancedAnalytics: true,
      prioritySupport: false,
      customThemes: true,
      exportData: true,
      adFree: true
    },
    premium: {
      maxKnowledgePoints: 1000,
      maxAIQuestions: 500,
      advancedAnalytics: true,
      prioritySupport: true,
      customThemes: true,
      exportData: true,
      adFree: true
    },
    enterprise: {
      maxKnowledgePoints: -1, // 无限制
      maxAIQuestions: -1,
      advancedAnalytics: true,
      prioritySupport: true,
      customThemes: true,
      exportData: true,
      adFree: true
    }
  };
  return features[tier] || features.free;
};

export default mongoose.model<IMembership>('Membership', MembershipSchema);

