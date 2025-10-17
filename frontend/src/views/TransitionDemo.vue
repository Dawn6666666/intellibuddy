<template>
  <div class="demo-container">
    <div class="demo-card">
      <h1>🎬 页面转场动画演示</h1>
      <p class="description">
        点击下方按钮预览登录后的转场效果
      </p>
      
      <div class="controls">
        <button @click="triggerTransition" class="demo-btn primary">
          <i class="fa-solid fa-play"></i>
          触发转场动画
        </button>
        
        <button @click="showWithCustomText" class="demo-btn secondary">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          自定义文本
        </button>
        
        <button @click="simulateLogin" class="demo-btn success">
          <i class="fa-solid fa-right-to-bracket"></i>
          模拟登录流程
        </button>
      </div>
      
      <div class="info-panel">
        <h3>✨ 转场动画特性</h3>
        <ul>
          <li>🎨 流动的渐变背景</li>
          <li>🔄 优雅的圆形加载器</li>
          <li>💫 环绕的粒子效果</li>
          <li>📊 实时进度条</li>
          <li>🏷️ 品牌 Logo 展示</li>
          <li>📱 完美响应式设计</li>
        </ul>
      </div>
      
      <div class="settings">
        <h3>⚙️ 设置</h3>
        <div class="setting-item">
          <label>持续时间（毫秒）：</label>
          <input v-model.number="duration"
type="number"
min="500"
max="5000"
step="100" />
        </div>
        <div class="setting-item">
          <label>显示文本：</label>
          <input v-model="displayText" type="text" placeholder="智学伴" />
        </div>
      </div>
    </div>
    
    <!-- 转场组件 -->
    <PageTransition 
      ref="transitionRef"
      v-model="showTransition" 
      :text="displayText"
      :duration="duration"
      @complete="onTransitionComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageTransition from '@/components/PageTransition.vue';
import { ElMessage } from 'element-plus';

const showTransition = ref(false);
const transitionRef = ref();
const duration = ref(1500);
const displayText = ref('智学伴');

// 触发转场动画
const triggerTransition = () => {
  transitionRef.value?.show();
  
  setTimeout(() => {
    transitionRef.value?.hide();
  }, duration.value);
};

// 显示自定义文本
const showWithCustomText = () => {
  const customTexts = ['WELCOME', 'LOADING', '加载中', '欢迎回来', '智学伴'];
  displayText.value = customTexts[Math.floor(Math.random() * customTexts.length)];
  triggerTransition();
};

// 模拟登录流程
const simulateLogin = () => {
  ElMessage.info('模拟登录中...');
  
  // 模拟登录延迟
  setTimeout(() => {
    transitionRef.value?.show();
    
    // 模拟页面加载
    setTimeout(() => {
      ElMessage.success('登录成功！');
      transitionRef.value?.hide();
    }, duration.value);
  }, 500);
};

// 转场完成回调
const onTransitionComplete = () => {
  console.log('转场动画完成！');
};
</script>

<style scoped>
.demo-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.demo-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

:global(.dark-theme) .demo-card {
  background: rgba(30, 30, 30, 0.9);
  color: #fff;
}

h1 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

:global(.dark-theme) .description {
  color: #aaa;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.demo-btn {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.demo-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.demo-btn:active {
  transform: translateY(0);
}

.demo-btn.primary {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  color: white;
}

.demo-btn.secondary {
  background: linear-gradient(135deg, #ec4899, #f97316);
  color: white;
}

.demo-btn.success {
  background: linear-gradient(135deg, #10b981, #06b6d4);
  color: white;
}

.info-panel {
  background: rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

:global(.dark-theme) .info-panel {
  background: rgba(139, 92, 246, 0.2);
}

.info-panel h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #8b5cf6;
}

.info-panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-panel li {
  padding: 0.5rem 0;
  font-size: 0.95rem;
  color: #555;
}

:global(.dark-theme) .info-panel li {
  color: #ccc;
}

.settings {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
}

:global(.dark-theme) .settings {
  background: rgba(59, 130, 246, 0.2);
}

.settings h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #3b82f6;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-item label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
}

:global(.dark-theme) .setting-item label {
  color: #aaa;
}

.setting-item input {
  padding: 0.75rem;
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

:global(.dark-theme) .setting-item input {
  background: rgba(50, 50, 50, 0.8);
  color: #fff;
  border-color: rgba(59, 130, 246, 0.5);
}

.setting-item input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

@media (max-width: 768px) {
  .demo-card {
    padding: 2rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .description {
    font-size: 1rem;
  }
}
</style>

