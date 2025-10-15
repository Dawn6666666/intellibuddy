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
          {{ session.title }}
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
              v-for="(message, index) in userStore.messages"
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
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { getChatCompletion, type ChatMessage } from '@/services/ai';
import { marked } from 'marked';
import { useDraggable, useBreakpoints } from '@vueuse/core';
import aiLogo from '@/assets/images/ai-chat-logo.png';

const userStore = useUserStore();
const userInput = ref('');
const isLoading = ref(false);
const chatBodyRef = ref<HTMLElement | null>();

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

const renderMarkdown = (text: string) => marked.parse(text);

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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-secondary);
  transition: background-color 0.2s ease, color 0.2s ease;
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
</style>