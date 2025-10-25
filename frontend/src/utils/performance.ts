/**
 * 性能监控工具
 */

export interface PerformanceMetrics {
  // 页面加载性能
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte

  // 自定义性能指标
  apiResponseTime?: Record<string, number>;
  componentRenderTime?: Record<string, number>;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.init();
  }

  private init() {
    // 监听 FCP (First Contentful Paint)
    this.observePaint();

    // 监听 LCP (Largest Contentful Paint)
    this.observeLCP();

    // 监听 FID (First Input Delay)
    this.observeFID();

    // 监听 CLS (Cumulative Layout Shift)
    this.observeCLS();

    // 监听导航时间
    this.observeNavigation();
  }

  private observePaint() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.FCP = entry.startTime;
              console.log('[Performance] FCP:', entry.startTime.toFixed(2), 'ms');
            }
          }
        });
        observer.observe({ entryTypes: ['paint'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('Paint observer not supported');
      }
    }
  }

  private observeLCP() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
          console.log('[Performance] LCP:', this.metrics.LCP.toFixed(2), 'ms');
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('LCP observer not supported');
      }
    }
  }

  private observeFID() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any) {
            this.metrics.FID = entry.processingStart - entry.startTime;
            console.log('[Performance] FID:', this.metrics.FID.toFixed(2), 'ms');
          }
        });
        observer.observe({ entryTypes: ['first-input'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('FID observer not supported');
      }
    }
  }

  private observeCLS() {
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.metrics.CLS = clsValue;
            }
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }
  }

  private observeNavigation() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const navEntry = entry as PerformanceNavigationTiming;
            this.metrics.TTFB = navEntry.responseStart - navEntry.requestStart;
            console.log('[Performance] TTFB:', this.metrics.TTFB.toFixed(2), 'ms');
          }
        });
        observer.observe({ entryTypes: ['navigation'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('Navigation observer not supported');
      }
    }
  }

  // 测量 API 响应时间
  measureApiCall(apiName: string, startTime: number) {
    const duration = performance.now() - startTime;
    if (!this.metrics.apiResponseTime) {
      this.metrics.apiResponseTime = {};
    }
    this.metrics.apiResponseTime[apiName] = duration;
    console.log(`[Performance] API ${apiName}:`, duration.toFixed(2), 'ms');
    return duration;
  }

  // 测量组件渲染时间
  measureComponentRender(componentName: string, startTime: number) {
    const duration = performance.now() - startTime;
    if (!this.metrics.componentRenderTime) {
      this.metrics.componentRenderTime = {};
    }
    this.metrics.componentRenderTime[componentName] = duration;
    console.log(`[Performance] Component ${componentName}:`, duration.toFixed(2), 'ms');
    return duration;
  }

  // 获取内存使用情况
  getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1048576; // 转换为 MB
      console.log('[Performance] Memory Usage:', this.metrics.memoryUsage.toFixed(2), 'MB');
      return this.metrics.memoryUsage;
    }
    return null;
  }

  // 获取所有性能指标
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // 获取性能评分 (0-100)
  getScore(): number {
    let score = 100;

    // FCP 评分 (理想 < 1800ms)
    if (this.metrics.FCP) {
      if (this.metrics.FCP > 3000) score -= 20;
      else if (this.metrics.FCP > 1800) score -= 10;
    }

    // LCP 评分 (理想 < 2500ms)
    if (this.metrics.LCP) {
      if (this.metrics.LCP > 4000) score -= 20;
      else if (this.metrics.LCP > 2500) score -= 10;
    }

    // FID 评分 (理想 < 100ms)
    if (this.metrics.FID) {
      if (this.metrics.FID > 300) score -= 20;
      else if (this.metrics.FID > 100) score -= 10;
    }

    // CLS 评分 (理想 < 0.1)
    if (this.metrics.CLS) {
      if (this.metrics.CLS > 0.25) score -= 20;
      else if (this.metrics.CLS > 0.1) score -= 10;
    }

    return Math.max(0, score);
  }

  // 清理观察者
  disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// 创建单例
export const performanceMonitor = new PerformanceMonitor();

// 工具函数：测量异步函数执行时间
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    console.log(`[Performance] ${name}:`, duration.toFixed(2), 'ms');
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.log(`[Performance] ${name} (failed):`, duration.toFixed(2), 'ms');
    throw error;
  }
}

// 工具函数：节流
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// 工具函数：防抖
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// 工具函数：延迟执行（优化首屏加载）
export function defer(fn: () => void, priority: 'low' | 'high' = 'low') {
  if (priority === 'high') {
    requestAnimationFrame(fn);
  } else {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fn);
    } else {
      setTimeout(fn, 1);
    }
  }
}

// 工具函数：预加载图片
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// 工具函数：预加载多个图片
export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

// 工具函数：懒加载
export function lazyLoad(
  target: HTMLElement,
  callback: () => void,
  options?: IntersectionObserverInit
) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(entry.target);
        }
      });
    }, options);

    observer.observe(target);
    return observer;
  } else {
    // 降级方案：直接执行
    callback();
    return null;
  }
}


