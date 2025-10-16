// backend/src/models/User.ts
import {Schema, model, Document} from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash?: string;
    githubId?: string;
    qqId?: string;         // 新增: QQ openid
    avatarUrl?: string;
}

const UserSchema = new Schema<IUser>({
    username: {type: String, required: true},
    email: {type: String, required: true},
    passwordHash: {type: String, required: false, select: false}, // 默认不查询密码
    githubId: { type: String },
    qqId: { type: String },
    avatarUrl: { type: String },
}, {
    timestamps: true
});

// 优化：统一在这里添加索引，避免重复定义
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ githubId: 1 }, { unique: true, sparse: true });
UserSchema.index({ qqId: 1 }, { unique: true, sparse: true });

const User = model<IUser>('User', UserSchema);

export default User;