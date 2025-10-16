// backend/src/routes/chat.ts
import {Router, Request, Response} from 'express';
import {authMiddleware} from '../middleware/auth';
import Chat from '../models/Chat';
import {IMessage} from '../models/Chat';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const chats = await Chat.find({userId}).sort({updatedAt: -1});
        res.json(chats);
    } catch (error) {
        res.status(500).json({message: '获取聊天记录失败'});
    }
});

router.post('/new', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const {messages} = req.body as { messages: IMessage[] };

        const userMessage = messages.find(m => m.role === 'user');
        const title = userMessage ? userMessage.content.substring(0, 30) : '新的对话';

        const newChat = new Chat({
            userId,
            title,
            messages
        });
        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        res.status(500).json({message: '创建新对话失败'});
    }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const chatId = req.params.id;
        const {messages} = req.body as { messages: IMessage[] };

        const updatedChat = await Chat.findOneAndUpdate(
            {_id: chatId, userId},
            {"messages": messages},
            {new: true}
        );

        if (!updatedChat) {
            return res.status(404).json({message: '对话未找到'});
        }

        res.json(updatedChat);
    } catch (error) {
        res.status(500).json({message: '更新对话失败'});
    }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const chatId = req.params.id;

        const deletedChat = await Chat.findOneAndDelete({_id: chatId, userId});

        if (!deletedChat) {
            return res.status(404).json({message: '对话未找到或无权限删除'});
        }

        res.json({message: '对话删除成功', chatId: chatId});
    } catch (error) {
        res.status(500).json({message: '删除对话失败'});
    }
});

export default router;