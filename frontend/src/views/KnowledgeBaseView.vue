<template>
  <div class="knowledge-base-container">
    <header class="page-header">
      <h1><i class="fa-solid fa-book-sparkles"></i> 学习路线总览</h1>
      <p>探索、学习并掌握计算机科学的每一个角落。</p>
    </header>

    <!-- 加载中状态：显示骨架屏 -->
    <div v-if="userStore.isLoading || loading" class="cards-grid">
      <SkeletonLoader 
        v-for="i in 6" 
        :key="i" 
        type="card" 
        :animated="true"
      />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="knowledgeStore.error || error" class="error-state">
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
    <div v-else-if="knowledgeStore.pointsAsArrayWithProgress.length === 0" class="empty-state">
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
    <div v-else class="cards-grid">
      <KnowledgeCard
          v-for="point in knowledgeStore.pointsAsArrayWithProgress"
          :key="point.id"
          :point="point"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKnowledgeStore } from '@/stores/knowledge';
import { useUserStore } from '@/stores/user';
import KnowledgeCard from '@/components/KnowledgeCard.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';
import { onActivated, onDeactivated, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { WarningFilled, Refresh, DocumentCopy } from '@element-plus/icons-vue';

const knowledgeStore = useKnowledgeStore();
const userStore = useUserStore();

const loading = ref(false);
const error = ref('');

// 设置组件名称，用于 keep-alive 缓存识别
defineOptions({
  name: 'KnowledgeBaseView'
});

// 保存滚动位置
const savedScrollPosition = ref(0);

// 重试加载
const handleRetry = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    await userStore.fetchInitialData();
    ElMessage.success('加载成功！');
  } catch (err: any) {
    error.value = err.message || '加载失败，请稍后重试';
    ElMessage.error(error.value);
  } finally {
    loading.value = false;
  }
};

// 初始化
onMounted(async () => {
  // 如果数据已加载，不需要重新加载
  if (knowledgeStore.pointsAsArrayWithProgress.length > 0) {
    return;
  }
  
  // 否则显示加载状态
  loading.value = true;
  
  try {
    await knowledgeStore.fetchKnowledgePoints();
  } catch (err: any) {
    error.value = err.message || '加载知识点失败';
  } finally {
    loading.value = false;
  }
});

// 组件被停用时（离开页面），保存滚动位置
onDeactivated(() => {
  savedScrollPosition.value = window.scrollY || document.documentElement.scrollTop;
  console.log('知识库页面被停用（缓存起来），保存滚动位置:', savedScrollPosition.value);
});

// 组件被激活时（返回页面），恢复滚动位置
onActivated(() => {
  console.log('知识库页面被激活（从缓存中恢复），恢复滚动位置:', savedScrollPosition.value);
  // 由于知识库页面没有过渡动画，可以立即恢复滚动位置
  // 使用 nextTick 确保 DOM 完全渲染
  setTimeout(() => {
    window.scrollTo(0, savedScrollPosition.value);
    console.log('✅ 滚动位置已恢复到:', savedScrollPosition.value);
  }, 0);
});
</script>

<style scoped>
/* 样式保持不变 */
.knowledge-base-container {
  width: 100%;
}

.page-header {
  margin-bottom: 30px;
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
</style>