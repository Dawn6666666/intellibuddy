// backend/src/services/ai-models/ernie.ts
import axios from 'axios';
import { AIModelProvider, ChatMessage, ChatCompletionOptions, ChatCompletionResponse, StreamChunk } from './base';

/**
 * 文心一言 AI 模型提供商
 */
export class ErnieProvider extends AIModelProvider {
  private accessToken: string = '';
  private tokenExpireTime: number = 0;

  constructor(apiKey: string, secretKey: string) {
    super(
      apiKey,
      'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
      'ERNIE-Bot-turbo'
    );
    this.secretKey = secretKey;
  }

  private secretKey: string;

  /**
   * 获取访问令牌
   */
  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    
    // 如果 token 未过期，直接返回
    if (this.accessToken && this.tokenExpireTime > now) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        'https://aip.baidubce.com/oauth/2.0/token',
        null,
        {
          params: {
            grant_type: 'client_credentials',
            client_id: this.apiKey,
            client_secret: this.secretKey,
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpireTime = now + (response.data.expires_in - 60) * 1000; // 提前1分钟过期
      return this.accessToken;
    } catch (error: any) {
      console.error('[Ernie] 获取访问令牌失败:', error.message);
      throw new Error(`文心一言认证失败: ${error.message}`);
    }
  }

  async chatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<ChatCompletionResponse> {
    const { temperature = 0.7, maxTokens = 2000 } = options;
    const accessToken = await this.getAccessToken();

    try {
      const response = await axios.post(
        `${this.baseURL}?access_token=${accessToken}`,
        {
          messages: messages.map(msg => ({
            role: msg.role === 'system' ? 'user' : msg.role, // 文心一言不支持 system 角色
            content: msg.content,
          })),
          temperature,
          max_output_tokens: maxTokens,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      return {
        content: response.data.result || '',
        model: this.modelName,
        usage: response.data.usage ? {
          promptTokens: response.data.usage.prompt_tokens,
          completionTokens: response.data.usage.completion_tokens,
          totalTokens: response.data.usage.total_tokens,
        } : undefined,
      };
    } catch (error: any) {
      console.error('[Ernie] API 调用失败:', error.message);
      throw new Error(`文心一言 API 错误: ${error.response?.data?.error_msg || error.message}`);
    }
  }

  async *streamChatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): AsyncGenerator<StreamChunk> {
    const { temperature = 0.7, maxTokens = 2000 } = options;
    const accessToken = await this.getAccessToken();

    try {
      const response = await axios.post(
        `${this.baseURL}?access_token=${accessToken}`,
        {
          messages: messages.map(msg => ({
            role: msg.role === 'system' ? 'user' : msg.role,
            content: msg.content,
          })),
          temperature,
          max_output_tokens: maxTokens,
          stream: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
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
            try {
              const parsed = JSON.parse(data);
              const content = parsed.result || '';
              const isEnd = parsed.is_end;
              
              if (content) {
                yield { content, done: false };
              }
              
              if (isEnd) {
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
      console.error('[Ernie] 流式调用失败:', error.message);
      throw new Error(`文心一言流式错误: ${error.message}`);
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

