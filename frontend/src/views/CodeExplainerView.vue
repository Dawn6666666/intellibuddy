<template>
  <div class="code-explainer-view">
    <CodeExplainer />
  </div>
</template>

<script setup lang="ts">
import CodeExplainer from '@/components/CodeExplainer.vue';
</script>

<style scoped>
.code-explainer-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

@media (max-width: 768px) {
  .code-explainer-view {
    padding: 20px 16px;
  }
}
</style>

