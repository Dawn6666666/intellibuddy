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

    <div v-if="pointId === 'cs-y3-s6-c1'" class="main-content-grid">
      <div class="side-panel-left">
        <div class="card file-list-card">
          <h3><i class="fa-solid fa-folder-open"></i> Java 学习笔记</h3>
          <ul class="file-list">
            <li
                v-for="note in notesForSoftwareEngineering"
                :key="note.path"
                :class="{ 'active': note.path === activeNotePath }"
                @click="selectNote(note.path)"
            >
              {{ note.title }}
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

    <div v-else class="main-content-single">
      <div class="card content-card">
        <div class="markdown-body" v-html="contentHtml"></div>
      </div>
    </div>

  </div>
  <div v-else class="loading">
    <p>知识点加载中或不存在...</p>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch, nextTick, onMounted, onUnmounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useKnowledgeStore} from '@/stores/knowledge';
import {useUserStore} from '@/stores/user';
import {marked} from 'marked';
import hljs from 'highlight.js';

// 配置 marked 以支持代码高亮
const renderer = new marked.Renderer();

// 代码块计数器，用于检测内容密度
let codeBlockCount = 0;
let totalContentLength = 0;

// 重写代码块渲染器
renderer.code = function({ text, lang }: { text: string; lang?: string }) {
  const codeString = typeof text === 'string' ? text : '';
  let language = lang || '';
  let detectedLanguage = '';
  let highlightedCode = '';
  
  // 增加代码块计数
  codeBlockCount++;
  totalContentLength += codeString.length;
  
  // 计算代码块密度
  const codeDensity = codeBlockCount / Math.max(1, totalContentLength / 1000);
  
  // 根据密度调整样式类
  const densityClass = codeDensity > 0.5 ? 'code-dense' : 'code-sparse';
  
  // 如果没有指定语言，尝试自动检测
  if (!language) {
    try {
      const detected = hljs.highlightAuto(codeString);
      detectedLanguage = detected.language || 'plaintext';
      highlightedCode = detected.value;
    } catch (e) {
      detectedLanguage = 'plaintext';
      highlightedCode = hljs.highlight(codeString, {language: 'plaintext'}).value;
    }
  } else if (hljs.getLanguage(language)) {
    // 检查语言是否被支持
    try {
      const result = hljs.highlight(codeString, {language, ignoreIllegals: true});
      detectedLanguage = language;
      highlightedCode = result.value;
    } catch (e) {
      // 如果高亮失败，回退到纯文本
      detectedLanguage = 'plaintext';
      highlightedCode = hljs.highlight(codeString, {language: 'plaintext'}).value;
    }
  } else {
    // 不支持的语言，尝试自动检测
    try {
      const detected = hljs.highlightAuto(codeString);
      detectedLanguage = detected.language || 'plaintext';
      highlightedCode = detected.value;
    } catch (e) {
      detectedLanguage = 'plaintext';
      highlightedCode = hljs.highlight(codeString, {language: 'plaintext'}).value;
    }
  }
  
  // 语言显示名称映射
  const languageNameMap: Record<string, string> = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'python': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'csharp': 'C#',
    'php': 'PHP',
    'ruby': 'Ruby',
    'go': 'Go',
    'rust': 'Rust',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'sql': 'SQL',
    'bash': 'Bash',
    'shell': 'Shell',
    'json': 'JSON',
    'xml': 'XML',
    'yaml': 'YAML',
    'markdown': 'Markdown',
    'plaintext': 'Plain Text'
  };
  
  const displayLanguage = languageNameMap[detectedLanguage] || detectedLanguage.toUpperCase();
  
  // 转义代码用于复制（保留原始代码）
  const escapedCode = codeString.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  
  return `
    <div class="code-container ${densityClass}">
      <div class="code-header">
        <span class="code-language">${displayLanguage}</span>
        <button class="code-copy-btn" onclick="copyCode(this)" data-code="${escapedCode}" title="复制代码">
          <i class="fa-regular fa-copy"></i>
          <span class="copy-text">复制</span>
        </button>
      </div>
      <pre class="code-block"><code class="hljs language-${detectedLanguage}">${highlightedCode}</code></pre>
    </div>
  `;
};

marked.setOptions({
  renderer,
  gfm: true,
  pedantic: false,
  breaks: false,
});

const route = useRoute();
const router = useRouter();
const knowledgeStore = useKnowledgeStore();
const userStore = useUserStore();

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

const contentHtml = ref('<p>正在加载内容...</p>');
const contentRef = ref<HTMLElement | null>(null);
const headings = ref<{ id: string; text: string; level: number }[]>([]);

const notesForSoftwareEngineering = [
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
];

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
  if (newId === 'cs-y3-s6-c1') {
    if (notesForSoftwareEngineering.length > 1 && !activeNotePath.value) {
      const secondNote = notesForSoftwareEngineering[1];
      if (secondNote) {
        selectNote(secondNote.path);
      }
    }
  } else {
    activeNotePath.value = '';
    contentHtml.value = '<p>该知识点的详细内容即将上线，敬请期待！</p>';
    headings.value = [];
  }
}, {immediate: true});

watch(activeNotePath, async (newPath) => {
  if (newPath) {
    headings.value = [];
    contentHtml.value = '<p>正在加载学习内容...</p>';
    
    // 重置代码块计数器
    codeBlockCount = 0;
    totalContentLength = 0;
    
    try {
      const response = await fetch(newPath);
      if (!response.ok) throw new Error(`File not found: ${newPath}`);
      const markdownText = await response.text();

      // 解析 markdown 内容
      const parsedHtml = marked.parse(markdownText);
      contentHtml.value = typeof parsedHtml === 'string' ? parsedHtml : parsedHtml.toString();

      await nextTick();
      const contentEl = contentRef.value;
      if (contentEl) {
        const headingElements = contentEl.querySelectorAll('h1, h2, h3, h4');
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
}, {immediate: true});

// 复制代码功能
const copyCodeToClipboard = async (button: HTMLButtonElement) => {
  const code = button.getAttribute('data-code');
  if (!code) return;
  
  // HTML 解码
  const textarea = document.createElement('textarea');
  textarea.innerHTML = code;
  const decodedCode = textarea.value;
  
  try {
    await navigator.clipboard.writeText(decodedCode);
    
    // 更新按钮状态
    const copyText = button.querySelector('.copy-text');
    const icon = button.querySelector('i');
    
    if (copyText) copyText.textContent = '已复制';
    if (icon) {
      icon.className = 'fa-solid fa-check';
    }
    button.classList.add('copied');
    
    // 2秒后恢复
    setTimeout(() => {
      if (copyText) copyText.textContent = '复制';
      if (icon) {
        icon.className = 'fa-regular fa-copy';
      }
      button.classList.remove('copied');
    }, 2000);
  } catch (err) {
    console.error('复制失败:', err);
    const copyText = button.querySelector('.copy-text');
    if (copyText) {
      copyText.textContent = '复制失败';
      setTimeout(() => {
        copyText.textContent = '复制';
      }, 2000);
    }
  }
};

// 注册全局复制函数
onMounted(() => {
  (window as any).copyCode = copyCodeToClipboard;
});

// 清理全局函数
onUnmounted(() => {
  delete (window as any).copyCode;
});
</script>

<style scoped>
/* 根容器样式 - 防止页面级别溢出 */
.learning-container {
  width: 100%;
  max-width: 100%;
  overflow-x: visible; /* 改为visible以支持sticky定位 */
  box-sizing: border-box;
  position: relative; /* 确保sticky定位正常工作 */
  min-height: 100vh; /* 确保有足够的滚动空间 */
}

/* 保持所有基础布局样式不变 */
.page-header {
  margin-bottom: 30px;
  position: relative;
  z-index: 1; /* 确保header在侧栏上方 */
}

.page-header p {
  font-size: 16px;
  color: var(--text-secondary);
}

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

.main-content-grid {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr) 250px; /* 防止中间列挤压两侧 */
  gap: 20px;
  align-items: start;
  width: 100%;
  max-width: 100%;
  overflow: visible; /* 必须是visible才能让sticky生效 */
  box-sizing: border-box;
  /* 不使用position: relative，让sticky相对于视口定位 */
}

.main-content-single {
  max-width: 900px;
  margin: 0 auto;
}

.side-panel-left, .side-panel-right {
  position: sticky; /* 侧边栏随页面滚动保持在视口 */
  top: 104px; /* header的top(20px) + header高度(64px) + 间距(20px) = 104px */
  align-self: start;
  max-height: calc(100vh - 124px); /* 视口高度 - top(104px) - 底部间距(20px) = 124px */
  overflow: hidden;
}

/* 侧边栏内卡片独立滚动，标题固定在顶部区域 */
.file-list-card, .toc-card {
  display: flex;
  flex-direction: column;
  max-height: 100%; /* 限制最大高度为父容器高度 */
  height: auto; /* 允许根据内容自适应高度 */
  overflow: hidden;
}

.file-list-card h3, .toc-card h3 { 
  flex-shrink: 0; /* 标题不参与滚动 */
  margin-bottom: 12px !important; /* 覆盖 .card h3 的样式 */
}

.file-list, .toc-list { 
  flex: 1;
  overflow-y: auto !important; /* 列表独立滚动 - 强制生效 */
  overflow-x: hidden;
  min-height: 0; /* 确保 flex 子元素可以正确收缩 */
  padding-right: 4px; /* 为滚动条留出空间 */
  scroll-behavior: smooth; /* 平滑滚动 */
  -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
  max-height: 600px; /* 临时添加：限制最大高度，便于测试滚动效果 */
}

/* 美化滚动条 */
.file-list::-webkit-scrollbar,
.toc-list::-webkit-scrollbar {
  width: 6px;
}

.file-list::-webkit-scrollbar-track,
.toc-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.file-list::-webkit-scrollbar-thumb,
.toc-list::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 3px;
}

.file-list::-webkit-scrollbar-thumb:hover,
.toc-list::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color-dark, #6366f1);
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
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0; /* 防止内容撑开导致侧栏被挤压 */
  overflow: visible; /* 由页面滚动 */
  position: relative;
  z-index: 0; /* 确保内容在侧栏下方 */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.context-ask-btn {
  background: var(--primary-color);
  border: none;
  color: white;
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
  background: var(--primary-color-dark, #6366f1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
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

/* 桌面端保持由父级限制高度与内部滚动；移动端的放开在 media 查询中处理 */

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

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  /* 注意：滚动样式已在统一的 .file-list, .toc-list 规则中定义（第346行） */
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

.markdown-body :deep(h1), .markdown-body :deep(h2), .markdown-body :deep(h3), .markdown-body :deep(h4) {
  border-bottom: 1px solid var(--card-border);
  padding-bottom: 10px;
  margin-top: 24px;
  margin-bottom: 16px;
  scroll-margin-top: 100px;
}

.markdown-body :deep(h1) {
  font-size: 1.8em;
}

.markdown-body :deep(h2) {
  font-size: 1.5em;
}

.markdown-body :deep(h3) {
  font-size: 1.25em;
}

.markdown-body :deep(hr) {
  border: none;
  height: 2px;
  background-image: linear-gradient(to right, transparent, var(--card-border), transparent);
  margin: 40px 0;
}

.markdown-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
}

.markdown-body :deep(table) {
  max-width: 100%;
  overflow-x: auto;
}

/* 代码块样式优化 - 彻底修复布局溢出问题 */
.markdown-body {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;
  min-width: 0; /* 避免撑破中间列 */
}

/* 强制限制所有 markdown 内容的宽度 */
.markdown-body :deep(*) {
  max-width: 100% !important;
  box-sizing: border-box !important;
}

/* 特别处理可能溢出的元素 */
.markdown-body :deep(p),
.markdown-body :deep(div),
.markdown-body :deep(span),
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  max-width: 100% !important;
  overflow-wrap: break-word !important;
  word-wrap: break-word !important;
}

/* 独立代码块样式（非容器包裹的） - 使用 highlight.js 原生样式 */
.markdown-body :deep(pre) {
  border-radius: 8px;
  margin: 1.5rem 0;
  overflow-x: auto;
  position: relative;
}

/* 代码容器样式 - 使用 highlight.js 原生主题背景 */
.markdown-body :deep(.code-container) {
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.markdown-body :deep(.code-container:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 代码容器密度样式 */
.markdown-body :deep(.code-container.code-dense) {
  margin: 1rem 0;
}

.markdown-body :deep(.code-container.code-sparse) {
  margin: 2rem 0;
}

/* 代码头部样式 - 轻微半透明背景 */
.markdown-body :deep(.code-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

html.light-theme .markdown-body :deep(.code-header) {
  background: rgba(0, 0, 0, 0.03);
}

.markdown-body :deep(.code-language) {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 复制按钮样式 */
.markdown-body :deep(.code-copy-btn) {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: transparent;
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.markdown-body :deep(.code-copy-btn:hover) {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.markdown-body :deep(.code-copy-btn.copied) {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.markdown-body :deep(.code-copy-btn i) {
  font-size: 13px;
}

/* 代码块样式 - 让 highlight.js 主题接管背景和颜色 */
.markdown-body :deep(.code-block) {
  margin: 0;
  border-radius: 0 0 8px 8px;
}

.markdown-body :deep(.code-block code) {
  display: block;
  padding: 1rem;
  overflow-x: auto;
  font-size: 14px;
  line-height: 1.6;
  font-family: 'Fira Code', Consolas, 'Courier New', monospace;
}

/* 代码稀疏样式 */
.markdown-body :deep(.code-container.code-sparse .code-block code) {
  font-size: 15px;
  line-height: 1.7;
  padding: 1.25rem;
}

/* 独立代码块内的 code 元素 */
.markdown-body :deep(pre code) {
  padding: 1rem;
  font-family: 'Fira Code', Consolas, 'Courier New', monospace;
  font-size: 14px;
  display: block;
  overflow-x: auto;
}

/* 响应式设计 - 处理不同屏幕尺寸 */
@media (max-width: 1200px) {
  .main-content-grid {
    grid-template-columns: 200px 1fr 200px;
    gap: 15px;
  }
}

@media (max-width: 992px) {
  .main-content-grid {
    grid-template-columns: 180px 1fr 180px;
    gap: 12px;
  }
  
  .side-panel-left, .side-panel-right {
    position: static; /* 小屏取消sticky */
    max-height: none; /* 移除高度限制 */
    overflow: visible;
  }
  
  .file-list-card, .toc-card {
    max-height: 500px; /* 给一个合理的最大高度 */
    height: auto;
  }
  
  .file-list, .toc-list {
    max-height: 400px; /* 确保列表不会太长 */
  }
}

@media (max-width: 768px) {
  .main-content-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .side-panel-left, .side-panel-right {
    order: 1;
    position: static;
    max-height: none;
  }
  
  .content-card {
    order: 0;
  }
  
  .file-list-card, .toc-card {
    max-height: 400px; /* 移动端更小的高度 */
  }
  
  .file-list, .toc-list {
    max-height: 300px;
  }
  
  .markdown-body :deep(pre) {
    margin: 1rem 0;
    font-size: 13px;
  }
  
  .markdown-body :deep(pre code) {
    padding: 1em;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .main-content-grid {
    gap: 15px;
  }
  
  .card {
    padding: 16px;
  }
  
  .markdown-body :deep(pre code) {
    padding: 0.8em;
    font-size: 12px;
  }
}
</style>