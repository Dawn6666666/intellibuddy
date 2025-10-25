// src/services/apiService.ts
import axios from 'axios';
import type {KnowledgePoint} from '@/stores/knowledge';
import type {UserInfo} from '@/stores/user';
import type {ChatMessage} from './ai';

// 修改这里：从环境变量 VITE_API_BASE_URL 读取，如果没有则默认为 /api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000, // 15秒超时
    headers: {
        'Content-Type': 'application/json',
    }
});

// 添加请求拦截器，自动添加认证token
apiClient.interceptors.request.use(
    config => {
        // 从localStorage获取token
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 添加响应拦截器，自动重试
apiClient.interceptors.response.use(
    response => response,
    async error => {
        const config = error.config;
        
        // 如果没有配置或已经重试过，直接返回错误
        if (!config || config._retry) {
            return Promise.reject(error);
        }
        
        // 对于网络错误或500错误，进行一次重试
        if (error.code === 'ECONNABORTED' || 
            error.code === 'ERR_NETWORK' || 
            error.response?.status === 500) {
            config._retry = true;
            console.log('请求失败，正在重试...');
            
            // 等待1秒后重试
            await new Promise(resolve => setTimeout(resolve, 1000));
            return apiClient.request(config);
        }
        
        return Promise.reject(error);
    }
);

// 导出 API_BASE_URL 和 apiClient 供其他组件使用
export {API_BASE_URL, apiClient};


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

export const apiGetMyStats = async (token: string) => {
    const response = await apiClient.get('/users/me/stats', {
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

// 获取单个知识点的完整详情（包含 content, contentFiles, quiz）
export const apiGetKnowledgePointDetail = async (id: string): Promise<KnowledgePoint> => {
    try {
        const response = await apiClient.get(`/knowledge-points/${id}`);
        return response.data;
    } catch (error) {
        console.error('获取知识点详情失败:', error);
        throw new Error('无法从服务器加载知识点详情。');
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

export const apiDeleteChat = async (token: string, chatId: string) => {
    const response = await apiClient.delete(`/chats/${chatId}`, {
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

export const apiAnalyzeWrongQuestion = async (token: string, questionId: string, regenerate: boolean = false) => {
    const response = await apiClient.post(`/wrong-questions/${questionId}/analyze`, { regenerate }, {
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

// 简化版：仅获取总学习时长（用于 Dashboard）
export const apiGetStudyTimeSimple = async (token: string) => {
    const response = await apiClient.get('/study-time/stats/simple', {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

// 完整版：获取详细学习时长统计（用于统计页面）
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

// --- Analytics API ---
export const apiGetSystemAnalytics = async (token: string) => {
    const response = await apiClient.get('/analytics/system', {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiGetUserStats = async (token: string) => {
    const response = await apiClient.get('/analytics/users', {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiClearLearningData = async () => {
    const response = await apiClient.delete('/users/learning-data');
    return response.data;
};

export const apiGetLearningStats = async (token: string) => {
    const response = await apiClient.get('/analytics/learning', {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiGetPopularTopics = async (token: string) => {
    const response = await apiClient.get('/analytics/popular-topics', {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiGetHourlyActivity = async (token: string) => {
    const response = await apiClient.get('/analytics/hourly-activity', {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

export const apiTrackEvent = async (token: string, event: string, metadata?: any) => {
    const response = await apiClient.post('/analytics/track', { event, metadata }, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

// 教师 - 作业管理
export const apiGetAssignmentSubmissions = async (token: string, assignmentId: string) => {
    const response = await apiClient.get(`/assignment/${assignmentId}/submissions/stats`, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

// 获取单个学生的提交详情
export const apiGetSubmissionDetail = async (token: string, submissionId: string) => {
    const response = await apiClient.get(`/assignment/submission/${submissionId}`, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return response.data;
};

// --- 统一的 API 服务对象 ---
export const apiService = {
    // 认证
    register: apiRegister,
    login: apiLogin,
    getMyProfile: apiGetMyProfile,
    getMyStats: apiGetMyStats,
    
    // 知识库
    getKnowledgePoints: apiGetKnowledgePoints,
    getKnowledgePointDetail: apiGetKnowledgePointDetail,
    
    // 学习进度
    getUserProgress: apiGetUserProgress,
    updateProgress: apiUpdateProgress,
    
    // 聊天
    getChats: apiGetChats,
    newChat: apiNewChat,
    updateChat: apiUpdateChat,
    deleteChat: apiDeleteChat,
    
    // 测验
    getQuiz: apiGetQuiz,
    submitQuiz: apiSubmitQuiz,
    
    // 评估
    startAssessment: apiStartAssessment,
    submitAssessment: apiSubmitAssessment,
    getAssessmentResult: apiGetAssessmentResult,
    
    // 学习路径
    getRecommendedPath: apiGetRecommendedPath,
    checkUnlock: apiCheckUnlock,
    
    // 错题本
    getWrongQuestions: apiGetWrongQuestions,
    getWrongQuestionStats: apiGetWrongQuestionStats,
    addWrongQuestion: apiAddWrongQuestion,
    analyzeWrongQuestion: apiAnalyzeWrongQuestion,
    markQuestionMastered: apiMarkQuestionMastered,
    resetQuestionMastery: apiResetQuestionMastery,
    deleteWrongQuestion: apiDeleteWrongQuestion,
    
    // 学习时长
    startStudySession: apiStartStudySession,
    studyHeartbeat: apiStudyHeartbeat,
    endStudySession: apiEndStudySession,
    getStudyTimeSimple: apiGetStudyTimeSimple,
    getStudyTimeStats: apiGetStudyTimeStats,
    getHeatmapData: apiGetHeatmapData,
    
    // Analytics
    getSystemAnalytics: apiGetSystemAnalytics,
    getUserStats: apiGetUserStats,
    getLearningStats: apiGetLearningStats,
    getPopularTopics: apiGetPopularTopics,
    getHourlyActivity: apiGetHourlyActivity,
    trackEvent: apiTrackEvent,
    
    // 教师 - 作业管理
    getAssignmentSubmissions: apiGetAssignmentSubmissions,
    getSubmissionDetail: apiGetSubmissionDetail,
    
    // 直接导出 apiClient 供通用请求使用
    client: apiClient
};