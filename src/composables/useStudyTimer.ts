// src/composables/useStudyTimer.ts
import { ref, onMounted, onUnmounted, unref, computed, type Ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { apiStartStudySession, apiEndStudySession, apiStudyHeartbeat } from '@/services/apiService';

export function useStudyTimer(pointId?: string) {
  const userStore = useUserStore();
  const sessionId = ref<string | null>(null);
  const elapsedTime = ref<number>(0); // 秒，明确类型为 number
  const isRunning = ref(false);

  let timer: number | null = null;
  let heartbeatTimer: number | null = null;

  // 格式化时间显示
  const formatTime = (seconds: number | Ref<number>): string => {
    // 使用 unref 自动解包 ref
    const value = unref(seconds);
    
    // 确保 value 是有效数字
    if (typeof value !== 'number' || isNaN(value)) {
      return '0秒';
    }
    
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const secs = value % 60;

    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    } else if (minutes > 0) {
      return `${minutes}分钟${secs}秒`;
    } else {
      return `${secs}秒`;
    }
  };

  // 开始计时
  const start = async () => {
    if (isRunning.value) {
      console.log('[学习计时器] 已在运行中，跳过启动');
      return;
    }

    if (!userStore.token) {
      console.warn('[学习计时器] 用户未登录，无法开始学习会话');
      return;
    }

    console.log('[学习计时器] 准备开始，知识点ID:', pointId);

    try {
      const response = await apiStartStudySession(userStore.token, pointId);
      console.log('[学习计时器] API 响应:', response);
      
      sessionId.value = response.sessionId;
      isRunning.value = true;
      elapsedTime.value = 0;

      // 启动计时器（每秒更新）
      timer = window.setInterval(() => {
        elapsedTime.value++;
        console.log('[学习计时器] 计时中:', elapsedTime.value, '秒');
      }, 1000);

      // 启动心跳（每分钟发送一次）
      heartbeatTimer = window.setInterval(async () => {
        if (sessionId.value && userStore.token) {
          try {
            const heartbeatResponse = await apiStudyHeartbeat(userStore.token, sessionId.value);
            console.log('[学习计时器] 心跳发送成功:', heartbeatResponse);
          } catch (error) {
            console.error('[学习计时器] 发送心跳失败:', error);
          }
        }
      }, 60000); // 60秒

      console.log('[学习计时器] 已开始，会话ID:', sessionId.value);
    } catch (error: any) {
      console.error('[学习计时器] 开始学习会话失败:', error);
      console.error('[学习计时器] 错误详情:', error.response?.data || error.message);
      
      // 重置状态
      isRunning.value = false;
      sessionId.value = null;
      elapsedTime.value = 0;
    }
  };

  // 停止计时
  const stop = async () => {
    console.log('[学习计时器] 准备停止，当前状态:', {
      isRunning: isRunning.value,
      sessionId: sessionId.value,
      elapsedTime: elapsedTime.value
    });

    if (!isRunning.value && !sessionId.value) {
      console.log('[学习计时器] 未在运行，跳过停止');
      return;
    }

    // 清除计时器
    if (timer) {
      clearInterval(timer);
      timer = null;
      console.log('[学习计时器] 已清除计时器');
    }

    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
      console.log('[学习计时器] 已清除心跳计时器');
    }

    if (!userStore.token) {
      console.warn('[学习计时器] 用户未登录，无法结束学习会话');
      isRunning.value = false;
      return;
    }

    // 如果有会话ID，尝试结束会话
    if (sessionId.value) {
      try {
        const response = await apiEndStudySession(userStore.token, sessionId.value);
        console.log('[学习计时器] 已停止，总时长:', formatTime(elapsedTime.value));
        console.log('[学习计时器] 结束会话响应:', response);
      } catch (error: any) {
        console.error('[学习计时器] 结束学习会话失败:', error);
        console.error('[学习计时器] 错误详情:', error.response?.data || error.message);
      }
    }

    // 无论如何都重置状态
    isRunning.value = false;
    sessionId.value = null;
  };

  // 重置计时
  const reset = () => {
    elapsedTime.value = 0;
  };

  // 组件卸载时自动停止
  onUnmounted(() => {
    if (isRunning.value) {
      stop();
    }
  });

  // 创建一个计算属性来格式化显示时间
  const formattedTime = computed(() => formatTime(elapsedTime.value));

  return {
    sessionId,
    elapsedTime,
    isRunning,
    formatTime,
    formattedTime,
    start,
    stop,
    reset
  };
}

