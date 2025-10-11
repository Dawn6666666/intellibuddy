// backend/src/routes/ai.ts
import {Router, Response} from 'express';
import axios from 'axios';
import {authMiddleware, AuthRequest} from './auth';

const router = Router();

// 从环境变量中安全地读取密钥和端点
const apiKey = process.env.KIMI_API_KEY;
const apiEndpoint = process.env.KIMI_API_ENDPOINT;

router.post('/chat', authMiddleware, async (req: AuthRequest, res: Response) => {
    if (!apiKey || !apiEndpoint) {
        console.error('AI 服务未在环境变量中配置');
        return res.status(500).json({message: 'AI 服务未配置'});
    }

    try {
        const response = await axios.post(apiEndpoint, {
            model: 'moonshot-v1-8k',
            messages: req.body.messages,
            temperature: 0.3,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });

        // 将 Kimi API 的响应直接返回给前端
        res.json(response.data.choices[0].message);

    } catch (error) {
        console.error('从 Kimi 获取聊天结果时出错:', error);
        res.status(500).json({message: '调用 AI 服务时出错'});
    }
});

export default router;