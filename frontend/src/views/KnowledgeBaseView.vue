<template>
  <div class="knowledge-base-container">
    <header class="page-header">
      <h1><i class="fa-solid fa-book-sparkles"></i> 学习路线总览</h1>
      <p>探索、学习并掌握计算机科学的每一个角落。</p>
    </header>

    <!-- 加载中状态：显示骨架屏 -->
    <div v-if="isLoadingState" class="cards-grid">
      <SkeletonLoader 
        v-for="i in 6" 
        :key="i" 
        type="card" 
        :animated="true"
      />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="hasError" class="error-state">
      <el-empty description="加载失败">
        <template #image>
          <el-icon :size="100" color="var(--el-color-danger)">
            <WarningFilled />
          </el-icon>
        </template>
        <p class="error-message">{{ knowledgeStore.error || error }}</p>
        <el-button type="primary" @click="handleRetry">
          <el-icon><Refresh /></el-icon>
          重新加载
        </el-button>
      </el-empty>
    </div>

    <!-- 空数据状态 -->
    <div v-else-if="!hasData" class="empty-state">
      <el-empty description="暂无知识点">
        <template #image>
          <el-icon :size="100" color="var(--el-color-info)">
            <DocumentCopy />
          </el-icon>
        </template>
        <p>知识库正在建设中，敬请期待...</p>
      </el-empty>
    </div>

    <!-- 正常显示知识卡片 -->
    <transition-group 
      v-else 
      name="card-list" 
      tag="div" 
      class="cards-grid"
      appear
    >
      <KnowledgeCard
          v-for="(point, index) in knowledgeStore.pointsAsArrayWithProgress"
          :key="`${point.id}-${animationKey}`"
          :point="point"
          :style="{ '--card-index': index }"
      />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useKnowledgeStore } from '@/stores/knowledge';
import { useUserStore } from '@/stores/user';
import KnowledgeCard from '@/components/KnowledgeCard.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { WarningFilled, Refresh, DocumentCopy } from '@element-plus/icons-vue';

const knowledgeStore = useKnowledgeStore();
const userStore = useUserStore();

const loading = ref(false);
const error = ref('');

// 动画key，用于卡片动画
const animationKey = ref(0);

// 计算属性：统一的加载状态判断
const isLoadingState = computed(() => loading.value || knowledgeStore.isLoading);

// 计算属性：统一的错误状态判断
const hasError = computed(() => Boolean(knowledgeStore.error || error.value));

// 计算属性：是否有数据
const hasData = computed(() => knowledgeStore.pointsAsArrayWithProgress.length > 0);

// 重试加载
const handleRetry = async () => {
  console.log('🔄 用户点击重试，强制重新加载数据');
  loading.value = true;
  error.value = '';
  
  try {
    // 强制重新加载知识点数据
    await knowledgeStore.fetchKnowledgePoints(true);
    console.log('✅ 重新加载成功');
    ElMessage.success('加载成功！');
  } catch (err: any) {
    console.error('❌ 重新加载失败:', err);
    error.value = err.message || '加载失败，请稍后重试';
    ElMessage.error(error.value);
  } finally {
    loading.value = false;
  }
};

// 初始化 - 每次进入页面都会执行
onMounted(async () => {
  console.log('📍 KnowledgeBaseView onMounted 触发');
  console.log('📊 当前知识点数量:', knowledgeStore.pointsAsArrayWithProgress.length);
  
  // 清除可能存在的错误状态
  error.value = '';
  
  // 如果数据已加载，不需要重新加载
  if (knowledgeStore.pointsAsArrayWithProgress.length > 0) {
    console.log('✅ 数据已存在，跳过加载');
    return;
  }
  
  // 否则显示加载状态
  console.log('🔄 开始加载知识点数据');
  loading.value = true;
  
  try {
    await knowledgeStore.fetchKnowledgePoints();
    console.log('✅ 知识点加载成功，数量:', knowledgeStore.pointsAsArrayWithProgress.length);
  } catch (err: any) {
    console.error('❌ 知识点加载失败:', err);
    error.value = err.message || '加载知识点失败';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.knowledge-base-container {
  width: 100%;
}

.page-header {
  margin-bottom: 30px;
  animation: fadeInDown 0.6s ease-out;
}

.page-header h1 {
  font-size: 28px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-header p {
  font-size: 16px;
  color: var(--text-secondary);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.error-state, .empty-state {
  text-align: center;
  padding: 80px 20px;
  background: var(--card-bg);
  border-radius: var(--border-radius);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-message {
  color: var(--text-secondary);
  margin: 16px 0;
  font-size: 14px;
}

/* ========== 优雅的卡片动画 ========== */

/* 页面标题淡入下落动画 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片列表进入动画 */
.card-list-enter-active {
  animation: cardFadeInUp 0.6s ease-out;
  animation-delay: calc(var(--card-index) * 0.08s);
}

/* 卡片淡入上浮动画 */
@keyframes cardFadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  60% {
    transform: translateY(-5px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 卡片离开动画（可选，用于删除等场景） */
.card-list-leave-active {
  transition: all 0.4s ease-out;
}

.card-list-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

/* 卡片移动动画（用于重新排序等场景） */
.card-list-move {
  transition: transform 0.5s ease;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  /* 移动端减少动画延迟，加快显示速度 */
  .card-list-enter-active {
    animation-delay: calc(var(--card-index) * 0.05s);
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>