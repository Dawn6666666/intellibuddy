// src/services/ai.ts

import axios from 'axios';

// 1. 从环境变量中安全地获取 API Key 和端点
const apiKey = import.meta.env.VITE_KIMI_API_KEY;
const apiEndpoint = import.meta.env.VITE_KIMI_API_ENDPOINT;

// 2. 创建一个 axios 实例，用于后续的 API 请求
const apiClient = axios.create({
    baseURL: apiEndpoint,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    }
});

// 定义消息的类型接口
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

// 3. 导出一个函数，用于发送聊天请求
export const getChatCompletion = async (messages: ChatMessage[]) => {
    if (!apiKey || !apiEndpoint) {
        throw new Error('API Key or Endpoint is not configured in .env.local');
    }

    try {
        const response = await apiClient.post('', {
            model: 'moonshot-v1-8k', // 使用 Kimi 的模型
            messages: messages,
            temperature: 0.3,
        });
        // 返回 AI 的回复消息
        return response.data.choices[0].message;
    } catch (error) {
        console.error('Error fetching chat completion:', error);
        // 返回一个友好的错误提示
        return {
            role: 'assistant',
            content: '抱歉，AI 服务暂时遇到了一些问题，请稍后再试。'
        };
    }
};