import { onMounted, onUnmounted, ref } from 'vue';
import { throttle, debounce } from '@/utils/performance';

/**
 * 虚拟滚动优化
 */
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const scrollTop = ref(0);
  const visibleStart = ref(0);
  const visibleEnd = ref(0);
  const bufferSize = 5; // 缓冲区大小

  const updateVisibleRange = () => {
    visibleStart.value = Math.max(0, Math.floor(scrollTop.value / itemHeight) - bufferSize);
    visibleEnd.value = Math.min(
      items.length,
      Math.ceil((scrollTop.value + containerHeight) / itemHeight) + bufferSize
    );
  };

  const onScroll = throttle((event: Event) => {
    const target = event.target as HTMLElement;
    scrollTop.value = target.scrollTop;
    updateVisibleRange();
  }, 16); // ~60fps

  onMounted(() => {
    updateVisibleRange();
  });

  return {
    visibleStart,
    visibleEnd,
    onScroll,
    visibleItems: () => items.slice(visibleStart.value, visibleEnd.value),
    paddingTop: () => visibleStart.value * itemHeight,
    paddingBottom: () => (items.length - visibleEnd.value) * itemHeight,
  };
}

/**
 * 图片预加载优化
 */
export function useImagePreload() {
  const loadedImages = new Set<string>();
  const loadingImages = new Map<string, Promise<void>>();

  const preloadImage = (src: string): Promise<void> => {
    if (loadedImages.has(src)) {
      return Promise.resolve();
    }

    if (loadingImages.has(src)) {
      return loadingImages.get(src)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        loadedImages.add(src);
        loadingImages.delete(src);
        resolve();
      };
      img.onerror = () => {
        loadingImages.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });

    loadingImages.set(src, promise);
    return promise;
  };

  const preloadImages = (srcs: string[]): Promise<void[]> => {
    return Promise.all(srcs.map(preloadImage));
  };

  return {
    preloadImage,
    preloadImages,
    isLoaded: (src: string) => loadedImages.has(src),
    isLoading: (src: string) => loadingImages.has(src),
  };
}

/**
 * 无限滚动加载
 */
export function useInfiniteScroll(
  loadMore: () => Promise<void>,
  options: {
    distance?: number;
    disabled?: () => boolean;
  } = {}
) {
  const { distance = 100, disabled = () => false } = options;
  const loading = ref(false);
  let observer: IntersectionObserver | null = null;

  const handleIntersect = async (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && !loading.value && !disabled()) {
      loading.value = true;
      try {
        await loadMore();
      } finally {
        loading.value = false;
      }
    }
  };

  const observe = (target: HTMLElement) => {
    if (observer) {
      observer.disconnect();
    }

    observer = new IntersectionObserver(handleIntersect, {
      rootMargin: `${distance}px`,
      threshold: 0.01,
    });

    observer.observe(target);
  };

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return {
    loading,
    observe,
  };
}

/**
 * 防抖输入
 */
export function useDebouncedInput(initialValue: string = '', delay: number = 300) {
  const value = ref(initialValue);
  const debouncedValue = ref(initialValue);

  const updateValue = debounce((newValue: string) => {
    debouncedValue.value = newValue;
  }, delay);

  const setValue = (newValue: string) => {
    value.value = newValue;
    updateValue(newValue);
  };

  return {
    value,
    debouncedValue,
    setValue,
  };
}

/**
 * 节流函数执行
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
) {
  const throttledFn = throttle(fn, delay);

  onUnmounted(() => {
    // 清理（如果需要）
  });

  return throttledFn;
}

/**
 * 网络状态监听
 */
export function useNetworkStatus() {
  const online = ref(navigator.onLine);
  const effectiveType = ref<string>('unknown');
  const downlink = ref<number>(0);
  const rtt = ref<number>(0);

  const updateConnectionInfo = () => {
    const connection = (navigator as any).connection 
      || (navigator as any).mozConnection 
      || (navigator as any).webkitConnection;

    if (connection) {
      effectiveType.value = connection.effectiveType || 'unknown';
      downlink.value = connection.downlink || 0;
      rtt.value = connection.rtt || 0;
    }
  };

  const handleOnline = () => {
    online.value = true;
    updateConnectionInfo();
  };

  const handleOffline = () => {
    online.value = false;
  };

  onMounted(() => {
    updateConnectionInfo();
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  });

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  });

  return {
    online,
    effectiveType,
    downlink,
    rtt,
    isSlow: () => effectiveType.value === 'slow-2g' || effectiveType.value === '2g',
    isFast: () => effectiveType.value === '4g',
  };
}

/**
 * 资源提示（预连接、预取等）
 */
export function useResourceHints() {
  const addPreconnect = (url: string) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    document.head.appendChild(link);
  };

  const addPrefetch = (url: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  };

  const addPreload = (url: string, as: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    document.head.appendChild(link);
  };

  const addDNSPrefetch = (domain: string) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  };

  return {
    addPreconnect,
    addPrefetch,
    addPreload,
    addDNSPrefetch,
  };
}

/**
 * 长列表优化
 */
export function useListOptimization<T>(
  items: T[],
  options: {
    pageSize?: number;
    loadDelay?: number;
  } = {}
) {
  const { pageSize = 20, loadDelay = 0 } = options;
  const displayedItems = ref<T[]>([]);
  const currentPage = ref(0);
  const loading = ref(false);

  const loadMore = async () => {
    if (loading.value) return;
    if ((currentPage.value + 1) * pageSize >= items.length) return;

    loading.value = true;

    // 模拟延迟（优化用户体验）
    if (loadDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, loadDelay));
    }

    currentPage.value++;
    const newItems = items.slice(0, (currentPage.value + 1) * pageSize);
    displayedItems.value = newItems;

    loading.value = false;
  };

  const reset = () => {
    currentPage.value = 0;
    displayedItems.value = items.slice(0, pageSize);
  };

  onMounted(() => {
    reset();
  });

  return {
    displayedItems,
    loading,
    loadMore,
    reset,
    hasMore: () => (currentPage.value + 1) * pageSize < items.length,
  };
}


