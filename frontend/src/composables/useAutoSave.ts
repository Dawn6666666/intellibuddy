import { ref, watch, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import { useNotification } from './useNotification';

/**
 * 自动保存 Composable
 * 用于防止用户意外退出丢失数据
 */
export function useAutoSave<T>(
  data: Ref<T>,
  saveCallback: (data: T) => Promise<void>,
  options?: {
    delay?: number; // 延迟保存时间（毫秒）
    storageKey?: string; // 本地存储 key
    enableNotification?: boolean; // 是否显示保存通知
  }
) {
  const { success, error } = useNotification();
  
  const delay = options?.delay || 2000;
  const storageKey = options?.storageKey;
  const enableNotification = options?.enableNotification ?? false;
  
  const isSaving = ref(false);
  const lastSaved = ref<Date | null>(null);
  let saveTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * 从本地存储恢复数据
   */
  const restoreFromStorage = (): T | null => {
    if (!storageKey) return null;
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to restore data from storage:', e);
    }
    
    return null;
  };

  /**
   * 保存到本地存储
   */
  const saveToStorage = (value: T) => {
    if (!storageKey) return;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to save data to storage:', e);
    }
  };

  /**
   * 执行保存
   */
  const save = async () => {
    if (isSaving.value) return;
    
    isSaving.value = true;
    
    try {
      await saveCallback(data.value);
      lastSaved.value = new Date();
      
      // 保存成功后清除本地存储
      if (storageKey) {
        localStorage.removeItem(storageKey);
      }
      
      if (enableNotification) {
        success('保存成功');
      }
    } catch (e) {
      console.error('Save failed:', e);
      if (enableNotification) {
        error('保存失败，请重试');
      }
    } finally {
      isSaving.value = false;
    }
  };

  /**
   * 延迟保存
   */
  const scheduleSave = () => {
    if (saveTimer) {
      clearTimeout(saveTimer);
    }
    
    saveTimer = setTimeout(() => {
      save();
    }, delay);
  };

  /**
   * 立即保存
   */
  const saveNow = async () => {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    await save();
  };

  /**
   * 监听数据变化
   */
  watch(
    data,
    (newValue) => {
      // 保存到本地存储（即时）
      saveToStorage(newValue);
      // 延迟保存到服务器
      scheduleSave();
    },
    { deep: true }
  );

  /**
   * 组件卸载时保存
   */
  onUnmounted(() => {
    if (saveTimer) {
      clearTimeout(saveTimer);
    }
    // 尝试同步保存（可能不会完成）
    saveNow();
  });

  return {
    isSaving,
    lastSaved,
    saveNow,
    restoreFromStorage,
  };
}

