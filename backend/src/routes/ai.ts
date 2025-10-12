// backend/src/routes/ai.ts
import {Router, Response, Request} from 'express';
import axios from 'axios';
import {authMiddleware} from './auth';

const router = Router();

const apiKey = process.env.KIMI_API_KEY;
const apiEndpoint = process.env.KIMI_API_ENDPOINT;

// 导出 AI 调用函数供其他模块使用
export async function getChatCompletion(messages: Array<{role: string; content: string}>): Promise<string> {
    if (!apiKey || !apiEndpoint) {
        throw new Error('AI 服务未配置');
    }

    try {
        const response = await axios.post(apiEndpoint, {
            model: 'moonshot-v1-8k',
            messages,
            temperature: 0.3,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('调用 AI 服务失败:', error);
        throw error;
    }
}

router.post('/chat', authMiddleware, async (req: Request, res: Response) => {
    if (!apiKey || !apiEndpoint) {
        console.error('AI 服务未在环境变量中配置');
        return res.status(500).json({message: 'AI 服务未配置'});
    }

    try {
        console.log('用户ID:', req.user?._id);

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

        res.json(response.data.choices[0].message);

    } catch (error) {
        console.error('从 Kimi 获取聊天结果时出错:', error);
        res.status(500).json({message: '调用 AI 服务时出错'});
    }
});

// 代码解释器端点
router.post('/explain-code', authMiddleware, async (req: Request, res: Response) => {
    if (!apiKey || !apiEndpoint) {
        console.error('AI 服务未在环境变量中配置');
        return res.status(500).json({message: 'AI 服务未配置'});
    }

    try {
        const { code, language } = req.body;

        if (!code) {
            return res.status(400).json({message: '缺少代码内容'});
        }

        const prompt = `作为一名专业的编程教师，请详细解释以下${language || ''}代码的功能、逻辑和关键概念：

\`\`\`${language || ''}
${code}
\`\`\`

请提供：
1. **代码功能概述**：这段代码的主要目的是什么？
2. **逐行解释**：对每一行或每个代码块的作用进行详细说明
3. **关键概念**：涉及的重要编程概念、设计模式或算法
4. **优化建议**：如果有改进空间，提供优化建议
5. **常见错误**：新手容易在这类代码中犯的错误

请用通俗易懂的语言，就像在面对面教学一样。`;

        const aiResponse = await getChatCompletion([
            { role: 'user', content: prompt }
        ]);

        res.json({ 
            explanation: aiResponse,
            language: language || 'auto-detected'
        });

    } catch (error) {
        console.error('代码解释失败:', error);
        res.status(500).json({message: '代码解释时发生错误'});
    }
});

export default router;