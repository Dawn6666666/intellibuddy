<template>
  <div class="learning-container" v-if="knowledgePoint">
    <header class="page-header">
      <h1>{{ knowledgePoint.title }}</h1>
      <p>{{ knowledgePoint.contentSnippet }}</p>
    </header>

    <div class="main-content">
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

      <div class="side-panel">
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
import {computed, ref, watchEffect, nextTick} from 'vue';
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

// --- 内容加载与目录生成 ---

const contentHtml = ref('<p>正在加载学习内容...</p>');
const contentRef = ref<HTMLElement | null>(null); // 用于引用内容区域的 DOM 元素
const headings = ref<{ id: string; text: string; level: number }[]>([]); // 存储目录项

// 知识点 ID 到 Markdown 文件路径的映射
const contentMap: Record<string, string> = {
  // --- JavaSE 笔记映射 ---
  'cs-y1-s1-c1': '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（一）走进Java语言.md',
  'cs-y1-s2-c1': '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（四）面向对象高级篇.md',
  'cs-y1-s1-c2': '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（二）面向过程编程.md',
  'cs-y1-s2-c3': '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（五）泛型程序设计.md',
  'cs-y2-s3-c1': '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（八）GUI程序开发.md',
  'cs-y2-s3-c2': '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（六）集合类与IO.md',
  'cs-y3-s5-c1': '/笔记/JavaSE 核心内容/JavaSE 核心内容 - JavaSE 笔记（七）多线程与反射.md',

  // --- JavaWeb 笔记映射 ---
  'cs-y2-s4-c3': '/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（二）数据库基础.md',
  'cs-y3-s5-c2': '/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（一）Java网络编程.md',

  // --- 按照您的要求，将“软件工程基础”替换为JavaWeb后端开发笔记 ---
  'cs-y2-s3-c3': '/笔记/JavaWeb/JavaWeb 旧版 - JavaWeb 笔记（五）后端开发.md',

  // 您可以继续在这里补充其他知识点与笔记的映射
};

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
};

watchEffect(async () => {
  if (pointId.value) {
    headings.value = []; // 先清空旧目录
    const filePath = contentMap[pointId.value];
    if (filePath) {
      try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`File not found: ${filePath}`);
        const markdownText = await response.text();
        contentHtml.value = await marked.parse(markdownText);

        await nextTick();
        if (contentRef.value) {
          const headingElements = contentRef.value.querySelectorAll('h1, h2, h3, h4');
          const newHeadings: { id: string; text: string; level: number }[] = [];
          headingElements.forEach((el, index) => {
            const id = `heading-${index}`;
            el.id = id; // 给标题元素添加 ID
            newHeadings.push({
              id,
              text: el.textContent || '',
              level: parseInt(el.tagName.substring(1), 10),
            });
          });
          headings.value = newHeadings;
        }

      } catch (error) {
        console.error("加载知识点内容失败:", error);
        contentHtml.value = '<p style="color: #ff8a8a;">抱歉，该知识点的详细内容暂时无法加载。</p>';
      }
    } else {
      contentHtml.value = '<p>该知识点的详细内容即将上线，敬请期待！</p>';
    }
  }
});

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
  position: sticky;
  top: 100px;
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

.toc-card h3 {
  margin-bottom: 20px;
  border-bottom: 1px solid var(--card-border);
  padding-bottom: 15px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 70vh;
  overflow-y: auto;
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
</style>