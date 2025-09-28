// backend/src/models/User.ts
import {Schema, model, Document} from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
}

const UserSchema = new Schema<IUser>({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
}, {
    timestamps: true // 自动添加 createdAt 和 updatedAt 字段
});

const User = model<IUser>('User', UserSchema);

export default User;