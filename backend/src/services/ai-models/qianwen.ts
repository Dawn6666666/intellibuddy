// backend/src/services/ai-models/qianwen.ts
import axios from 'axios';
import { AIModelProvider, ChatMessage, ChatCompletionOptions, ChatCompletionResponse, StreamChunk } from './base';

/**
 * 通义千问 AI 模型提供商
 */
export class QianwenProvider extends AIModelProvider {
  constructor(apiKey: string) {
    super(
      apiKey,
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      'qwen-turbo'
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
          input: {
            messages: messages.map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
          },
          parameters: {
            temperature,
            max_tokens: maxTokens,
            result_format: 'message',
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 60000,
        }
      );

      const output = response.data.output;
      return {
        content: output?.choices?.[0]?.message?.content || '',
        model: this.modelName,
        usage: response.data.usage ? {
          promptTokens: response.data.usage.input_tokens,
          completionTokens: response.data.usage.output_tokens,
          totalTokens: response.data.usage.total_tokens,
        } : undefined,
      };
    } catch (error: any) {
      console.error('[Qianwen] API 调用失败:', error.message);
      throw new Error(`通义千问 API 错误: ${error.response?.data?.message || error.message}`);
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
          input: {
            messages: messages.map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
          },
          parameters: {
            temperature,
            max_tokens: maxTokens,
            result_format: 'message',
            incremental_output: true,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'X-DashScope-SSE': 'enable',
          },
          timeout: 60000,
          responseType: 'stream',
        }
      );

      for await (const chunk of response.data) {
        const lines = chunk.toString().split('\n').filter((line: string) => line.trim() !== '');
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim();
            try {
              const parsed = JSON.parse(data);
              const content = parsed.output?.choices?.[0]?.message?.content || '';
              const finished = parsed.output?.finish_reason === 'stop';
              
              if (content) {
                yield { content, done: false };
              }
              
              if (finished) {
                yield { content: '', done: true };
                return;
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error: any) {
      console.error('[Qianwen] 流式调用失败:', error.message);
      throw new Error(`通义千问流式错误: ${error.message}`);
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

