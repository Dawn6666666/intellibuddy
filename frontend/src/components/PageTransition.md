# PageTransition 页面转场组件

## 📝 概述

`PageTransition` 是一个优雅的全屏页面转场动画组件，专为登录后进入主应用场景设计。它借鉴了素材中的转场思路，并结合现代 Web 设计理念进行了优化。

## ✨ 特性

- 🎨 **渐变背景动画**：动态流动的紫-蓝-绿渐变背景
- 🔄 **旋转加载器**：优雅的 SVG 圆形加载动画
- 💫 **粒子效果**：环绕的装饰性粒子增强视觉效果
- 📊 **进度条**：实时显示加载进度
- 🏷️ **品牌展示**：显示 Logo 和品牌名称
- 📱 **响应式设计**：完美适配移动端和桌面端
- ⚡ **平滑过渡**：使用 cubic-bezier 缓动函数实现流畅动画

## 🎯 设计思路

### 参考素材分析

素材提供了两种转场方案：

1. **刷新跳转版本** (`page1.html`, `page2.html`)
   - 使用固定的 `loading` 容器
   - 通过 `loading_out` class 控制显示/隐藏
   - 采用 `transform: translateY(100%)` 实现向下滑出效果
   - 简单但有效的加载动画（旋转圆圈）

2. **无刷跳转版本** (Vue Router)
   - 独立的 `Loading` 组件
   - 在 `App.vue` 中通过 `router.beforeEach` 控制
   - 更适合 SPA 应用

### 我们的实现

结合素材思路，我们实现了以下优化：

1. **组件化设计**：使用 Vue 3 Composition API
2. **状态管理**：通过 `v-model` 双向绑定控制显示状态
3. **路由集成**：在 `App.vue` 中配置路由守卫
4. **视觉增强**：
   - 渐变背景替代纯色
   - 添加粒子效果
   - 品牌 Logo 展示
   - 进度条反馈
   - 提示文本
5. **时序优化**：精确控制动画时间节点

## 🚀 使用方法

### 基本用法

```vue
<template>
  <PageTransition 
    ref="transitionRef"
    v-model="showTransition" 
    text="智学伴"
    :duration="1500"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageTransition from '@/components/PageTransition.vue';

const showTransition = ref(false);
const transitionRef = ref();

// 显示转场
const showLoading = () => {
  transitionRef.value?.show();
};

// 隐藏转场（会在 duration 时间后自动隐藏）
const hideLoading = () => {
  transitionRef.value?.hide();
};
</script>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `modelValue` | `boolean` | - | 控制显示/隐藏状态（支持 v-model） |
| `text` | `string` | `'LOADING'` | 加载文本 |
| `duration` | `number` | `1500` | 转场持续时间（毫秒） |

### Events

| 事件 | 说明 | 回调参数 |
|-----|------|---------|
| `update:modelValue` | 状态更新时触发 | `(value: boolean)` |
| `complete` | 转场完成时触发 | - |

### Methods (通过 ref 调用)

| 方法 | 说明 |
|-----|------|
| `show()` | 显示转场动画 |
| `hide()` | 隐藏转场动画（会等待 duration 时间） |

## 🔧 集成到路由

在 `App.vue` 中配置路由守卫：

```typescript
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PageTransition from './components/PageTransition.vue';

const router = useRouter();
const showTransition = ref(false);
const pageTransitionRef = ref();

const setupRouterGuards = () => {
  router.beforeEach((to, from, next) => {
    // 从登录页跳转到主应用时显示转场
    if (from.name === 'login' && to.meta.requiresAuth) {
      showTransition.value = true;
      pageTransitionRef.value?.show();
      
      // 延迟导航
      setTimeout(() => {
        next();
        
        // 页面渲染后隐藏转场
        setTimeout(() => {
          pageTransitionRef.value?.hide();
        }, 100);
      }, 600);
    } else {
      next();
    }
  });
};

onMounted(() => {
  setupRouterGuards();
});
```

## 🎨 动画时序

完整的转场流程：

```
用户点击登录
    ↓
 [0ms] 触发路由跳转
    ↓
[+0ms] 显示转场动画（slideDown 进入）
    ↓
[+600ms] 转场动画完全显示，开始路由导航
    ↓
[+700ms] 新页面开始渲染
    ↓
[+800ms] 开始隐藏转场动画（slideUp 离开）
    ↓
[+1600ms] 转场动画完全隐藏
    ↓
完成！用户看到主页面
```

## 🎭 动画效果详解

### 1. 背景渐变流动
- 使用 `background-position` 动画
- 3秒循环，无限重复
- 营造动态、现代的感觉

### 2. 圆形加载器
- SVG `stroke-dasharray` 和 `stroke-dashoffset` 动画
- 2秒旋转 + 1.5秒虚线动画
- 类似 Material Design 的加载指示器

### 3. 脉冲环
- 从 0.8 到 1.4 倍缩放
- 透明度从 1 到 0
- 2秒循环，创造"呼吸"效果

### 4. 文本弹跳
- 每个字符独立动画
- 延迟递增（0.1s * index）
- 上下弹跳 + 透明度变化

### 5. 粒子浮动
- 20个粒子随机分布
- 环绕中心圆形排列
- 上下浮动 + 缩放 + 透明度变化

### 6. Logo 脉冲
- 1.0 到 1.1 倍缩放
- 2秒循环
- 配合发光滤镜效果

## 📊 进度条实现

进度条使用 JavaScript 定时器模拟：

```typescript
const startProgress = () => {
  progress.value = 0;
  const step = 100 / (props.duration / 50); // 每50ms增加的进度
  
  progressTimer = window.setInterval(() => {
    if (progress.value < 100) {
      progress.value = Math.min(100, progress.value + step);
    } else {
      clearInterval(progressTimer);
    }
  }, 50);
};
```

## 🎯 最佳实践

1. **转场时机**：仅在重要的页面切换时使用（如登录→主应用）
2. **持续时间**：建议 1000-2000ms，过长会让用户不耐烦
3. **品牌一致性**：确保渐变色与网站主题色匹配
4. **性能优化**：使用 `transform` 和 `opacity` 进行动画（GPU 加速）
5. **用户体验**：提供清晰的视觉反馈（进度条、提示文本）

## 🔍 浏览器兼容性

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ 移动端浏览器

使用了现代 CSS 特性：
- CSS Variables
- backdrop-filter（需要前缀）
- CSS Grid/Flexbox
- CSS Animations

## 📝 自定义样式

可以通过修改组件内的 CSS 变量或样式来自定义：

```vue
<PageTransition 
  class="custom-transition"
  text="欢迎回来"
  :duration="2000"
/>

<style>
.custom-transition .page-transition-overlay {
  background: linear-gradient(135deg, 
    rgba(236, 72, 153, 0.98) 0%, 
    rgba(139, 92, 246, 0.98) 100%
  );
}
</style>
```

## 🤝 贡献

欢迎提出改进建议！可以考虑的增强方向：

- [ ] 添加更多预设主题（科技风、简约风、炫彩风）
- [ ] 支持自定义粒子数量和行为
- [ ] 添加音效支持
- [ ] 支持 Lottie 动画
- [ ] 添加骨架屏模式

---

**灵感来源**：素材/转场动画（JIEJOE produce）
**作者**：IntellisBuddy Team
**许可**：MIT

