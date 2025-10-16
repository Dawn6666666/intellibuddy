// backend/src/services/ai.ts
import {
  AIModelProvider,
  ChatMessage,
  ChatCompletionOptions,
  KimiProvider,
  QianwenProvider,
  ErnieProvider,
  ZhipuProvider,
} from './ai-models';

/**
 * AI 模型类型
 */
export type AIModelType = 'kimi' | 'qianwen' | 'ernie' | 'zhipu';

/**
 * AI 服务配置
 */
interface AIServiceConfig {
  primaryModel: AIModelType;
  fallbackModels: AIModelType[];
  enableCache?: boolean;
}

/**
 * AI 服务管理器 - 支持多模型和智能降级
 */
class AIService {
  private providers: Map<AIModelType, AIModelProvider> = new Map();
  private config: AIServiceConfig;
  private cache: Map<string, { content: string; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 3600000; // 1小时缓存

  constructor(config: AIServiceConfig) {
    this.config = config;
    this.initializeProviders();
  }

  /**
   * 初始化所有可用的 AI 模型提供商
   */
  private initializeProviders() {
    // Kimi (月之暗面)
    const kimiKey = process.env.KIMI_API_KEY;
    if (kimiKey) {
      this.providers.set('kimi', new KimiProvider(kimiKey));
      console.log('[AI Service] Kimi 模型已加载');
    }

    // 通义千问
    const qianwenKey = process.env.QIANWEN_API_KEY;
    if (qianwenKey) {
      this.providers.set('qianwen', new QianwenProvider(qianwenKey));
      console.log('[AI Service] 通义千问模型已加载');
    }

    // 文心一言
    const ernieKey = process.env.ERNIE_API_KEY;
    const ernieSecret = process.env.ERNIE_SECRET_KEY;
    if (ernieKey && ernieSecret) {
      this.providers.set('ernie', new ErnieProvider(ernieKey, ernieSecret));
      console.log('[AI Service] 文心一言模型已加载');
    }

    // 智谱 AI
    const zhipuKey = process.env.ZHIPU_API_KEY;
    if (zhipuKey) {
      this.providers.set('zhipu', new ZhipuProvider(zhipuKey));
      console.log('[AI Service] 智谱 AI 模型已加载');
    }

    console.log(`[AI Service] 共加载 ${this.providers.size} 个 AI 模型`);
  }

  /**
   * 生成缓存键
   */
  private getCacheKey(messages: ChatMessage[], options: ChatCompletionOptions): string {
    return JSON.stringify({ messages, options });
  }

  /**
   * 从缓存获取
   */
  private getFromCache(key: string): string | null {
    if (!this.config.enableCache) return null;

    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log('[AI Service] 使用缓存结果');
      return cached.content;
    }
    return null;
  }

  /**
   * 保存到缓存
   */
  private saveToCache(key: string, content: string) {
    if (!this.config.enableCache) return;
    
    this.cache.set(key, {
      content,
      timestamp: Date.now(),
    });

    // 限制缓存大小
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value as string | undefined;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
  }

  /**
   * 获取聊天补全（带智能降级）
   */
  async getChatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<string> {
    // 检查缓存
    const cacheKey = this.getCacheKey(messages, options);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // 尝试使用主模型
    const modelsToTry = [
      this.config.primaryModel,
      ...this.config.fallbackModels,
    ];

    let lastError: Error | null = null;

    for (const modelType of modelsToTry) {
      const provider = this.providers.get(modelType);
      if (!provider) continue;

      try {
        console.log(`[AI Service] 尝试使用 ${modelType} 模型...`);
        const response = await provider.chatCompletion(messages, options);
        
        // 保存到缓存
        this.saveToCache(cacheKey, response.content);
        
        console.log(`[AI Service] ${modelType} 模型调用成功`);
        return response.content;
      } catch (error: any) {
        console.error(`[AI Service] ${modelType} 模型失败:`, error.message);
        lastError = error;
        // 继续尝试下一个模型
      }
    }

    // 所有模型都失败
    throw new Error(
      `所有 AI 模型均不可用。最后错误: ${lastError?.message || '未知错误'}`
    );
  }

  /**
   * 获取流式聊天补全
   */
  async *streamChatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ) {
    const modelsToTry = [
      this.config.primaryModel,
      ...this.config.fallbackModels,
    ];

    let lastError: Error | null = null;

    for (const modelType of modelsToTry) {
      const provider = this.providers.get(modelType);
      if (!provider) continue;

      try {
        console.log(`[AI Service] 流式调用 ${modelType} 模型...`);
        for await (const chunk of provider.streamChatCompletion(messages, options)) {
          yield chunk;
        }
        return; // 成功完成
      } catch (error: any) {
        console.error(`[AI Service] ${modelType} 流式调用失败:`, error.message);
        lastError = error;
        // 继续尝试下一个模型
      }
    }

    // 所有模型都失败
    throw new Error(
      `所有 AI 模型流式调用均失败。最后错误: ${lastError?.message || '未知错误'}`
    );
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear();
    console.log('[AI Service] 缓存已清除');
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<Record<AIModelType, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const [modelType, provider] of this.providers.entries()) {
      try {
        results[modelType] = await provider.healthCheck();
      } catch {
        results[modelType] = false;
      }
    }
    
    return results as Record<AIModelType, boolean>;
  }
}

// 创建 AI 服务单例
const aiService = new AIService({
  primaryModel: (process.env.PRIMARY_AI_MODEL as AIModelType) || 'kimi',
  fallbackModels: ['qianwen', 'zhipu', 'ernie'].filter(
    m => m !== process.env.PRIMARY_AI_MODEL
  ) as AIModelType[],
  enableCache: process.env.ENABLE_AI_CACHE === 'true',
});

/**
 * 导出便捷函数 - 获取聊天补全
 */
export async function getChatCompletion(
  messages: ChatMessage[],
  options: ChatCompletionOptions = {}
): Promise<string> {
  return aiService.getChatCompletion(messages, options);
}

/**
 * 导出便捷函数 - 流式聊天补全
 */
export async function* streamChatCompletion(
  messages: ChatMessage[],
  options: ChatCompletionOptions = {}
) {
  for await (const chunk of aiService.streamChatCompletion(messages, options)) {
    yield chunk;
  }
}

/**
 * 生成错题深度解析
 */
export async function analyzeWrongQuestion(
  question: string,
  options: string[],
  correctAnswer: string,
  userAnswer: string,
  standardExplanation: string,
  pointTitle: string
): Promise<string> {
  const prompt = `你是一位经验丰富的教育专家。请对以下错题进行深度分析：

**题目**: ${question}

**选项**:
${options.map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`).join('\n')}

**正确答案**: ${correctAnswer}
**学生答案**: ${userAnswer}
**标准解析**: ${standardExplanation}
**知识点**: ${pointTitle}

请提供以下内容：

1. **错误原因分析**：为什么学生会选择错误答案？可能的思维误区在哪里？
2. **知识点详解**：相关知识点的核心概念和原理是什么？
3. **记忆技巧**：有什么好的记忆方法或口诀？
4. **知识拓展**：相关的其他重要知识点是什么？

请用 Markdown 格式输出，条理清晰，易于理解。`;

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: '你是一位专业的教育辅导老师，擅长分析学生的错题并提供深入的学习建议。',
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  return await getChatCompletion(messages, { maxTokens: 3000 });
}

/**
 * AI 聊天（通用）
 */
export async function chat(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  context?: string
): Promise<string> {
  const systemPrompt = context
    ? `你是智学伴（IntelliBuddy）的 AI 助手，专门帮助学生学习和理解各种知识。你的回答应该专业、友好、富有耐心。

当前学习上下文：
${context}

请基于以上上下文回答学生的问题，提供精准、相关的学习指导。`
    : '你是智学伴（IntelliBuddy）的 AI 助手，专门帮助学生学习和理解各种知识。你的回答应该专业、友好、富有耐心。';

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage,
    },
  ];

  return await getChatCompletion(messages);
}

/**
 * 生成学习报告
 */
export async function generateLearningReport(
  userName: string,
  studyStats: {
    totalTime: number;
    completedPoints: number;
    totalPoints: number;
    weakAreas: string[];
    strongAreas: string[];
    recentProgress: string[];
  }
): Promise<string> {
  const prompt = `你是一位专业的学习顾问。请为学生生成一份个性化的学习报告。

**学生**: ${userName}

**学习数据**:
- 总学习时长: ${Math.floor(studyStats.totalTime / 3600)} 小时 ${Math.floor((studyStats.totalTime % 3600) / 60)} 分钟
- 已完成知识点: ${studyStats.completedPoints} / ${studyStats.totalPoints}
- 薄弱领域: ${studyStats.weakAreas.join('、')}
- 擅长领域: ${studyStats.strongAreas.join('、')}
- 近期学习进展: ${studyStats.recentProgress.join('、')}

请生成一份包含以下内容的学习报告（使用 Markdown 格式）：

1. **学习总结**：对整体学习情况的评价
2. **优势分析**：表扬学生的强项和进步
3. **改进建议**：针对薄弱领域的具体学习建议
4. **下周目标**：推荐的学习目标和计划
5. **激励寄语**：给学生的鼓励和期望

语气要温和、积极、富有鼓励性。`;

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: '你是一位温和、专业的学习顾问，擅长分析学习数据并给出建设性的反馈。',
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  return await getChatCompletion(messages, { maxTokens: 2000 });
}

/**
 * 清除 AI 缓存
 */
export function clearAICache() {
  aiService.clearCache();
}

/**
 * AI 健康检查
 */
export async function checkAIHealth() {
  return aiService.healthCheck();
}

// 导出类型
export type { ChatMessage, ChatCompletionOptions };
