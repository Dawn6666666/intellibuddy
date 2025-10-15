import { ElMessage, ElNotification, ElMessageBox } from 'element-plus';
import type { MessageOptions, NotificationOptions } from 'element-plus';

/**
 * 统一的通知工具 Composable
 * 替换所有 alert/confirm，提供更好的用户体验
 */
export function useNotification() {
  /**
   * 成功消息
   */
  const success = (message: string, options?: Partial<MessageOptions>) => {
    ElMessage.success({
      message,
      duration: 3000,
      showClose: true,
      ...options,
    });
  };

  /**
   * 错误消息
   */
  const error = (message: string, options?: Partial<MessageOptions>) => {
    ElMessage.error({
      message,
      duration: 4000,
      showClose: true,
      ...options,
    });
  };

  /**
   * 警告消息
   */
  const warning = (message: string, options?: Partial<MessageOptions>) => {
    ElMessage.warning({
      message,
      duration: 3000,
      showClose: true,
      ...options,
    });
  };

  /**
   * 信息消息
   */
  const info = (message: string, options?: Partial<MessageOptions>) => {
    ElMessage.info({
      message,
      duration: 3000,
      showClose: true,
      ...options,
    });
  };

  /**
   * 通知（右上角）
   */
  const notify = (
    title: string,
    message: string,
    type: 'success' | 'warning' | 'info' | 'error' = 'info',
    options?: Partial<NotificationOptions>
  ) => {
    ElNotification({
      title,
      message,
      type,
      duration: 4500,
      ...options,
    });
  };

  /**
   * 确认对话框
   */
  const confirm = async (
    message: string,
    title = '确认操作',
    options?: {
      confirmButtonText?: string;
      cancelButtonText?: string;
      type?: 'warning' | 'info' | 'success' | 'error';
    }
  ): Promise<boolean> => {
    try {
      await ElMessageBox.confirm(message, title, {
        confirmButtonText: options?.confirmButtonText || '确定',
        cancelButtonText: options?.cancelButtonText || '取消',
        type: options?.type || 'warning',
        center: true,
      });
      return true;
    } catch {
      return false;
    }
  };

  /**
   * 提示对话框
   */
  const alert = async (message: string, title = '提示', type: 'warning' | 'info' | 'success' | 'error' = 'info') => {
    try {
      await ElMessageBox.alert(message, title, {
        confirmButtonText: '知道了',
        type,
        center: true,
      });
    } catch {
      // 用户关闭对话框
    }
  };

  /**
   * 输入框对话框
   */
  const prompt = async (
    message: string,
    title = '请输入',
    options?: {
      inputPattern?: RegExp;
      inputErrorMessage?: string;
      inputPlaceholder?: string;
      inputValue?: string;
    }
  ): Promise<string | null> => {
    try {
      const { value } = await ElMessageBox.prompt(message, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: options?.inputPattern,
        inputErrorMessage: options?.inputErrorMessage,
        inputPlaceholder: options?.inputPlaceholder,
        inputValue: options?.inputValue,
        center: true,
      });
      return value;
    } catch {
      return null;
    }
  };

  /**
   * 加载中提示
   */
  const loading = (message = '加载中...') => {
    return ElMessage({
      message,
      type: 'info',
      duration: 0, // 不自动关闭
      showClose: false,
      icon: 'el-icon-loading',
    });
  };

  return {
    success,
    error,
    warning,
    info,
    notify,
    confirm,
    alert,
    prompt,
    loading,
  };
}

