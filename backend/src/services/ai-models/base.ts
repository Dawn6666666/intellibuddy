// backend/src/services/ai-models/base.ts
/**
 * AI 模型基础接口定义
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

/**
 * AI 模型提供商基类
 */
export abstract class AIModelProvider {
  protected apiKey: string;
  protected baseURL: string;
  protected modelName: string;

  constructor(apiKey: string, baseURL: string, modelName: string) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.modelName = modelName;
  }

  /**
   * 获取聊天补全
   */
  abstract chatCompletion(
    messages: ChatMessage[],
    options?: ChatCompletionOptions
  ): Promise<ChatCompletionResponse>;

  /**
   * 流式聊天补全
   */
  abstract streamChatCompletion(
    messages: ChatMessage[],
    options?: ChatCompletionOptions
  ): AsyncGenerator<StreamChunk>;

  /**
   * 健康检查
   */
  abstract healthCheck(): Promise<boolean>;

  /**
   * 获取模型名称
   */
  getModelName(): string {
    return this.modelName;
  }
}

