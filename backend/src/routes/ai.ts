// backend/src/routes/ai.ts
import { Router, Response, Request } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getChatCompletion, streamChatCompletion, explainCode, chat, checkAIHealth, ChatMessage } from '../services/ai';

const router = Router();

/**
 * AI 聊天端点（标准）
 */
router.post('/chat', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        success: false,
        message: '缺少必要参数: messages' 
      });
    }

    console.log(`[AI Chat] 用户 ${req.user?._id} 发起聊天请求`);

    // 如果只有一条用户消息，使用 chat 函数
    if (messages.length === 1 && messages[0].role === 'user') {
      const response = await chat(messages[0].content, [], context);
      return res.json({
        success: true,
        data: {
          role: 'assistant',
          content: response,
        },
      });
    }

    // 否则使用通用的 getChatCompletion
    const response = await getChatCompletion(messages);
    res.json({
      success: true,
      data: {
        role: 'assistant',
        content: response,
      },
    });
  } catch (error: any) {
    console.error('[AI Chat] 错误:', error.message);
    res.status(500).json({ 
      success: false,
      message: '调用 AI 服务时出错',
      error: error.message,
    });
  }
});

/**
 * AI 聊天端点（流式）
 */
router.post('/chat/stream', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        success: false,
        message: '缺少必要参数: messages' 
      });
    }

    console.log(`[AI Chat Stream] 用户 ${req.user?._id} 发起流式聊天请求`);

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 添加上下文到消息（如果提供）
    let messagesToSend: ChatMessage[] = messages;
    if (context) {
      messagesToSend = [
        {
          role: 'system',
          content: `当前学习上下文：\n${context}\n\n请基于以上上下文回答学生的问题。`,
        },
        ...messages,
      ];
    }

    try {
      for await (const chunk of streamChatCompletion(messagesToSend)) {
        if (chunk.done) {
          res.write('data: [DONE]\n\n');
          break;
        }
        res.write(`data: ${JSON.stringify({ content: chunk.content })}\n\n`);
      }
      res.end();
    } catch (streamError: any) {
      console.error('[AI Chat Stream] 流式错误:', streamError.message);
      res.write(`data: ${JSON.stringify({ error: streamError.message })}\n\n`);
      res.end();
    }
  } catch (error: any) {
    console.error('[AI Chat Stream] 错误:', error.message);
    res.status(500).json({ 
      success: false,
      message: '流式调用 AI 服务时出错',
      error: error.message,
    });
  }
});

/**
 * 代码解释器端点
 */
router.post('/explain-code', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ 
        success: false,
        message: '缺少必要参数: code' 
      });
    }

    console.log(`[Code Explainer] 用户 ${req.user?._id} 请求解释 ${language || 'unknown'} 代码`);

    const explanation = await explainCode(code, language || 'auto-detected');

    res.json({
      success: true,
      data: {
        explanation,
        language: language || 'auto-detected',
      },
    });
  } catch (error: any) {
    console.error('[Code Explainer] 错误:', error.message);
    res.status(500).json({ 
      success: false,
      message: '代码解释时发生错误',
      error: error.message,
    });
  }
});

/**
 * AI 健康检查端点
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    console.log('[AI Health] 执行健康检查...');
    const healthStatus = await checkAIHealth();
    
    const availableModels = Object.entries(healthStatus)
      .filter(([_, healthy]) => healthy)
      .map(([model]) => model);

    res.json({
      success: true,
      data: {
        status: availableModels.length > 0 ? 'healthy' : 'unhealthy',
        models: healthStatus,
        availableModels,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[AI Health] 错误:', error.message);
    res.status(500).json({ 
      success: false,
      message: '健康检查失败',
      error: error.message,
    });
  }
});

export default router;
