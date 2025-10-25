import type { Directive } from 'vue';

/**
 * 图片懒加载指令
 * 使用方法: <img v-lazy="imageUrl" />
 */
export const lazyLoad: Directive<HTMLImageElement, string> = {
  mounted(el, binding) {
    const imageUrl = binding.value;
    
    // 占位图（可选）
    el.src = el.dataset.placeholder || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
    
    // 创建 Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 元素进入视口
            const img = entry.target as HTMLImageElement;
            
            // 创建临时图片对象预加载
            const tempImg = new Image();
            tempImg.onload = () => {
              // 加载成功后替换 src
              img.src = imageUrl;
              img.classList.add('lazy-loaded');
              img.classList.remove('lazy-loading');
            };
            tempImg.onerror = () => {
              // 加载失败，显示错误占位图
              img.src = el.dataset.error || '/error-placeholder.png';
              img.classList.add('lazy-error');
              img.classList.remove('lazy-loading');
            };
            
            img.classList.add('lazy-loading');
            tempImg.src = imageUrl;
            
            // 停止观察
            observer.unobserve(img);
          }
        });
      },
      {
        // 提前 100px 开始加载
        rootMargin: '100px',
        threshold: 0.01,
      }
    );
    
    observer.observe(el);
    
    // 保存 observer 到元素上，用于清理
    (el as any).__lazyObserver__ = observer;
  },
  
  unmounted(el) {
    // 清理 observer
    const observer = (el as any).__lazyObserver__;
    if (observer) {
      observer.disconnect();
      delete (el as any).__lazyObserver__;
    }
  },
};

/**
 * 背景图懒加载指令
 * 使用方法: <div v-lazy-bg="imageUrl"></div>
 */
export const lazyLoadBg: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    const imageUrl = binding.value;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            
            // 预加载图片
            const tempImg = new Image();
            tempImg.onload = () => {
              element.style.backgroundImage = `url(${imageUrl})`;
              element.classList.add('lazy-loaded');
              element.classList.remove('lazy-loading');
            };
            tempImg.onerror = () => {
              element.classList.add('lazy-error');
              element.classList.remove('lazy-loading');
            };
            
            element.classList.add('lazy-loading');
            tempImg.src = imageUrl;
            
            observer.unobserve(element);
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.01,
      }
    );
    
    observer.observe(el);
    (el as any).__lazyObserver__ = observer;
  },
  
  unmounted(el) {
    const observer = (el as any).__lazyObserver__;
    if (observer) {
      observer.disconnect();
      delete (el as any).__lazyObserver__;
    }
  },
};

// 添加全局样式（建议在 style.css 中添加）
const style = `
.lazy-loading {
  background-color: #f0f0f0;
  animation: pulse 1.5s ease-in-out infinite;
}

.dark .lazy-loading {
  background-color: #2d2d2d;
}

.lazy-loaded {
  animation: fadeIn 0.3s ease-in;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`;

// 自动注入样式（如果需要）
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = style;
  document.head.appendChild(styleEl);
}


