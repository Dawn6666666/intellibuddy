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
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: false},
    githubId: { type: String, unique: true, sparse: true },
    qqId: { type: String, unique: true, sparse: true }, // 新增
    avatarUrl: { type: String },
}, {
    timestamps: true
});

const User = model<IUser>('User', UserSchema);

export default User;