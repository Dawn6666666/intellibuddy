<template>
  <div
      ref="chatWindowRef"
      class="chat-window"
      :class="[windowState, { 'is-dragging': isDragging }]"
      :style="windowStyle"
  >
    <aside class="history-sidebar">
      <header class="sidebar-header">
        <h4>聊天记录</h4>
        <button class="new-chat-btn" @click="startNewChat" title="新建对话">
          <i class="fa-solid fa-plus"></i>
        </button>
      </header>
      <ul class="history-list">
        <li
            v-for="session in userStore.chatSessions"
            :key="session._id"
            :class="{ 'active': session._id === userStore.activeChatId }"
            @click="loadChat(session._id)"
        >
          <span class="session-title">{{ session.title }}</span>
          <button 
            class="delete-chat-btn" 
            @click="confirmDelete(session._id, $event)"
            title="删除对话"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </li>
      </ul>
    </aside>

    <div class="chat-main">
      <header
          class="chat-header"
          ref="chatHeaderRef"
          title="按住此处可拖动窗口"
      >
        <h3><img :src="aiLogo" alt="AI 助教 Logo" class="header-logo"/> AI 助教</h3>
        <div class="header-controls">
          <button class="window-control-btn" @click.stop="minimizeWindow" title="最小化/还原">
            <i class="fa-solid fa-window-minimize"></i>
          </button>
          <button class="window-control-btn" @click.stop="toggleMaximize" title="最大化/还原">
            <i :class="windowState === 'maximized' ? 'fa-solid fa-compress' : 'fa-solid fa-expand'"></i>
          </button>
          <button class="window-control-btn close-btn" @click.stop="closeChat" title="关闭">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </header>

      <main class="chat-body" ref="chatBodyRef">
        <div class="message-list">
          <div
              v-for="(message, index) in validMessages"
              :key="index"
              class="message"
              :class="message.role === 'user' ? 'sent' : 'received'"
          >
            <div class="message-content markdown-body" v-html="renderMarkdown(message.content)"></div>
          </div>
          <div v-if="isLoading" class="message received">
            <div class="message-content">
              <p class="loading-indicator">
                <span></span><span></span><span></span>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer class="chat-footer">
        <input
            v-model="userInput"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="在这里输入你的问题..."
            :disabled="isLoading"
        />
        <button @click="sendMessage" class="send-btn" :disabled="isLoading">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </footer>
      <div class="resize-handle"></div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">
          <i class="fa-solid fa-triangle-exclamation"></i>
          确认删除
        </h3>
        <p class="modal-message">确定要删除这个对话吗？此操作无法撤销。</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="cancelDelete" :disabled="isDeleting">取消</button>
          <button class="btn-confirm" @click="executeDelete" :disabled="isDeleting">
            <span v-if="!isDeleting">删除</span>
            <span v-else><i class="fa-solid fa-spinner fa-spin"></i> 删除中...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { getChatCompletion, type ChatMessage } from '@/services/ai';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import { useDraggable, useBreakpoints } from '@vueuse/core';
import aiLogo from '@/assets/images/ai-chat-logo.png';
import 'katex/dist/katex.min.css';

// 删除确认对话框状态
const showDeleteConfirm = ref(false);
const chatToDelete = ref<string | null>(null);
const isDeleting = ref(false); // 防止重复删除

// 配置 marked 以支持数学公式和 GitHub 风格的 Markdown
marked.use(markedKatex({
  throwOnError: false,
  output: 'html',
  nonStandard: true,
  strict: false,
  trust: true
}));

marked.setOptions({
  gfm: true,
  breaks: true,
  pedantic: false,
});

const userStore = useUserStore();
const userInput = ref('');
const isLoading = ref(false);
const chatBodyRef = ref<HTMLElement | null>();

// 过滤掉 null 或 undefined 的消息，以及没有有效 role 或 content 的消息
const validMessages = computed(() => {
  return userStore.messages.filter(msg => {
    // 确保消息对象存在，且有有效的 role 和 content
    return msg !== null && 
           msg !== undefined && 
           typeof msg === 'object' &&
           msg.role !== null && 
           msg.role !== undefined &&
           msg.content !== null && 
           msg.content !== undefined &&
           typeof msg.content === 'string';
  });
});

const chatWindowRef = ref<HTMLElement | null>(null);
const chatHeaderRef = ref<HTMLElement | null>(null);
const windowState = ref('normal');
const breakpoints = useBreakpoints({ mobile: 768 });
const isMobile = breakpoints.smaller('mobile');
const isDraggable = computed(() => !isMobile.value && windowState.value === 'normal');
const { x, y, isDragging } = useDraggable(chatWindowRef, {
  initialValue: { x: window.innerWidth / 2 - 350, y: window.innerHeight / 2 - 300 },
  handle: chatHeaderRef,
  disabled: !isDraggable.value,
});
const windowStyle = computed(() => {
  if (isMobile.value || windowState.value === 'maximized') return {};
  return { left: `${x.value}px`, top: `${y.value}px` };
});
const toggleMaximize = () => windowState.value = windowState.value === 'maximized' ? 'normal' : 'maximized';
const minimizeWindow = () => windowState.value = windowState.value === 'minimized' ? 'normal' : 'minimized';
const closeChat = () => userStore.toggleChat(false);

const renderMarkdown = (text: string | undefined | null) => {
  try {
    // 如果文本为 null 或 undefined，返回空字符串
    if (text === null || text === undefined || typeof text !== 'string') {
      console.warn('Markdown 渲染警告: 文本为空或非字符串类型', text);
      return '';
    }
    return marked.parse(text);
  } catch (error) {
    console.error('Markdown 渲染错误:', error);
    return text || '';
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBodyRef.value) {
      chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight;
    }
  });
};

watch(() => userStore.messages, scrollToBottom, { deep: true });
onMounted(scrollToBottom);

const sendMessage = async () => {
  if (userInput.value.trim() === '' || isLoading.value) return;

  const userMessage: ChatMessage = { role: 'user', content: userInput.value };
  await userStore.addMessage(userMessage);

  const context = userStore.chatContext;
  let messagesToSend = [...userStore.messages];
  if (context) {
    messagesToSend.unshift({
      role: 'system',
      content: `你是一个学习辅助AI。请根据以下背景知识来回答用户的问题。背景知识标题：'${context.title}'，内容摘要：'${context.contentSnippet}'。请让回答尽可能与这个主题相关。`
    });
  }

  userInput.value = '';
  isLoading.value = true;

  const aiResponse = await getChatCompletion(messagesToSend);
  await userStore.addMessage(aiResponse);

  isLoading.value = false;
};

const startNewChat = () => {
  userStore.startNewChat();
};

const loadChat = (sessionId: string) => {
  userStore.loadChatSession(sessionId);
};

const confirmDelete = (sessionId: string, event: Event) => {
  event.stopPropagation(); // 阻止事件冒泡，防止触发 loadChat
  chatToDelete.value = sessionId;
  showDeleteConfirm.value = true;
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  chatToDelete.value = null;
};

const executeDelete = async () => {
  if (chatToDelete.value && !isDeleting.value) {
    isDeleting.value = true; // 设置删除中状态
    try {
      await userStore.deleteChat(chatToDelete.value);
      showDeleteConfirm.value = false;
      chatToDelete.value = null;
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    } finally {
      isDeleting.value = false; // 无论成功失败都重置状态
    }
  }
};
</script>

<style scoped>
/* --- 整体布局样式 --- */
.chat-window {
  position: fixed;
  z-index: 2000;
  width: 700px;
  height: 600px;
  min-width: 500px;
  min-height: 400px;
  display: flex;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  resize: both;
  overflow: hidden;
  border-radius: var(--border-radius);
  background: var(--card-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  -webkit-backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--card-border);
  transition: width 0.3s ease, height 0.3s ease, transform 0.3s ease;
}

/* 【核心修正】在拖拽移动或拖拽缩放时，临时禁用过渡和模糊效果以提高性能 */
.chat-window.is-dragging,
.chat-window:active {
  transition: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.chat-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 0;
}

/* --- 侧边栏样式 --- */
.history-sidebar {
  width: 200px;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.15);
  border-right: 1px solid var(--card-border);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid var(--card-border);
  flex-shrink: 0;
}

.sidebar-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

.new-chat-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
  line-height: 1;
  transition: color 0.2s ease;
}
.new-chat-btn:hover {
  color: var(--text-primary);
}

.history-list {
  list-style: none;
  padding: 10px;
  margin: 0;
  overflow-y: auto;
  flex-grow: 1;
}

.history-list li {
  padding: 10px 12px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: background-color 0.2s ease, color 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.history-list li .session-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-list li .delete-chat-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px 6px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
}

.history-list li:hover .delete-chat-btn {
  opacity: 1;
}

.history-list li .delete-chat-btn:hover {
  color: #ff4444;
}

.history-list li:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.history-list li.active {
  background: var(--primary-color);
  color: white;
  font-weight: 500;
}

.history-list li.active .delete-chat-btn {
  color: rgba(255, 255, 255, 0.7);
  opacity: 1;
}

.history-list li.active .delete-chat-btn:hover {
  color: white;
}

/* --- 主聊天区域样式 --- */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--card-border);
  flex-shrink: 0;
  cursor: move;
}
.chat-header h3 {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 1.125rem;
  color: #e68da0;
}
.header-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.header-controls {
  display: flex;
  gap: 12px;
}
.window-control-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 16px;
}
.close-btn { font-size: 20px; }
.chat-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  height: 0;
}
.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.message { display: flex; max-width: 90%; }
.message-content { padding: 10px 15px; border-radius: 12px; line-height: 1.6; word-wrap: break-word; }
.message.received { align-self: flex-start; }
.message.received .message-content { background-color: rgba(255, 255, 255, 0.1); border-top-left-radius: 0; }
.message.sent { align-self: flex-end; }
.message.sent .message-content { background-color: var(--primary-color); color: white; border-top-right-radius: 0; }
.loading-indicator span { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #888; margin: 0 2px; animation: bounce 1.4s infinite ease-in-out both; }
.loading-indicator span:nth-child(1) { animation-delay: -0.32s; }
.loading-indicator span:nth-child(2) { animation-delay: -0.16s; }
@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
.chat-footer { display: flex; padding: 12px; border-top: 1px solid var(--card-border); flex-shrink: 0; }
.chat-footer input { flex-grow: 1; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--card-border); border-radius: 8px; padding: 0 12px; color: var(--text-primary); font-size: 1rem; }
.chat-footer input:focus { outline: none; border-color: var(--primary-color); }
.send-btn { background: var(--primary-color); border: none; color: white; width: 40px; height: 40px; border-radius: 8px; margin-left: 10px; cursor: pointer; font-size: 1.125rem; }
.send-btn:disabled { background-color: #555; cursor: not-allowed; }
.resize-handle { position: absolute; bottom: 0; right: 0; width: 20px; height: 20px; cursor: se-resize; }

/* --- 窗口状态样式 --- */
.chat-window.maximized {
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  border-radius: 0;
  resize: none;
}

.chat-window.minimized {
  height: 56px;
  width: 250px;
  min-height: 0;
  resize: none;
  overflow: hidden;
}

.chat-window.minimized .history-sidebar,
.chat-window.minimized .chat-body,
.chat-window.minimized .chat-footer,
.chat-window.minimized .resize-handle {
  display: none;
}

.chat-window.minimized .chat-main {
  width: 100%;
}

/* --- Markdown 样式 --- */
.markdown-body {
  line-height: 1.7;
  color: inherit;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  margin-top: 16px;
  margin-bottom: 12px;
  font-weight: 600;
  line-height: 1.3;
}

.markdown-body :deep(h1) { font-size: 1.5em; }
.markdown-body :deep(h2) { font-size: 1.3em; }
.markdown-body :deep(h3) { font-size: 1.15em; }
.markdown-body :deep(h4) { font-size: 1em; }

.markdown-body :deep(p) {
  margin: 0.5em 0;
  line-height: 1.6;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.markdown-body :deep(li) {
  margin: 0.25em 0;
}

.markdown-body :deep(code) {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Fira Code', Consolas, 'Courier New', monospace;
  font-size: 0.9em;
}

.markdown-body :deep(pre) {
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0.5em 0;
}

.markdown-body :deep(pre code) {
  background: transparent;
  padding: 0;
  font-size: 0.85em;
  display: block;
}

.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--primary-color);
  padding-left: 1em;
  margin: 0.5em 0;
  color: var(--text-secondary);
}

.markdown-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5em 0;
  font-size: 0.9em;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 10px;
  text-align: left;
}

.markdown-body :deep(th) {
  background: rgba(138, 127, 251, 0.1);
  font-weight: 600;
}

.markdown-body :deep(a) {
  color: var(--primary-color);
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

/* KaTeX 公式样式 */
.markdown-body :deep(.katex) {
  font-size: 1em;
}

.markdown-body :deep(.katex-display) {
  margin: 0.8em 0;
  overflow-x: auto;
  overflow-y: hidden;
}

/* 在用户消息中使用浅色代码背景 */
.message.sent .markdown-body :deep(code) {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.message.sent .markdown-body :deep(pre) {
  background: rgba(255, 255, 255, 0.15);
}

/* --- 模态框样式 --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-title {
  margin: 0 0 16px 0;
  font-size: 1.25rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-title i {
  color: #ff9800;
  font-size: 1.5rem;
}

.modal-message {
  margin: 0 0 24px 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-confirm {
  background: #ff4444;
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  background: #ff2222;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 68, 68, 0.4);
}

.btn-cancel:disabled,
.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-confirm:disabled {
  background: #cc3333;
}
</style>