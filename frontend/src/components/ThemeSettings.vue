<template>
  <div class="theme-settings">
    <h3 class="settings-title">
      <i class="fa-solid fa-palette"></i>
      主题设置
    </h3>

    <!-- 亮暗模式 -->
    <div class="setting-group">
      <label class="setting-label">外观模式</label>
      <div class="theme-mode-selector">
        <button
          v-for="mode in themeModes"
          :key="mode.value"
          class="mode-btn"
          :class="{ active: themeStore.config.mode === mode.value }"
          @click="themeStore.setThemeMode(mode.value)"
        >
          <i :class="mode.icon"></i>
          <span>{{ mode.label }}</span>
        </button>
      </div>
    </div>

    <!-- 颜色主题 -->
    <div class="setting-group">
      <label class="setting-label">配色方案</label>
      <div class="color-theme-selector">
        <button
          v-for="color in colorThemes"
          :key="color.value"
          class="color-btn"
          :class="{ active: themeStore.config.colorTheme === color.value }"
          :style="{ background: color.gradient }"
          @click="themeStore.setColorTheme(color.value)"
          :title="color.label"
        >
          <i v-if="themeStore.config.colorTheme === color.value" class="fa-solid fa-check"></i>
        </button>
      </div>
    </div>

    <!-- 字体大小 -->
    <div class="setting-group">
      <label class="setting-label">字体大小</label>
      <div class="font-size-selector">
        <button
          v-for="size in fontSizes"
          :key="size.value"
          class="size-btn"
          :class="{ active: themeStore.config.fontSize === size.value }"
          @click="themeStore.setFontSize(size.value)"
        >
          <span :style="{ fontSize: size.previewSize }">A</span>
          <span class="size-label">{{ size.label }}</span>
        </button>
      </div>
    </div>

    <!-- 动画设置 -->
    <div class="setting-group">
      <label class="setting-label">动画效果</label>
      <div class="switch-container">
        <span class="switch-label">减少动画</span>
        <button
          class="switch-btn"
          :class="{ active: themeStore.config.reducedMotion }"
          @click="themeStore.setReducedMotion(!themeStore.config.reducedMotion)"
        >
          <span class="switch-slider"></span>
        </button>
      </div>
      <p class="setting-hint">
        <i class="fa-solid fa-info-circle"></i>
        减少不必要的动画效果，提升性能
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme';
import type { ThemeMode, ColorTheme } from '@/stores/theme';

const themeStore = useThemeStore();

const themeModes: Array<{ value: ThemeMode; label: string; icon: string }> = [
  { value: 'light', label: '浅色', icon: 'fa-solid fa-sun' },
  { value: 'dark', label: '深色', icon: 'fa-solid fa-moon' },
  { value: 'auto', label: '自动', icon: 'fa-solid fa-circle-half-stroke' },
];

const colorThemes: Array<{ value: ColorTheme; label: string; gradient: string }> = [
  { value: 'default', label: '默认紫', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { value: 'purple', label: '梦幻紫', gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)' },
  { value: 'blue', label: '天空蓝', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
  { value: 'green', label: '自然绿', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  { value: 'orange', label: '活力橙', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
  { value: 'pink', label: '浪漫粉', gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' },
];

const fontSizes: Array<{ value: 'small' | 'medium' | 'large'; label: string; previewSize: string }> = [
  { value: 'small', label: '小', previewSize: '14px' },
  { value: 'medium', label: '中', previewSize: '16px' },
  { value: 'large', label: '大', previewSize: '18px' },
];
</script>

<style scoped>
.theme-settings {
  padding: 1.5rem;
}

.settings-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setting-group {
  margin-bottom: 2rem;
}

.setting-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.theme-mode-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.mode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.mode-btn i {
  font-size: 1.5rem;
}

.mode-btn:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.mode-btn.active {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border-color: var(--primary-color);
  color: white;
}

.color-theme-selector {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;
}

.color-btn {
  aspect-ratio: 1;
  border: 3px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
}

.color-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.color-btn.active {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
}

.font-size-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.size-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.size-btn:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.size-btn.active {
  border-color: var(--primary-color);
  background: rgba(139, 92, 246, 0.1);
}

.size-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.switch-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.switch-label {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.switch-btn {
  position: relative;
  width: 48px;
  height: 24px;
  background: var(--border-color);
  border: none;
  border-radius: 100px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.switch-btn.active {
  background: var(--primary-color);
}

.switch-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.switch-btn.active .switch-slider {
  transform: translateX(24px);
}

.setting-hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 移动端优化 */
@media (max-width: 767px) {
  .theme-settings {
    padding: 1rem;
  }
  
  .color-theme-selector {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>


