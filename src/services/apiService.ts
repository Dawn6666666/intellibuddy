// src/services/apiService.ts
import axios from 'axios';
import type {KnowledgePoint} from '@/stores/knowledge';
import type {UserInfo} from '@/stores/user';
import type {ChatMessage} from './ai';

// 修改这里：从环境变量 VITE_API_BASE_URL 读取，如果没有则默认为 /api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 导出 API_BASE_URL 供其他组件使用
export {API_BASE_URL};


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

// --- 测验 API ---
export const apiGetQuiz = async (token: string, pointId: string) => {
    const response = await apiClient.get(`/quiz/${pointId}`, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiSubmitQuiz = async (token: string, pointId: string, answers: any[]) => {
    const response = await apiClient.post('/quiz/submit', {pointId, answers}, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

// --- 评估 API ---
export const apiStartAssessment = async (token: string) => {
    const response = await apiClient.post('/assessment/start', {}, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiSubmitAssessment = async (token: string, answers: any[]) => {
    const response = await apiClient.post('/assessment/submit', {answers}, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiGetAssessmentResult = async (token: string) => {
    const response = await apiClient.get('/assessment/result', {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

// --- 学习路径 API ---
export const apiGetRecommendedPath = async (token: string) => {
    const response = await apiClient.get('/learning-path/recommend', {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiCheckUnlock = async (token: string, pointId: string) => {
    const response = await apiClient.post('/learning-path/unlock-check', {pointId}, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

// --- 错题本 API ---
export const apiGetWrongQuestions = async (token: string, filters?: {
    subject?: string;
    mastered?: boolean;
    pointId?: string;
}) => {
    const params = new URLSearchParams();
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.mastered !== undefined) params.append('mastered', filters.mastered.toString());
    if (filters?.pointId) params.append('pointId', filters.pointId);

    const response = await apiClient.get(`/wrong-questions?${params.toString()}`, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiGetWrongQuestionStats = async (token: string) => {
    const response = await apiClient.get('/wrong-questions/stats', {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiAddWrongQuestion = async (token: string, wrongQuestionData: {
    pointId: string;
    question: string;
    options: string[];
    type: 'single' | 'multiple' | 'boolean';
    userAnswer: number | number[];
    correctAnswer: number | number[];
    explanation: string;
    difficulty?: number;
}) => {
    const response = await apiClient.post('/wrong-questions', wrongQuestionData, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiAnalyzeWrongQuestion = async (token: string, questionId: string) => {
    const response = await apiClient.post(`/wrong-questions/${questionId}/analyze`, {}, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiMarkQuestionMastered = async (token: string, questionId: string) => {
    const response = await apiClient.put(`/wrong-questions/${questionId}/master`, {}, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiResetQuestionMastery = async (token: string, questionId: string) => {
    const response = await apiClient.put(`/wrong-questions/${questionId}/reset`, {}, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiDeleteWrongQuestion = async (token: string, questionId: string) => {
    const response = await apiClient.delete(`/wrong-questions/${questionId}`, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

// --- 学习时长 API ---
export const apiStartStudySession = async (token: string, pointId?: string) => {
    const response = await apiClient.post('/study-time/start', { pointId }, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiStudyHeartbeat = async (token: string, sessionId: string) => {
    const response = await apiClient.post('/study-time/heartbeat', { sessionId }, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiEndStudySession = async (token: string, sessionId: string) => {
    const response = await apiClient.post('/study-time/end', { sessionId }, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiGetStudyTimeStats = async (token: string, filters?: {
    startDate?: string;
    endDate?: string;
}) => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await apiClient.get(`/study-time/stats?${params.toString()}`, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiGetHeatmapData = async (token: string, year?: number) => {
    const params = year ? `?year=${year}` : '';
    const response = await apiClient.get(`/study-time/heatmap${params}`, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

// --- 代码解释器 API ---
export const apiExplainCode = async (token: string, code: string, language?: string) => {
    const response = await apiClient.post('/ai/explain-code', { code, language }, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};