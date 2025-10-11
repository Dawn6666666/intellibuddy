<template>
  <div class="learning-container" v-if="knowledgePoint">
    <header class="page-header">
      <div class="header-top">
        <h1>{{ knowledgePoint.title }}</h1>
        <button @click="goBackToKnowledgeBase" class="back-btn">
          <i class="fa-solid fa-arrow-left"></i> 返回知识库
        </button>
      </div>
      <p>{{ knowledgePoint.contentSnippet }}</p>
    </header>

    <div class="main-content-grid">
      <div class="side-panel-left">
        <div class="card file-list-card">
          <h3><i class="fa-solid fa-folder-open"></i> 模块笔记列表</h3>
          <ul class="file-list">
            <li
                v-for="note in notesForCurrentModule"
                :key="note.path"
                :class="{ 'active': note.path === activeNotePath }"
                @click="selectNote(note.path)"
            >
              {{ note.title }}
            </li>
            <li v-if="!notesForCurrentModule || notesForCurrentModule.length === 0" class="no-toc-placeholder">
              该模块暂无笔记。
            </li>
          </ul>
        </div>
      </div>

      <div class="card content-card" ref="contentRef">
        <div class="card-header">
          <h3><i class="fa-solid fa-book-open"></i> 学习内容</h3>
          <button class="context-ask-btn" @click="askWithContext">
            <i class="fa-solid fa-lightbulb-question"></i>
            <span>就此提问</span>
          </button>
        </div>
        <div class="markdown-body" v-html="contentHtml"></div>
      </div>

      <div class="side-panel-right">
        <div class="card toc-card">
          <h3><i class="fa-solid fa-list-ul"></i> 章节目录</h3>
          <ul class="toc-list">
            <li v-for="heading in headings" :key="heading.id">
              <a
                  :href="`#${heading.id}`"
                  @click.prevent="scrollToHeading(heading.id)"
                  :style="{ marginLeft: (heading.level - 1) * 15 + 'px' }"
              >
                {{ heading.text }}
              </a>
            </li>
            <li v-if="headings.length === 0" class="no-toc-placeholder">
              未找到章节目录。
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <p>知识点加载中或不存在...</p>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch, watchEffect, nextTick} from 'vue';
// 【新增】导入 useRouter 用于导航
import {useRoute, useRouter} from 'vue-router';
import {useKnowledgeStore} from '@/stores/knowledge';
import {useUserStore} from '@/stores/user';
import {marked} from 'marked';

const route = useRoute();
const router = useRouter(); // 【新增】获取 router 实例
const knowledgeStore = useKnowledgeStore();
const userStore = useUserStore();

// 【新增】返回知识库页面的函数
const goBackToKnowledgeBase = () => {
  router.push({name: 'knowledge'});
};

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

const contentHtml = ref('<p>请在左侧选择一篇笔记开始学习。</p>');
const contentRef = ref<HTMLElement | null>(null);
const headings = ref<{ id: string; text: string; level: number }[]>([]);

const contentMap: Record<string, { title: string; path: string }[]> = {
  'cs-y3-s6-c1': [
    {title: 'JavaSE 笔记 (一)', path: '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（一）走进Java语言.md'},
    {title: 'JavaSE 笔记 (二)', path: '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（二）面向过程编程.md'},
    {title: 'JavaSE 笔记 (三)', path: '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（三）面向对象基础.md'},
    {title: 'JavaSE 笔记 (四)', path: '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（四）面向对象高级篇.md'},
    {title: 'JavaSE 笔记 (五)', path: '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（五）泛型程序设计.md'},
    {title: 'JavaSE 笔记 (六)', path: '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（六）集合类与IO.md'},
    {title: 'JavaSE 笔记 (七)', path: '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（七）多线程与反射.md'},
    {title: 'JavaSE 笔记 (八)', path: '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（八）GUI程序开发.md'},
    {title: 'JavaWeb 笔记 (一)', path: '/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（一）Java网络编程.md'},
    {title: 'JavaWeb 笔记 (二)', path: '/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（二）数据库基础.md'},
    {title: 'JavaWeb 笔记 (三)', path: '/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（三）Java与数据库.md'},
    {title: 'JavaWeb 笔记 (四)', path: '/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（四）前端基础.md'},
    {title: 'JavaWeb 笔记 (五)', path: '/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（五）后端开发.md'},
  ],
};

const notesForCurrentModule = computed(() => contentMap[pointId.value] || []);
const activeNotePath = ref('');

const selectNote = (path: string) => {
  activeNotePath.value = path;
};

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
};

watch(pointId, (newId) => {
  if (newId) {
    const notes = contentMap[newId];
    if (notes && notes.length > 0) {
      selectNote(notes[0].path);
    } else {
      activeNotePath.value = '';
      contentHtml.value = '<p>该知识点的详细内容即将上线，敬请期待！</p>';
      headings.value = [];
    }
  }
}, {immediate: true});

watch(activeNotePath, async (newPath) => {
  if (newPath) {
    headings.value = [];
    contentHtml.value = '<p>正在加载学习内容...</p>';
    try {
      const response = await fetch(newPath);
      if (!response.ok) throw new Error(`File not found: ${newPath}`);
      const markdownText = await response.text();
      contentHtml.value = await marked.parse(markdownText);

      await nextTick();
      if (contentRef.value) {
        const headingElements = contentRef.value.querySelectorAll('h1, h2, h3, h4');
        const newHeadings: { id: string; text: string; level: number }[] = [];
        headingElements.forEach((el, index) => {
          const id = `heading-${index}`;
          el.id = id;
          newHeadings.push({
            id,
            text: el.textContent || '',
            level: parseInt(el.tagName.substring(1), 10),
          });
        });
        headings.value = newHeadings;
      }
    } catch (error) {
      console.error("加载笔记内容失败:", error);
      contentHtml.value = '<p style="color: #ff8a8a;">抱歉，该笔记的详细内容暂时无法加载。</p>';
    }
  }
});
</script>

<style scoped>
.page-header {
  margin-bottom: 30px;
}

.page-header p {
  font-size: 16px;
  color: var(--text-secondary);
}

/* 【新增】样式用于放置标题和返回按钮 */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.page-header h1 {
  font-size: 28px;
  margin: 0;
}

.back-btn {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* --- */

.main-content-grid {
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  gap: 20px;
  align-items: flex-start;
}

.side-panel-left, .side-panel-right {
  position: sticky;
  top: 100px;
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
  min-height: calc(100vh - 200px);
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
  border-bottom: 1px solid var(--card-border);
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.file-list-card {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-list li {
  padding: 10px 15px;
  margin-bottom: 5px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-list li:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.file-list li.active {
  background-color: var(--primary-color);
  color: white;
  font-weight: 500;
}

.toc-card {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  margin-bottom: 12px;
}

.toc-list a {
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 14px;
  transition: color 0.2s ease;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toc-list a:hover {
  color: var(--primary-color);
}

.no-toc-placeholder {
  color: var(--text-secondary);
  font-size: 14px;
  font-style: italic;
}

.markdown-body {
  line-height: 1.7;
  color: var(--text-primary);
}

.markdown-body ::v-deep(h1),
.markdown-body ::v-deep(h2),
.markdown-body ::v-deep(h3),
.markdown-body ::v-deep(h4) {
  border-bottom: 1px solid var(--card-border);
  padding-bottom: 10px;
  margin-top: 24px;
  margin-bottom: 16px;
  scroll-margin-top: 100px;
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

.markdown-body ::v-deep(hr) {
  border: none;
  height: 2px;
  background-image: linear-gradient(to right, transparent, var(--card-border), transparent);
  margin: 40px 0;
}
</style>