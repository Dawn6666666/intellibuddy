import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  // 构建优化
  build: {
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 Vue 相关库打包到一起
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // Element Plus 单独打包
          'element-plus': ['element-plus', '@element-plus/icons-vue'],
          // 图表库单独打包
          'charts': ['echarts', 'vue-echarts', '@antv/x6', '@antv/x6-vue-shape'],
          // Markdown 相关
          'markdown': ['marked', 'marked-katex-extension', 'katex', 'highlight.js'],
        },
      },
    },
    // 压缩优化
    minify: 'esbuild',
    // chunk 大小警告限制
    chunkSizeWarningLimit: 1000,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 构建输出目录
    outDir: 'dist',
    // 静态资源处理
    assetsInlineLimit: 4096, // 小于 4kb 的资源内联为 base64
  },

  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios',
      'element-plus',
      '@element-plus/icons-vue',
      'echarts',
      'vue-echarts',
      '@antv/x6',
      'marked',
      'katex',
      'highlight.js'
    ],
  },
})