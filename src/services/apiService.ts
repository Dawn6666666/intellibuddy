// src/services/apiService.ts
import axios from 'axios';
import type {KnowledgePoint} from '@/stores/knowledge';
import type {UserInfo} from '@/stores/user';

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

// --- 新增：学习进度 API ---
/**
 * 获取当前用户的所有学习进度
 */
export const apiGetUserProgress = async (token: string) => {
    const response = await apiClient.get('/progress', {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

/**
 * 更新一个知识点的状态
 */
export const apiUpdateProgress = async (token: string, pointId: string, status: string) => {
    const response = await apiClient.post('/progress/update', {pointId, status}, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};