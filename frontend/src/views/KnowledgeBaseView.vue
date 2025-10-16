<template>
  <div class="knowledge-base-container">
    <header class="page-header">
      <h1><i class="fa-solid fa-book-sparkles"></i> 学习路线总览</h1>
      <p>探索、学习并掌握计算机科学的每一个角落。</p>
    </header>

    <div v-if="userStore.isLoading" class="loading-state">
      <p>正在加载知识库...</p>
    </div>
    <div v-else-if="knowledgeStore.error" class="error-state">
      <p>{{ knowledgeStore.error }}</p>
      <button @click="userStore.fetchInitialData">重试</button>
    </div>
    <div v-else class="cards-grid">
      <KnowledgeCard
          v-for="point in knowledgeStore.pointsAsArrayWithProgress"
          :key="point.id"
          :point="point"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKnowledgeStore } from '@/stores/knowledge';
import { useUserStore } from '@/stores/user';
import KnowledgeCard from '@/components/KnowledgeCard.vue';
import { onActivated, onDeactivated, ref } from 'vue';

const knowledgeStore = useKnowledgeStore();
const userStore = useUserStore();

// 设置组件名称，用于 keep-alive 缓存识别
defineOptions({
  name: 'KnowledgeBaseView'
});

// 保存滚动位置
const savedScrollPosition = ref(0);

// 组件被停用时（离开页面），保存滚动位置
onDeactivated(() => {
  savedScrollPosition.value = window.scrollY || document.documentElement.scrollTop;
  console.log('知识库页面被停用（缓存起来），保存滚动位置:', savedScrollPosition.value);
});

// 组件被激活时（返回页面），恢复滚动位置
onActivated(() => {
  console.log('知识库页面被激活（从缓存中恢复），恢复滚动位置:', savedScrollPosition.value);
  // 由于知识库页面没有过渡动画，可以立即恢复滚动位置
  // 使用 nextTick 确保 DOM 完全渲染
  setTimeout(() => {
    window.scrollTo(0, savedScrollPosition.value);
    console.log('✅ 滚动位置已恢复到:', savedScrollPosition.value);
  }, 0);
});
</script>

<style scoped>
/* 样式保持不变 */
.knowledge-base-container {
  width: 100%;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 28px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-header p {
  font-size: 16px;
  color: var(--text-secondary);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--card-bg);
  border-radius: var(--border-radius);
  color: var(--text-secondary);
}

.error-state button {
  margin-top: 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.error-state button:hover {
  background-color: #7a6ff0;
}
</style>