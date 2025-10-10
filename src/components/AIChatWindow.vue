<template>
  <div
      ref="chatWindowRef"
      class="chat-window"
      :class="[windowState, { 'is-dragging': isDragging }]"
      :style="windowStyle"
  >
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
            v-for="(message, index) in messages"
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
      />
      <button @click="sendMessage" class="send-btn" :disabled="isLoading">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </footer>
    <div class="resize-handle"></div>
  </div>
</template>

<script setup lang="ts">
import {ref, nextTick, computed} from 'vue';
import {useUserStore} from '@/stores/user';
import {getChatCompletion, type ChatMessage} from '@/services/ai';
import {marked} from 'marked';
import {useDraggable, useBreakpoints} from '@vueuse/core';
import aiLogo from '@/assets/images/ai-chat-logo.png';

const chatWindowRef = ref<HTMLElement | null>(null);
const chatHeaderRef = ref<HTMLElement | null>(null);
const windowState = ref('normal');
const breakpoints = useBreakpoints({mobile: 768});
const isMobile = breakpoints.smaller('mobile');

const isDraggable = computed(() => !isMobile.value && (windowState.value === 'normal' || windowState.value === 'minimized'));

const {x, y, isDragging} = useDraggable(chatWindowRef, {
  initialValue: {x: window.innerWidth / 2 - 225, y: window.innerHeight / 2 - 300},
  handle: chatHeaderRef,
  disabled: !isDraggable.value,
});

const windowStyle = computed(() => {
  // 在手机、最大化状态下，不使用 JS 控制位置，让 CSS 生效
  if (isMobile.value || windowState.value === 'maximized') {
    return {};
  }
  // 在 normal 和 minimized 状态下，应用拖拽的位置
  return {
    left: `${x.value}px`,
    top: `${y.value}px`,
  };
});

function toggleMaximize() {
  windowState.value = windowState.value === 'maximized' ? 'normal' : 'maximized';
}

function minimizeWindow() {
  windowState.value = windowState.value === 'minimized' ? 'normal' : 'minimized';
}

const userStore = useUserStore();
const userInput = ref('');
const isLoading = ref(false);
const chatBodyRef = ref<HTMLElement | null>(null);
const messages = ref<ChatMessage[]>([
  {role: 'assistant', content: '你好！我是您的专属 AI 助教，有什么可以帮助你的吗？'}
]);
const renderMarkdown = (text: string) => {
  return marked.parse(text);
};
const scrollToBottom = () => {
  nextTick(() => {
    if (chatBodyRef.value) {
      chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight;
    }
  });
};
const sendMessage = async () => {
  if (userInput.value.trim() === '' || isLoading.value) return;
  const userMessage: ChatMessage = {role: 'user', content: userInput.value};
  messages.value.push(userMessage);
  const context = userStore.chatContext;
  let messagesToSend = [...messages.value];
  if (context) {
    messagesToSend.unshift({
      role: 'system',
      content: `你是一个学习辅助AI。请根据以下背景知识来回答用户的问题。背景知识标题：'${context.title}'，内容摘要：'${context.contentSnippet}'。请让回答尽可能与这个主题相关。`
    });
  }
  userInput.value = '';
  isLoading.value = true;
  scrollToBottom();
  const aiResponse = await getChatCompletion(messagesToSend);
  messages.value.push(aiResponse);
  isLoading.value = false;
  scrollToBottom();
};
const closeChat = () => {
  userStore.toggleChat(false);
};
</script>

<style scoped>
.chat-window {
  position: fixed;
  z-index: 2000;
  width: 450px;
  height: 600px;
  min-width: 300px;
  min-height: 400px;
  background: var(--card-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  -webkit-backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  resize: both;
  overflow: hidden;
  transition: width 0.3s ease, height 0.3s ease;
}

.chat-window.is-dragging {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  transition: none;
}

.chat-window:active {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  transition: none;
}

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

.chat-window.minimized .chat-header {
  cursor: move; /* 最小化时整个 header 都可以拖动 */
}

.chat-header h3 {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 1.125rem;
  color: #e68da0;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.window-control-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.window-control-btn:hover {
  color: var(--text-primary);
}

.close-btn {
  font-size: 20px;
}

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

.message {
  display: flex;
  max-width: 90%;
}

.message-content {
  padding: 10px 15px;
  border-radius: 12px;
  line-height: 1.6;
  word-wrap: break-word;
}

.message.received {
  align-self: flex-start;
}

.message.received .message-content {
  background-color: rgba(255, 255, 255, 0.1);
  border-top-left-radius: 0;
}

.message.sent {
  align-self: flex-end;
}

.message.sent .message-content {
  background-color: var(--primary-color);
  color: white;
  border-top-right-radius: 0;
}

.chat-footer {
  display: flex;
  padding: 12px;
  border-top: 1px solid var(--card-border);
  flex-shrink: 0;
}

.chat-footer input {
  flex-grow: 1;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 12px;
  color: var(--text-primary);
  font-size: 1rem;
}

.chat-footer input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.send-btn {
  background: var(--primary-color);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 1.125rem;
}

.send-btn:disabled {
  background-color: #555;
  cursor: not-allowed;
}

.loading-indicator span {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #888;
  margin: 0 2px;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.chat-body::-webkit-scrollbar {
  width: 6px;
}

.chat-body::-webkit-scrollbar-track {
  background: transparent;
}

.chat-body::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.chat-body::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary-color);
}

.markdown-body :deep(h1), .markdown-body :deep(h2), .markdown-body :deep(h3) {
  margin-bottom: 10px;
  margin-top: 15px;
}

.markdown-body :deep(p) {
  margin: 0;
}

.markdown-body :deep(ul), .markdown-body :deep(ol) {
  padding-left: 20px;
}

.markdown-body :deep(code) {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.9em;
}

.markdown-body :deep(pre) {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 8px;
  overflow-x: auto;
}

.markdown-body :deep(pre) code {
  background-color: transparent;
  padding: 0;
}

.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: se-resize;
  background: linear-gradient(135deg, transparent 0%, transparent 50%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.3) 75%, transparent 75%, transparent 100%);
  background-size: 8px 8px;
  opacity: 0.5;
}

.header-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

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

.chat-window.minimized .chat-body,
.chat-window.minimized .chat-footer,
.chat-window.minimized .resize-handle {
  display: none;
}

@media (max-width: 768px) {
  .chat-window {
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    border-radius: 0;
    box-shadow: none;
    resize: none;
    min-width: 0;
    min-height: 0;
  }

  .chat-header {
    cursor: default;
  }

  .header-controls .window-control-btn {
    display: none;
  }

  .header-controls .close-btn {
    display: block;
  }

  .resize-handle {
    display: none;
  }

  .chat-header h3 {
    font-size: 1.25rem;
  }

  .close-btn {
    font-size: 2rem;
  }

  .chat-body {
    padding: 15px;
  }

  .message-content {
    font-size: 1rem;
    padding: 12px 18px;
  }

  .chat-footer input {
    font-size: 1rem;
    padding: 10px 15px;
  }

  .send-btn {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }
}
</style>