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
        <div class="markdown-body" v-html="contentHtml"></div>
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
import {computed, ref, watchEffect} from 'vue';
import {useRoute} from 'vue-router';
import {useKnowledgeStore} from '@/stores/knowledge';
import {useUserStore} from '@/stores/user';
import {marked} from 'marked';

const route = useRoute();
const knowledgeStore = useKnowledgeStore();
const userStore = useUserStore();

const pointId = computed(() => route.params.pointId as string);

const knowledgePoint = computed(() => {
  return knowledgeStore.pointsAsArrayWithProgress.find(p => p.id === pointId.value);
});

const askWithContext = () => {
  if (knowledgePoint.value) {
    userStore.setChatContext(knowledgePoint.value);
    userStore.toggleChat(true);
  }
};

const contentHtml = ref('<p>正在加载学习内容...</p>');

// 【核心修改】扩展知识点 ID 到 Markdown 文件路径的映射
const contentMap: Record<string, string> = {
  // --- JavaSE 核心内容 ---
  'cs-y1-s1-c1': '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（一）走进Java语言.md', // 编程导论
  'cs-y1-s1-c2': '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（二）面向过程编程.md', // 离散数学基础 (暂时用面向过程编程代替)
  'cs-y1-s2-c1': '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（四）面向对象高级篇.md', // 高级编程
  'cs-y1-s2-c3': '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（五）泛型程序设计.md', // 数据结构入门
  'cs-y2-s3-c1': '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（八）GUI程序开发.md', // 计算机组成原理 (暂时用GUI代替)
  'cs-y2-s3-c2': '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（六）集合类与IO.md', // 数据结构与算法
  'cs-y3-s5-c1': '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（七）多线程与反射.md', // 操作系统

  // --- JavaWeb 内容 ---
  'cs-y2-s4-c3': '/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（二）数据库基础.md', // 数据库基础
  'cs-y3-s5-c2': '/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（一）Java网络编程.md', // 计算机网络
  'cs-y3-s6-c1': '/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（五）后端开发.md', // 软件工程 (用后端开发代替)
  'cs-y1-s2-c1-extra': '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（三）面向对象基础.md', // 补充：面向对象基础
  'cs-y2-s4-c3-extra': '/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（三）Java与数据库.md', // 补充：Java与数据库
  'cs-y1-s1-c1-extra': '/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（四）前端基础.md' // 补充：前端基础
};

watchEffect(async () => {
  if (pointId.value) {
    const filePath = contentMap[pointId.value];
    if (filePath) {
      try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`File not found: ${filePath}`);
        const markdownText = await response.text();
        contentHtml.value = await marked.parse(markdownText);
      } catch (error) {
        console.error("Failed to load knowledge content:", error);
        contentHtml.value = '<p style="color: #ff8a8a;">抱歉，该知识点的详细内容暂时无法加载。</p>';
      }
    } else {
      // 如果没有匹配的笔记，显示默认提示
      contentHtml.value = '<p>该知识点的详细内容即将上线，敬请期待！</p>';
    }
  }
});

</script>

<style scoped>
/* 样式部分保持不变 */
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

.content-card {
  min-height: 500px;
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

.markdown-body {
  line-height: 1.7;
  color: var(--text-primary);
}

.markdown-body ::v-deep(h1),
.markdown-body ::v-deep(h2),
.markdown-body ::v-deep(h3) {
  border-bottom: 1px solid var(--card-border);
  padding-bottom: 10px;
  margin-top: 24px;
  margin-bottom: 16px;
}

.markdown-body ::v-deep(h1) {
  font-size: 1.8em;
}

.markdown-body ::v-deep(h2) {
  font-size: 1.5em;
}

.markdown-body ::v-deep(h3) {
  font-size: 1.25em;
}

.markdown-body ::v-deep(p) {
  margin-bottom: 16px;
}

.markdown-body ::v-deep(ul),
.markdown-body ::v-deep(ol) {
  padding-left: 20px;
  margin-bottom: 16px;
}

.markdown-body ::v-deep(li) {
  margin-bottom: 8px;
}

.markdown-body ::v-deep(code) {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
}

.markdown-body ::v-deep(pre) {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.markdown-body ::v-deep(pre) code {
  background-color: transparent;
  padding: 0;
}

.markdown-body ::v-deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 16px 0;
}
</style>