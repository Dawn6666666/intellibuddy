/**
 * Axios 请求封装
 * 统一的 HTTP 请求配置、拦截器、错误处理
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import router from '../router';

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器
 */
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token (使用正确的 key: authToken)
    const token = localStorage.getItem('authToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 开发环境打印请求信息
    if (import.meta.env.DEV) {
      console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params);
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    
    // 开发环境打印响应信息
    if (import.meta.env.DEV) {
      console.log(`[Response] ${response.config.url}`, data);
    }
    
    // 如果响应格式包含 success 字段
    if (data && typeof data.success !== 'undefined') {
      if (!data.success) {
        // 业务逻辑错误
        const errorMessage = data.message || data.error || '操作失败';
        ElMessage.error(errorMessage);
        return Promise.reject(new Error(errorMessage));
      }
      // 成功响应，返回 data 字段
      return data.data !== undefined ? data.data : data;
    }
    
    // 兼容没有 success 字段的响应
    return data;
  },
  (error: AxiosError<any>) => {
    console.error('[Response Error]', error);
    
    // 网络错误或服务器无响应
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        ElMessage.error('请求超时，请检查网络连接');
      } else if (error.message === 'Network Error') {
        ElMessage.error('网络连接失败，请检查您的网络');
      } else {
        ElMessage.error('网络请求失败，请稍后重试');
      }
      return Promise.reject(error);
    }
    
    const { status, data } = error.response;
    
    // 根据状态码处理错误
    switch (status) {
      case 400:
        ElMessage.error(data?.message || data?.error || '请求参数错误');
        break;
        
      case 401:
        ElMessage.error('登录已过期，请重新登录');
        // 清除 token 并跳转到登录页
        localStorage.removeItem('authToken');
        // 避免在登录页重复跳转
        if (router.currentRoute.value.name !== 'login') {
          router.push('/login');
        }
        break;
        
      case 403:
        ElMessage.error(data?.message || '没有权限访问此资源');
        break;
        
      case 404:
        ElMessage.error(data?.message || '请求的资源不存在');
        break;
        
      case 409:
        ElMessage.error(data?.message || '资源冲突');
        break;
        
      case 429:
        ElMessage.error('请求过于频繁，请稍后再试');
        break;
        
      case 500:
        ElMessage.error(data?.message || '服务器内部错误');
        break;
        
      case 502:
        ElMessage.error('网关错误，服务暂时不可用');
        break;
        
      case 503:
        ElMessage.error('服务暂时不可用，请稍后重试');
        break;
        
      default:
        ElMessage.error(data?.message || data?.error || `请求失败 (${status})`);
    }
    
    return Promise.reject(error);
  }
);

/**
 * 封装 GET 请求
 */
export function get<T = any>(url: string, params?: any): Promise<T> {
  return request.get(url, { params });
}

/**
 * 封装 POST 请求
 */
export function post<T = any>(url: string, data?: any): Promise<T> {
  return request.post(url, data);
}

/**
 * 封装 PUT 请求
 */
export function put<T = any>(url: string, data?: any): Promise<T> {
  return request.put(url, data);
}

/**
 * 封装 DELETE 请求
 */
export function del<T = any>(url: string, params?: any): Promise<T> {
  return request.delete(url, { params });
}

/**
 * 封装 PATCH 请求
 */
export function patch<T = any>(url: string, data?: any): Promise<T> {
  return request.patch(url, data);
}

/**
 * 上传文件
 */
export function upload<T = any>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<T> {
  // 获取 token
  const token = localStorage.getItem('authToken');
  
  return request.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
}

/**
 * 下载文件
 */
export function download(url: string, filename?: string, params?: any): Promise<void> {
  return request.get(url, {
    params,
    responseType: 'blob',
  }).then((data: any) => {
    // 当 responseType 为 'blob' 时，data 是 Blob 类型
    const blob = data instanceof Blob ? data : new Blob([JSON.stringify(data)]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename || 'download');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  });
}

// 导出 axios 实例，供需要自定义配置的场景使用
export default request;

