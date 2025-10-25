import { ElMessage, ElNotification } from 'element-plus';

/**
 * 错误类型枚举
 */
export enum ErrorType {
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

/**
 * 错误处理配置
 */
interface ErrorHandlerOptions {
  showMessage?: boolean;
  showNotification?: boolean;
  logToConsole?: boolean;
  customMessage?: string;
}

/**
 * 解析错误类型和消息
 */
function parseError(error: any): { type: ErrorType; message: string } {
  // 网络错误
  if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
    return {
      type: ErrorType.NETWORK,
      message: '网络连接失败，请检查您的网络设置'
    };
  }

  // 认证错误
  if (error.response?.status === 401 || error.response?.status === 403) {
    return {
      type: ErrorType.AUTH,
      message: '登录已过期，请重新登录'
    };
  }

  // 验证错误
  if (error.response?.status === 400 || error.response?.status === 422) {
    return {
      type: ErrorType.VALIDATION,
      message: error.response?.data?.message || '输入数据不正确，请检查后重试'
    };
  }

  // 服务器错误
  if (error.response?.status >= 500) {
    return {
      type: ErrorType.SERVER,
      message: '服务器出错了，请稍后再试'
    };
  }

  // 超时错误
  if (error.code === 'ECONNABORTED') {
    return {
      type: ErrorType.NETWORK,
      message: '请求超时，请稍后重试'
    };
  }

  // 默认错误
  return {
    type: ErrorType.UNKNOWN,
    message: error.message || error.response?.data?.message || '未知错误，请稍后重试'
  };
}

/**
 * 错误处理 Hook
 */
export function useErrorHandler() {
  /**
   * 处理错误
   */
  const handleError = (
    error: any,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showMessage = true,
      showNotification = false,
      logToConsole = true,
      customMessage
    } = options;

    const { type, message } = parseError(error);
    const displayMessage = customMessage || message;

    // 控制台日志
    if (logToConsole) {
      console.error(`[${type.toUpperCase()}]`, displayMessage, error);
    }

    // 显示消息提示
    if (showMessage) {
      ElMessage.error({
        message: displayMessage,
        duration: 3000,
        showClose: true
      });
    }

    // 显示通知
    if (showNotification) {
      ElNotification.error({
        title: '操作失败',
        message: displayMessage,
        duration: 4000
      });
    }

    return { type, message: displayMessage };
  };

  /**
   * 显示成功消息
   */
  const showSuccess = (message: string, duration = 2000) => {
    ElMessage.success({
      message,
      duration,
      showClose: true
    });
  };

  /**
   * 显示警告消息
   */
  const showWarning = (message: string, duration = 3000) => {
    ElMessage.warning({
      message,
      duration,
      showClose: true
    });
  };

  /**
   * 显示信息消息
   */
  const showInfo = (message: string, duration = 2000) => {
    ElMessage.info({
      message,
      duration,
      showClose: true
    });
  };

  /**
   * 确认对话框
   */
  const confirm = async (
    message: string,
    title = '确认操作',
    type: 'warning' | 'info' | 'success' | 'error' = 'warning'
  ): Promise<boolean> => {
    try {
      const { ElMessageBox } = await import('element-plus');
      await ElMessageBox.confirm(message, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type
      });
      return true;
    } catch {
      return false;
    }
  };

  return {
    handleError,
    showSuccess,
    showWarning,
    showInfo,
    confirm
  };
}

/**
 * 用于异步操作的错误处理包装器
 */
export async function withErrorHandler<T>(
  asyncFn: () => Promise<T>,
  errorMessage?: string
): Promise<T | null> {
  const { handleError } = useErrorHandler();
  
  try {
    return await asyncFn();
  } catch (error) {
    handleError(error, { customMessage: errorMessage });
    return null;
  }
}

