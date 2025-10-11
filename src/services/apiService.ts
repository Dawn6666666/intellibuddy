// src/services/apiService.ts
import axios from 'axios';
import type {KnowledgePoint} from '@/stores/knowledge';
import type {UserInfo} from '@/stores/user';
import type {ChatMessage} from './ai';

const API_BASE_URL = 'http://localhost:5001/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// --- 认证相关 API (保持不变) ---
export const apiRegister = async (userData: any) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
};
export const apiLogin = async (credentials: any) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
};
export const apiGetMyProfile = async (token: string): Promise<UserInfo> => {
    const response = await apiClient.get('/auth/me', {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

// --- 知识库 API (保持不变) ---
export const apiGetKnowledgePoints = async (): Promise<KnowledgePoint[]> => {
    try {
        const response = await apiClient.get('/knowledge-points');
        return response.data;
    } catch (error) {
        console.error('获取知识点失败:', error);
        throw new Error('无法从服务器加载知识库。');
    }
};

// --- 学习进度 API (保持不变) ---
export const apiGetUserProgress = async (token: string) => {
    const response = await apiClient.get('/progress', {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiUpdateProgress = async (token: string, pointId: string, status: string) => {
    const response = await apiClient.post('/progress/update', {pointId, status}, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

// --- 新增：聊天记录 API ---
export const apiGetChats = async (token: string) => {
    const response = await apiClient.get('/chats', {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiNewChat = async (token: string, messages: ChatMessage[]) => {
    const response = await apiClient.post('/chats/new', {messages}, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiUpdateChat = async (token: string, chatId: string, messages: ChatMessage[]) => {
    const response = await apiClient.put(`/chats/${chatId}`, {messages}, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};