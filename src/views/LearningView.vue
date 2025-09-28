<template>
  <div class="learning-container" v-if="knowledgePoint">
    <header class="page-header">
      <h1>{{ knowledgePoint.title }}</h1>
      <p>{{ knowledgePoint.contentSnippet }}</p>
    </header>

    <div class="main-content">
      <div class="card content-card">
        <div class="card-header">
          <h3><i class="fa-solid fa-book-open"></i> 学习内容</h3>
          <button class="context-ask-btn" @click="askWithContext">
            <i class="fa-solid fa-lightbulb-question"></i>
            <span>就此提问</span>
          </button>
        </div>
        <div class="markdown-body">
          <p>知识点的完整内容区域...</p>
          <p>为了演示，这里假设内容是关于 <strong>{{ knowledgePoint.title }}</strong> 的详细讲解。</p>
        </div>
      </div>
      <div class="side-panel">
        <div class="card quiz-card">
          <h3><i class="fa-solid fa-clipboard-question"></i> 知识点测验</h3>
          <p class="placeholder-text">测验模块即将上线...</p>
        </div>
        <div class="card ai-card">
          <h3><i class="fa-solid fa-brain"></i> AI 助教</h3>
          <p class="placeholder-text">AI 问答区域即将上线...</p>
        </div>
      </div>
    </div>

  </div>
  <div v-else class="loading">
    <p>知识点加载中或不存在...</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useKnowledgeStore } from '@/stores/knowledge'
import { useUserStore } from '@/stores/user'; // 【新增】

const route = useRoute()
const knowledgeStore = useKnowledgeStore()
const userStore = useUserStore(); // 【新增】

const pointId = computed(() => route.params.pointId as string)

const knowledgePoint = computed(() => {
  return knowledgeStore.knowledgePoints.get(pointId.value)
})

// 【重要新增】处理情境提问的函数
const askWithContext = () => {
  if (knowledgePoint.value) {
    userStore.setChatContext(knowledgePoint.value); // 1. 设置情境
    userStore.toggleChat(true); // 2. 打开聊天窗口
  }
}
</script>

<style scoped>
.learning-container {
  width: 100%;
}
.page-header {
  margin-bottom: 30px;
}
.page-header h1 {
  font-size: 28px;
  margin-bottom: 8px;
}
.page-header p {
  font-size: 16px;
  color: var(--text-secondary);
}
.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  align-items: flex-start;
}
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.card {
  background: var(--card-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  -webkit-backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  padding: 24px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.card h3 {
  font-size: 18px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.placeholder-text {
  color: var(--text-secondary);
  text-align: center;
  padding: 20px 0;
}
.loading {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: var(--text-secondary);
}

/* 【新增】情境提问按钮样式 */
.context-ask-btn {
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.context-ask-btn:hover {
  background-color: var(--primary-color);
  color: white;
}
</style>