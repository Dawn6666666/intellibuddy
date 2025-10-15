// src/plugins/pinia-persist.ts
/**
 * Pinia 持久化插件
 * 自动保存和恢复 store 状态到 localStorage
 */

import type { PiniaPluginContext } from 'pinia';

export interface PersistOptions {
  key?: string;
  paths?: string[];
  storage?: Storage;
}

export function createPersistedState(_options: PersistOptions = {}) {
  return (context: PiniaPluginContext) => {
    const {
      store,
      options: anyOptions,
    } = context as PiniaPluginContext & { options: PiniaPluginContext['options'] & { persist?: boolean | PersistOptions } };

    const { persist } = (anyOptions as any) as { persist?: boolean | PersistOptions };

    if (!persist) return;

    const {
      key = store.$id,
      paths = [],
      storage = localStorage,
    } = typeof persist === 'object' ? persist : {};

    // 从 storage 恢复状态
    const savedState = storage.getItem(key);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        store.$patch(parsedState);
      } catch (error) {
        console.error(`[Pinia Persist] 恢复 ${key} 状态失败:`, error);
      }
    }

    // 监听状态变化并保存
    store.$subscribe(
      (_mutation, state) => {
        try {
          let stateToSave = state;

          // 如果指定了要持久化的路径，只保存这些路径
          if (paths.length > 0) {
            stateToSave = {} as any;
            paths.forEach(path => {
              const value = getNestedValue(state, path);
              setNestedValue(stateToSave, path, value);
            });
          }

          storage.setItem(key, JSON.stringify(stateToSave));
        } catch (error) {
          console.error(`[Pinia Persist] 保存 ${key} 状态失败:`, error);
        }
      },
      { detached: true }
    );
  };
}

/**
 * 获取嵌套对象的值
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * 设置嵌套对象的值
 */
function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

