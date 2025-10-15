// backend/src/services/ai-models/kimi.ts
import axios from 'axios';
import { AIModelProvider, ChatMessage, ChatCompletionOptions, ChatCompletionResponse, StreamChunk } from './base';

/**
 * Kimi (月之暗面) AI 模型提供商
 */
export class KimiProvider extends AIModelProvider {
  constructor(apiKey: string) {
    super(
      apiKey,
      'https://api.moonshot.cn/v1/chat/completions',
      'moonshot-v1-8k'
    );
  }

  async chatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<ChatCompletionResponse> {
    const { temperature = 0.7, maxTokens = 2000 } = options;

    try {
      const response = await axios.post(
        this.baseURL,
        {
          model: this.modelName,
          messages,
          temperature,
          max_tokens: maxTokens,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 60000,
        }
      );

      const choice = response.data.choices[0];
      return {
        content: choice?.message?.content || '',
        model: this.modelName,
        usage: response.data.usage ? {
          promptTokens: response.data.usage.prompt_tokens,
          completionTokens: response.data.usage.completion_tokens,
          totalTokens: response.data.usage.total_tokens,
        } : undefined,
      };
    } catch (error: any) {
      console.error('[Kimi] API 调用失败:', error.message);
      throw new Error(`Kimi API 错误: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async *streamChatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): AsyncGenerator<StreamChunk> {
    const { temperature = 0.7, maxTokens = 2000 } = options;

    try {
      const response = await axios.post(
        this.baseURL,
        {
          model: this.modelName,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 60000,
          responseType: 'stream',
        }
      );

      for await (const chunk of response.data) {
        const lines = chunk.toString().split('\n').filter((line: string) => line.trim() !== '');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              yield { content: '', done: true };
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                yield { content, done: false };
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error: any) {
      console.error('[Kimi] 流式调用失败:', error.message);
      throw new Error(`Kimi 流式错误: ${error.message}`);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.chatCompletion([{ role: 'user', content: 'Hi' }], { maxTokens: 10 });
      return true;
    } catch {
      return false;
    }
  }
}

