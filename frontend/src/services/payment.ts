import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// 创建支付会话
export const createCheckoutSession = async (tier: string, period: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/payment/create-checkout-session`,
      { tier, period },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || '创建支付会话失败');
  }
};

// 验证支付会话
export const verifySession = async (sessionId: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/payment/verify-session/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || '验证支付会话失败');
  }
};

// 获取价格列表
export const getPrices = async () => {
  try {
    const response = await axios.get(`${API_URL}/payment/prices`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || '获取价格列表失败');
  }
};

// 获取支付历史
export const getPaymentHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/payment/history`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || '获取支付历史失败');
  }
};

// 取消订阅
export const cancelSubscription = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/payment/cancel-subscription`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || '取消订阅失败');
  }
};

