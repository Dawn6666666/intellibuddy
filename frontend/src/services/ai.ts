// src/services/ai.ts
import axios from 'axios';
import {API_BASE_URL} from './apiService'; // 从 apiService 导入基础 URL

// 定义消息的类型接口
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

// AI 健康检查接口
export interface AIHealthStatus {
    status: 'healthy' | 'unhealthy';
    models: Record<string, boolean>;
    availableModels: string[];
    timestamp: string;
}

// 检查 AI 服务健康状态
export const checkAIHealth = async (): Promise<AIHealthStatus | null> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/ai/health`);
        if (response.data && response.data.success) {
            return response.data.data;
        }
        return null;
    } catch (error) {
        console.error('AI 健康检查失败:', error);
        return null;
    }
};

// 导出一个函数，用于发送聊天请求到我们的后端（带重试机制）
export const getChatCompletion = async (messages: ChatMessage[], retries = 2): Promise<any> => {
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
            },
            timeout: 30000 // 30秒超时
        });
        // 返回 AI 的回复消息
        // 后端返回格式: { success: true, data: { role: 'assistant', content: '...' } }
        if (response.data && response.data.data) {
            return response.data.data;
        }
        return response.data;
    } catch (error: any) {
        console.error('请求聊天结果时出错:', error);
        
        // 如果还有重试次数，则重试
        if (retries > 0) {
            console.log(`重试中... 剩余重试次数: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
            return getChatCompletion(messages, retries - 1);
        }
        
        // 返回更具体的错误提示
        let errorMessage = '抱歉，AI 服务暂时遇到了一些问题，请稍后再试。';
        
        if (error.code === 'ECONNABORTED') {
            errorMessage = '请求超时，请检查网络连接后重试。';
        } else if (error.response) {
            // 服务器返回了错误响应
            if (error.response.status === 500) {
                errorMessage = 'AI 服务暂时不可用，可能所有AI模型都繁忙，请稍后再试。';
            } else if (error.response.status === 429) {
                errorMessage = 'AI 请求过于频繁，请稍后再试。';
            } else if (error.response.data?.message) {
                errorMessage = `错误: ${error.response.data.message}`;
            }
        } else if (error.request) {
            errorMessage = '无法连接到服务器，请检查网络连接。';
        }
        
        return {
            role: 'assistant',
            content: errorMessage
        };
    }
};