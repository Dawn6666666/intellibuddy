import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 1. 引入 node.js 的 path 模块

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 2. 添加 resolve 配置项
  resolve: {
    alias: {
      // 设置 '@' 指向 'src' 目录
      '@': path.resolve(__dirname, './src')
    }
  }
})