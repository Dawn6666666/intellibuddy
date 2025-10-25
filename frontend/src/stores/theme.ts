import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { computed, watch } from 'vue';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ColorTheme = 'default' | 'purple' | 'blue' | 'green' | 'orange' | 'pink';

export interface ThemeConfig {
  mode: ThemeMode;
  colorTheme: ColorTheme;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
}

// 主题颜色配置
const colorThemes: Record<ColorTheme, { primary: string; secondary: string }> = {
  default: {
    primary: '#8b5cf6',
    secondary: '#667eea',
  },
  purple: {
    primary: '#a855f7',
    secondary: '#9333ea',
  },
  blue: {
    primary: '#3b82f6',
    secondary: '#2563eb',
  },
  green: {
    primary: '#10b981',
    secondary: '#059669',
  },
  orange: {
    primary: '#f97316',
    secondary: '#ea580c',
  },
  pink: {
    primary: '#ec4899',
    secondary: '#db2777',
  },
};

export const useThemeStore = defineStore('theme', () => {
  const config = useStorage<ThemeConfig>('theme-config', {
    mode: 'light',
    colorTheme: 'default',
    fontSize: 'medium',
    reducedMotion: false,
  });

  // 计算当前实际主题（处理auto模式）
  const theme = computed(() => {
    if (config.value.mode === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return config.value.mode;
  });

  // 切换亮暗主题
  function toggleTheme() {
    if (config.value.mode === 'light') {
      config.value.mode = 'dark';
    } else if (config.value.mode === 'dark') {
      config.value.mode = 'auto';
    } else {
      config.value.mode = 'light';
    }
  }

  // 设置主题模式
  function setThemeMode(mode: ThemeMode) {
    config.value.mode = mode;
  }

  // 设置颜色主题
  function setColorTheme(colorTheme: ColorTheme) {
    config.value.colorTheme = colorTheme;
    applyColorTheme(colorTheme);
  }

  // 设置字体大小
  function setFontSize(fontSize: 'small' | 'medium' | 'large') {
    config.value.fontSize = fontSize;
    applyFontSize(fontSize);
  }

  // 设置是否减少动画
  function setReducedMotion(reduced: boolean) {
    config.value.reducedMotion = reduced;
    applyReducedMotion(reduced);
  }

  // 应用颜色主题到CSS变量
  function applyColorTheme(colorTheme: ColorTheme) {
    const colors = colorThemes[colorTheme];
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary);
  }

  // 应用字体大小
  function applyFontSize(fontSize: 'small' | 'medium' | 'large') {
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    document.documentElement.style.setProperty('--base-font-size', fontSizeMap[fontSize]);
    document.documentElement.style.fontSize = fontSizeMap[fontSize];
  }

  // 应用减少动画设置
  function applyReducedMotion(reduced: boolean) {
    if (reduced) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }

  // 初始化主题
  function initTheme() {
    applyColorTheme(config.value.colorTheme);
    applyFontSize(config.value.fontSize);
    applyReducedMotion(config.value.reducedMotion);

    // 监听系统主题变化（当mode为auto时）
    if (config.value.mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        // 触发重新计算
        config.value = { ...config.value };
      });
    }
  }

  // 监听主题变化
  watch(() => config.value.mode, () => {
    // 触发主题重新计算
  });

  return {
    config,
    theme,
    toggleTheme,
    setThemeMode,
    setColorTheme,
    setFontSize,
    setReducedMotion,
    initTheme,
  };
});