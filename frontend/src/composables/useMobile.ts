import { ref, onMounted, onUnmounted } from 'vue';

/**
 * 移动端检测和工具函数
 */
export function useMobile() {
  const isMobile = ref(false);
  const isTablet = ref(false);
  const isDesktop = ref(false);
  const screenWidth = ref(window.innerWidth);
  const screenHeight = ref(window.innerHeight);
  
  // 检测设备类型
  const checkDevice = () => {
    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight;
    
    isMobile.value = screenWidth.value < 768;
    isTablet.value = screenWidth.value >= 768 && screenWidth.value < 1024;
    isDesktop.value = screenWidth.value >= 1024;
  };
  
  // 防止iOS双击缩放
  const preventDoubleTapZoom = () => {
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });
  };
  
  // 检测是否为触摸设备
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };
  
  // 获取安全区域边距
  const getSafeAreaInsets = () => {
    const style = getComputedStyle(document.documentElement);
    return {
      top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
      right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
      bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
      left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0'),
    };
  };
  
  // 锁定屏幕方向
  const lockOrientation = async (orientation: 'portrait' | 'landscape') => {
    try {
      if ('orientation' in screen && 'lock' in screen.orientation) {
        await screen.orientation.lock(orientation);
      }
    } catch (error) {
      console.warn('Screen orientation lock not supported:', error);
    }
  };
  
  // 解锁屏幕方向
  const unlockOrientation = () => {
    try {
      if ('orientation' in screen && 'unlock' in screen.orientation) {
        screen.orientation.unlock();
      }
    } catch (error) {
      console.warn('Screen orientation unlock not supported:', error);
    }
  };
  
  // 检测是否为iOS
  const isIOS = () => {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  };
  
  // 检测是否为Android
  const isAndroid = () => {
    return /Android/i.test(navigator.userAgent);
  };
  
  // 获取视口高度（考虑移动端地址栏）
  const getViewportHeight = () => {
    return window.visualViewport?.height || window.innerHeight;
  };
  
  // 禁用页面滚动
  const disableScroll = () => {
    document.body.style.overflow = 'hidden';
  };
  
  // 启用页面滚动
  const enableScroll = () => {
    document.body.style.overflow = '';
  };
  
  // 振动反馈
  const vibrate = (duration: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  };
  
  onMounted(() => {
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    if (isMobile.value) {
      preventDoubleTapZoom();
    }
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkDevice);
  });
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    screenHeight,
    isTouchDevice: isTouchDevice(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    getSafeAreaInsets,
    lockOrientation,
    unlockOrientation,
    getViewportHeight,
    disableScroll,
    enableScroll,
    vibrate,
  };
}


