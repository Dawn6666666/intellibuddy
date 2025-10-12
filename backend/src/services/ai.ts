// backend/src/services/ai.ts
import axios from 'axios';

const KIMI_API_KEY = process.env.KIMI_API_KEY || '';
const KIMI_API_ENDPOINT = process.env.KIMI_API_ENDPOINT || 'https://api.moonshot.cn/v1/chat/completions';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * 调用 Kimi AI API 获取聊天补全
 */
export async function getChatCompletion(
  messages: ChatMessage[],
  options: ChatCompletionOptions = {}
): Promise<string> {
  const {
    model = 'moonshot-v1-8k',
    temperature = 0.7,
    maxTokens = 2000
  } = options;

  try {
    const response = await axios.post(
      KIMI_API_ENDPOINT,
      {
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${KIMI_API_KEY}`,
        },
        timeout: 60000, // 60 秒超时
      }
    );

    return response.data.choices[0]?.message?.content || '抱歉，AI 服务暂时无法响应。';
  } catch (error: any) {
    console.error('Kimi AI API 调用失败:', error.message);
    
    if (error.response) {
      console.error('API 响应错误:', error.response.data);
      throw new Error(`AI 服务错误: ${error.response.data.error?.message || error.message}`);
    } else if (error.request) {
      throw new Error('无法连接到 AI 服务，请检查网络连接');
    } else {
      throw new Error(`AI 服务调用失败: ${error.message}`);
    }
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
      content: '你是一位专业的教育辅导老师，擅长分析学生的错题并提供深入的学习建议。'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  return await getChatCompletion(messages, { maxTokens: 3000 });
}

/**
 * 解释代码
 */
export async function explainCode(
  code: string,
  language: string
): Promise<string> {
  const prompt = `请详细解释以下 ${language} 代码：

\`\`\`${language}
${code}
\`\`\`

请提供以下内容：

1. **代码功能概述**：这段代码的主要功能是什么？
2. **逐行解释**：对关键代码行进行详细解释
3. **关键概念**：涉及的重要编程概念和技术
4. **优化建议**：如果有可以改进的地方，请提出建议
5. **常见错误**：使用这种代码模式时容易犯的错误

请用 Markdown 格式输出，条理清晰，适合初学者理解。`;

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: '你是一位经验丰富的编程导师，擅长用通俗易懂的语言解释代码。'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  return await getChatCompletion(messages, { maxTokens: 3000 });
}

/**
 * AI 聊天（通用）
 */
export async function chat(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: '你是智学伴（IntelliBuddy）的 AI 助手，专门帮助学生学习和理解各种知识。你的回答应该专业、友好、富有耐心。'
    },
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage
    }
  ];

  return await getChatCompletion(messages);
}

