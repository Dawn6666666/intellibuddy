import { ref } from 'vue';
import { ElLoading } from 'element-plus';
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading';

/**
 * 加载状态管理 Hook
 */
export function useLoading() {
  const loading = ref(false);
  let loadingInstance: LoadingInstance | null = null;

  /**
   * 开始加载
   */
  const startLoading = (text = '加载中...', fullscreen = false) => {
    loading.value = true;
    
    if (fullscreen) {
      loadingInstance = ElLoading.service({
        lock: true,
        text,
        background: 'rgba(0, 0, 0, 0.7)'
      });
    }
  };

  /**
   * 停止加载
   */
  const stopLoading = () => {
    loading.value = false;
    
    if (loadingInstance) {
      loadingInstance.close();
      loadingInstance = null;
    }
  };

  /**
   * 包装异步函数，自动管理加载状态
   */
  const withLoading = async <T>(
    asyncFn: () => Promise<T>,
    text?: string,
    fullscreen = false
  ): Promise<T> => {
    try {
      startLoading(text, fullscreen);
      return await asyncFn();
    } finally {
      stopLoading();
    }
  };

  /**
   * 设置最小加载时间（提升体验，避免闪烁）
   */
  const withMinDuration = async <T>(
    asyncFn: () => Promise<T>,
    minDuration = 500
  ): Promise<T> => {
    const start = Date.now();
    const result = await asyncFn();
    const elapsed = Date.now() - start;
    
    if (elapsed < minDuration) {
      await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
    }
    
    return result;
  };

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading,
    withMinDuration
  };
}

