// src/services/ai.ts
import axios from 'axios';
import {API_BASE_URL} from './apiService'; // 从 apiService 导入基础 URL

// 定义消息的类型接口
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

// 导出一个函数，用于发送聊天请求到我们的后端
export const getChatCompletion = async (messages: ChatMessage[]) => {
    try {
        // 从 localStorage 获取 token，因为我们的后端需要验证用户身份
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('用户未登录');
        }

        const response = await axios.post(`${API_BASE_URL}/ai/chat`, {
            messages: messages,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        // 返回 AI 的回复消息
        return response.data;
    } catch (error) {
        console.error('请求聊天结果时出错:', error);
        // 返回一个友好的错误提示
        return {
            role: 'assistant',
            content: '抱歉，AI 服务暂时遇到了一些问题，请稍后再试。'
        };
    }
};