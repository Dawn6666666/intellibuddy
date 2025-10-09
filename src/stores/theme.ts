import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useThemeStore = defineStore('theme', () => {
    // 【核心修改】将 useStorage 的第二个参数（默认值）从 'dark' 修改为 'light'
    const theme = useStorage('theme', 'light');

    function toggleTheme() {
        theme.value = theme.value === 'dark' ? 'light' : 'dark';
    }

    return { theme, toggleTheme };
});