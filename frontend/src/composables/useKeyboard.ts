import { onMounted, onUnmounted } from 'vue';

/**
 * 键盘快捷键 Composable
 */
export function useKeyboard() {
  const listeners = new Map<string, (e: KeyboardEvent) => void>();

  /**
   * 注册快捷键
   * @param key 按键组合，如 'ctrl+k', 'esc', 'ctrl+shift+s'
   * @param callback 回调函数
   */
  const registerShortcut = (key: string, callback: (e: KeyboardEvent) => void) => {
    const normalizedKey = normalizeKey(key);
    listeners.set(normalizedKey, callback);
  };

  /**
   * 注销快捷键
   */
  const unregisterShortcut = (key: string) => {
    const normalizedKey = normalizeKey(key);
    listeners.delete(normalizedKey);
  };

  /**
   * 标准化按键字符串
   */
  const normalizeKey = (key: string): string => {
    return key
      .toLowerCase()
      .split('+')
      .sort()
      .join('+');
  };

  /**
   * 从事件构建按键字符串
   */
  const getKeyFromEvent = (e: KeyboardEvent): string => {
    const keys: string[] = [];
    
    if (e.ctrlKey || e.metaKey) keys.push('ctrl');
    if (e.altKey) keys.push('alt');
    if (e.shiftKey) keys.push('shift');
    
    const key = e.key.toLowerCase();
    if (!['control', 'alt', 'shift', 'meta'].includes(key)) {
      keys.push(key);
    }
    
    return keys.sort().join('+');
  };

  /**
   * 处理键盘事件
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    const pressedKey = getKeyFromEvent(e);
    const callback = listeners.get(pressedKey);
    
    if (callback) {
      e.preventDefault();
      callback(e);
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    listeners.clear();
  });

  return {
    registerShortcut,
    unregisterShortcut,
  };
}

/**
 * 常用快捷键预设
 */
export const SHORTCUTS = {
  SEARCH: 'ctrl+k',
  SAVE: 'ctrl+s',
  CLOSE: 'esc',
  HELP: 'ctrl+h',
  NEXT: 'ctrl+arrowright',
  PREV: 'ctrl+arrowleft',
  SUBMIT: 'ctrl+enter',
} as const;

