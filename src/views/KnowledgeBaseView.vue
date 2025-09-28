<template>
  <div class="knowledge-base-container">
    <header class="page-header">
      <h1><i class="fa-solid fa-book-sparkles"></i> 学习路线总览</h1>
      <p>探索、学习并掌握计算机科学的每一个角落。</p>
    </header>
    <div class="cards-grid">
      <KnowledgeCard
          v-for="point in knowledgeStore.pointsAsArray"
          :key="point.id"
          :point="point"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKnowledgeStore } from '@/stores/knowledge'
import KnowledgeCard from '@/components/KnowledgeCard.vue'

const knowledgeStore = useKnowledgeStore()
</script>

<style scoped>
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
</style>