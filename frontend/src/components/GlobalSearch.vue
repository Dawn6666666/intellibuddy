<template>
  <el-dialog
    v-model="visible"
    title="全局搜索"
    :width="600"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    class="global-search-dialog"
  >
    <el-input
      v-model="searchQuery"
      placeholder="搜索知识点、课程、错题..."
      :prefix-icon="Search"
      size="large"
      clearable
      autofocus
      @input="handleSearch"
    />

    <div v-if="searchQuery" class="search-results">
      <!-- 知识点结果 -->
      <div v-if="results.knowledgePoints.length > 0" class="result-section">
        <h4 class="result-section__title">知识点</h4>
        <div
          v-for="point in results.knowledgePoints"
          :key="point._id"
          class="result-item"
          @click="goToKnowledgePoint(point._id)"
        >
          <el-icon><School /></el-icon>
          <div class="result-item__content">
            <div class="result-item__title">{{ point.title }}</div>
            <div class="result-item__subtitle">{{ point.subject }}</div>
          </div>
        </div>
      </div>

      <!-- 错题结果 -->
      <div v-if="results.wrongQuestions.length > 0" class="result-section">
        <h4 class="result-section__title">错题</h4>
        <div
          v-for="question in results.wrongQuestions"
          :key="question._id"
          class="result-item"
          @click="goToWrongQuestions()"
        >
          <el-icon><QuestionFilled /></el-icon>
          <div class="result-item__content">
            <div class="result-item__title">{{ question.question }}</div>
            <div class="result-item__subtitle">{{ question.pointId?.title }}</div>
          </div>
        </div>
      </div>

      <!-- 无结果 -->
      <div v-if="!hasResults" class="no-results">
        <el-empty description="未找到相关内容" />
      </div>
    </div>

    <div v-else class="search-tips">
      <p>💡 快捷键：</p>
      <ul>
        <li><kbd>Ctrl</kbd> + <kbd>K</kbd> - 打开搜索</li>
        <li><kbd>Esc</kbd> - 关闭</li>
        <li><kbd>↑</kbd> <kbd>↓</kbd> - 选择结果</li>
        <li><kbd>Enter</kbd> - 访问选中项</li>
      </ul>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Search, School, QuestionFilled } from '@element-plus/icons-vue';
import { useNotification } from '@/composables/useNotification';
import { apiGetKnowledgePoints, apiGetWrongQuestions } from '@/services/apiService';
import { useUserStore } from '@/stores/user';

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const router = useRouter();
const { error } = useNotification();
const userStore = useUserStore();

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const searchQuery = ref('');
const results = ref<{
  knowledgePoints: any[];
  wrongQuestions: any[];
}>({
  knowledgePoints: [],
  wrongQuestions: [],
});

const hasResults = computed(() => {
  return results.value.knowledgePoints.length > 0 || results.value.wrongQuestions.length > 0;
});

let searchTimer: ReturnType<typeof setTimeout> | null = null;

const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer);
  
  if (!searchQuery.value.trim()) {
    results.value = { knowledgePoints: [], wrongQuestions: [] };
    return;
  }
  
  searchTimer = setTimeout(async () => {
    try {
      // 搜索知识点
      const kpData = await apiGetKnowledgePoints();
      results.value.knowledgePoints = kpData
        .filter((kp: any) => 
          kp.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          kp.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
        .slice(0, 5);
      
      // 搜索错题（如果已登录）
      if (userStore.token) {
        try {
          const wqData = await apiGetWrongQuestions(userStore.token);
          results.value.wrongQuestions = wqData
            .filter((wq: any) => 
              wq.question?.toLowerCase().includes(searchQuery.value.toLowerCase())
            )
            .slice(0, 5);
        } catch {
          // 无错题
          results.value.wrongQuestions = [];
        }
      }
    } catch (err) {
      error('搜索失败');
      console.error(err);
    }
  }, 300);
};

const goToKnowledgePoint = (id: string) => {
  router.push(`/knowledge/${id}`);
  visible.value = false;
};

const goToWrongQuestions = () => {
  router.push('/wrong-questions');
  visible.value = false;
};
</script>

<style scoped>
.global-search-dialog :deep(.el-dialog__body) {
  padding-top: 10px;
}

.search-results {
  margin-top: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.result-section {
  margin-bottom: 20px;
}

.result-section__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  margin: 0 0 10px 0;
  padding: 0 10px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.result-item:hover {
  background: var(--el-fill-color-light);
}

.result-item .el-icon {
  font-size: 20px;
  color: var(--el-color-primary);
}

.result-item__content {
  flex: 1;
  min-width: 0;
}

.result-item__title {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-item__subtitle {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.no-results {
  padding: 40px 0;
}

.search-tips {
  margin-top: 20px;
  padding: 20px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
}

.search-tips p {
  margin: 0 0 10px 0;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.search-tips ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-tips li {
  padding: 6px 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.search-tips kbd {
  display: inline-block;
  padding: 2px 6px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>

