<template>
  <div class="callback-container">
    <p>正在登录，请稍候...</p>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useUserStore} from '@/stores/user';
// 【修正】直接从 apiService 导入 apiGetMyProfile
import {apiGetMyProfile} from '@/services/apiService';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  const token = route.query.token as string;

  if (token) {
    try {
      // 【修正】直接调用导入的函数，而不是通过 userStore
      const user = await apiGetMyProfile(token);

      await userStore.handleAuth(token, user);

      await router.push({name: 'dashboard'});
    } catch (error) {
      console.error('通过 Token 登录失败:', error);
      await router.push({name: 'login'});
    }
  } else {
    await router.push({name: 'login'});
  }
});
</script>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: var(--text-secondary);
}
</style>