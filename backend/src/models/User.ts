// backend/src/models/User.ts
import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    email: string;
    passwordHash?: string;
    githubId?: string;
    qqId?: string;         // 新增: QQ openid
    avatarUrl?: string;
    role?: 'student' | 'teacher' | 'admin';  // 用户角色
}

const UserSchema = new Schema<IUser>({
    username: {type: String, required: true},
    email: {type: String, required: true},
    passwordHash: {type: String, required: false, select: false}, // 默认不查询密码
    githubId: { type: String },
    qqId: { type: String },
    avatarUrl: { type: String },
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
}, {
    timestamps: true
});

// 优化：统一在这里添加索引，避免重复定义
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ githubId: 1 }, { unique: true, sparse: true });
UserSchema.index({ qqId: 1 }, { unique: true, sparse: true });

const User = (mongoose.models.User as mongoose.Model<IUser>) || model<IUser>('User', UserSchema);

export default User;