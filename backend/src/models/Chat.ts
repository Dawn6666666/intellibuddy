// backend/src/models/Chat.ts
import {Schema, model, Document, Types} from 'mongoose';

// 定义单条消息的接口
export interface IMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

// 定义聊天会话的接口
export interface IChat extends Document {
    userId: Types.ObjectId;
    title: string;
    messages: IMessage[];
}

const MessageSchema = new Schema<IMessage>({
    role: { type: String, required: true, enum: ['system', 'user', 'assistant'] },
    content: { type: String, required: true }
}, { _id: false });

const ChatSchema = new Schema<IChat>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, default: '新的对话' },
    messages: [MessageSchema]
}, {
    timestamps: true
});

const Chat = model<IChat>('Chat', ChatSchema);

export default Chat;