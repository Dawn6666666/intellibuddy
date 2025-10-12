<template>
  <div class="code-explainer-container">
    <div class="explainer-header">
      <h3><i class="fa-solid fa-code"></i> AI 代码解释器</h3>
      <p>粘贴代码，让 AI 为你详细解释</p>
    </div>

    <div class="code-input-section">
      <div class="input-header">
        <label>编程语言</label>
        <select v-model="selectedLanguage" class="language-select">
          <option value="">自动检测</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="csharp">C#</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="typescript">TypeScript</option>
          <option value="php">PHP</option>
          <option value="ruby">Ruby</option>
        </select>
      </div>

      <textarea
        v-model="code"
        class="code-textarea"
        placeholder="在这里粘贴你的代码..."
        rows="15"
      ></textarea>

      <button 
        class="btn-explain" 
        @click="explainCode"
        :disabled="!code.trim() || isLoading"
      >
        <i :class="isLoading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-wand-magic-sparkles'"></i>
        {{ isLoading ? '正在解释...' : '解释代码' }}
      </button>
    </div>

    <div v-if="explanation" class="explanation-section">
      <div class="explanation-header">
        <h4><i class="fa-solid fa-lightbulb"></i> AI 解释结果</h4>
        <button class="btn-copy" @click="copyExplanation" title="复制解释">
          <i class="fa-regular fa-copy"></i>
        </button>
      </div>
      <div class="explanation-content markdown-body" v-html="renderMarkdown(explanation)"></div>
    </div>

    <div v-if="error" class="error-message">
      <i class="fa-solid fa-exclamation-circle"></i>
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { apiExplainCode } from '@/services/apiService';
import { marked } from 'marked';

const userStore = useUserStore();

const code = ref('');
const selectedLanguage = ref('');
const explanation = ref('');
const isLoading = ref(false);
const error = ref('');

const explainCode = async () => {
  if (!code.value.trim()) {
    error.value = '请输入代码';
    return;
  }

  if (!userStore.token) {
    error.value = '请先登录';
    return;
  }

  error.value = '';
  isLoading.value = true;
  explanation.value = '';

  try {
    const response = await apiExplainCode(
      userStore.token,
      code.value,
      selectedLanguage.value
    );
    
    explanation.value = response.explanation;
  } catch (err: any) {
    error.value = err.response?.data?.message || '代码解释失败，请稍后重试';
    console.error('代码解释失败:', err);
  } finally {
    isLoading.value = false;
  }
};

const copyExplanation = async () => {
  try {
    await navigator.clipboard.writeText(explanation.value);
    alert('解释内容已复制到剪贴板');
  } catch (err) {
    console.error('复制失败:', err);
    alert('复制失败');
  }
};

const renderMarkdown = (text: string) => {
  return marked(text);
};
</script>

<style scoped>
.code-explainer-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.explainer-header {
  text-align: center;
  margin-bottom: 32px;
}

.explainer-header h3 {
  font-size: 2rem;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--primary-color);
}

.explainer-header p {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

.code-input-section {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  padding: 24px;
  margin-bottom: 24px;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.input-header label {
  font-weight: 500;
  color: var(--text-primary);
}

.language-select {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--card-border);
  color: var(--text-primary);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9375rem;
}

.language-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.code-textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--card-border);
  border-radius: 10px;
  color: var(--text-primary);
  padding: 16px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9375rem;
  line-height: 1.6;
  resize: vertical;
  margin-bottom: 16px;
}

.code-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(138, 127, 251, 0.1);
}

.code-textarea::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.btn-explain {
  width: 100%;
  background: linear-gradient(135deg, var(--primary-color), #a78bfa);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(138, 127, 251, 0.3);
}

.btn-explain:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(138, 127, 251, 0.5);
}

.btn-explain:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.explanation-section {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  padding: 24px;
  margin-bottom: 24px;
}

.explanation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--card-border);
}

.explanation-header h4 {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: var(--primary-color);
}

.btn-copy {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--card-border);
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-copy:hover {
  background: rgba(0, 0, 0, 0.3);
  color: var(--text-primary);
  border-color: var(--primary-color);
}

.explanation-content {
  line-height: 1.8;
  color: var(--text-secondary);
}

.explanation-content :deep(h1),
.explanation-content :deep(h2),
.explanation-content :deep(h3),
.explanation-content :deep(h4) {
  color: var(--text-primary);
  margin: 20px 0 12px 0;
}

.explanation-content :deep(p) {
  margin: 12px 0;
}

.explanation-content :deep(ul),
.explanation-content :deep(ol) {
  margin: 12px 0;
  padding-left: 28px;
}

.explanation-content :deep(li) {
  margin: 8px 0;
}

.explanation-content :deep(code) {
  background: rgba(0, 0, 0, 0.3);
  padding: 3px 8px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.875rem;
}

.explanation-content :deep(pre) {
  background: rgba(0, 0, 0, 0.3);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
}

.explanation-content :deep(pre code) {
  background: none;
  padding: 0;
}

.explanation-content :deep(strong) {
  color: var(--text-primary);
  font-weight: 600;
}

.error-message {
  background: rgba(255, 77, 79, 0.1);
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
  padding: 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9375rem;
}

.error-message i {
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .code-explainer-container {
    padding: 16px;
  }

  .explainer-header h3 {
    font-size: 1.5rem;
  }

  .code-input-section,
  .explanation-section {
    padding: 16px;
  }

  .input-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .language-select {
    width: 100%;
  }
}
</style>

