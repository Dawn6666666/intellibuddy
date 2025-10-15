// src/composables/useAIIntervention.ts
import {ref, onMounted, onUnmounted} from 'vue';
import {useUserStore} from '@/stores/user';
import type {KnowledgePoint} from '@/stores/knowledge';

interface InterventionConfig {
  idleTimeThreshold?: number; // 空闲时间阈值（秒），默认5分钟
  failureThreshold?: number; // 连续失败次数阈值，默认2次
  enableIdleDetection?: boolean; // 是否启用空闲检测
  enableFailureDetection?: boolean; // 是否启用失败检测
}

export function useAIIntervention(
  knowledgePoint: KnowledgePoint | null,
  config: InterventionConfig = {}
) {
  const {
    idleTimeThreshold = 300, // 5分钟
    failureThreshold = 2,
    enableIdleDetection = true,
    enableFailureDetection = true,
  } = config;

  const userStore = useUserStore();
  const idleTime = ref(0);
  const failureCount = ref(0);
  const hasIntervenedForIdle = ref(false);
  const hasIntervenedForFailure = ref(false);

  let idleTimer: number | null = null;
  let activityListeners: (() => void)[] = [];

  // 重置空闲计时器
  const resetIdleTimer = () => {
    idleTime.value = 0;
    hasIntervenedForIdle.value = false;
  };

  // 空闲检测逻辑
  const startIdleDetection = () => {
    if (!enableIdleDetection) return;

    // 启动计时器
    idleTimer = window.setInterval(() => {
      idleTime.value++;

      // 当达到阈值且尚未干预时，触发AI干预
      if (idleTime.value >= idleTimeThreshold && !hasIntervenedForIdle.value) {
        triggerIdleIntervention();
      }
    }, 1000);

    // 监听用户活动
    const activities = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activities.forEach(event => {
      const handler = () => resetIdleTimer();
      window.addEventListener(event, handler);
      activityListeners.push(() => window.removeEventListener(event, handler));
    });
  };

  // 停止空闲检测
  const stopIdleDetection = () => {
    if (idleTimer) {
      clearInterval(idleTimer);
      idleTimer = null;
    }
    activityListeners.forEach(cleanup => cleanup());
    activityListeners = [];
  };

  // 触发空闲干预
  const triggerIdleIntervention = () => {
    if (!knowledgePoint) return;

    hasIntervenedForIdle.value = true;

    // 构建干预消息
    const interventionMessage = `看起来你在「${knowledgePoint.title}」这个部分停留了较长时间。需要我帮忙解释一下吗？或者你想换一个更简单的话题？`;

    // 自动打开聊天窗口并发送消息
    userStore.setChatContext(knowledgePoint);
    userStore.toggleChat(true);

    // 延迟发送消息，确保聊天窗口已打开
    setTimeout(() => {
      userStore.addMessage({
        role: 'assistant',
        content: interventionMessage,
      });
    }, 500);

    console.log('[AI干预] 空闲干预已触发:', interventionMessage);
  };

  // 记录测验失败
  const recordFailure = () => {
    if (!enableFailureDetection) return;

    failureCount.value++;

    if (failureCount.value >= failureThreshold && !hasIntervenedForFailure.value) {
      triggerFailureIntervention();
    }
  };

  // 重置失败计数
  const resetFailureCount = () => {
    failureCount.value = 0;
    hasIntervenedForFailure.value = false;
  };

  // 触发失败干预
  const triggerFailureIntervention = () => {
    if (!knowledgePoint) return;

    hasIntervenedForFailure.value = true;

    const interventionMessage = `我注意到你在「${knowledgePoint.title}」的测验中遇到了一些困难。不要灰心！学习是一个过程，错误是进步的一部分。

我可以为你：
1. 用更简单的方式重新解释这个知识点
2. 提供一些实际例子帮助理解
3. 推荐一些前置知识点，打好基础

你想从哪里开始呢？`;

    userStore.setChatContext(knowledgePoint);
    userStore.toggleChat(true);

    setTimeout(() => {
      userStore.addMessage({
        role: 'assistant',
        content: interventionMessage,
      });
    }, 500);

    console.log('[AI干预] 失败干预已触发:', interventionMessage);
  };

  // 初始化
  onMounted(() => {
    startIdleDetection();
  });

  // 清理
  onUnmounted(() => {
    stopIdleDetection();
  });

  return {
    idleTime,
    failureCount,
    recordFailure,
    resetFailureCount,
    resetIdleTimer,
    triggerFailureIntervention,
    triggerIdleIntervention,
  };
}


