<template>
  <div class="knowledge-graph-container">
    <div ref="graphContainer" class="graph-canvas"></div>
    <div class="graph-legend">
      <div class="legend-title">图例</div>
      <div class="legend-item">
        <span class="legend-dot completed"></span>
        <span>已完成</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot in-progress"></span>
        <span>学习中</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot not-started"></span>
        <span>未开始</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot locked"></span>
        <span>已锁定</span>
      </div>
      <div class="legend-item">
        <span class="legend-line recommended"></span>
        <span>推荐路径</span>
      </div>
    </div>
    <div class="graph-hint">
      <i class="fa-solid fa-lightbulb"></i>
      <span>Ctrl + 滚轮缩放 · Shift/Ctrl + 拖拽平移</span>
    </div>
    <div class="graph-controls">
      <button @click="zoomIn" title="放大"><i class="fa-solid fa-plus"></i></button>
      <button @click="zoomOut" title="缩小"><i class="fa-solid fa-minus"></i></button>
      <button @click="fitView" title="适应画布"><i class="fa-solid fa-compress"></i></button>
      <button @click="resetZoom" title="重置"><i class="fa-solid fa-rotate-right"></i></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
import {Graph} from '@antv/x6';
import {useKnowledgeStore, type KnowledgePoint} from '@/stores/knowledge';
import {useRouter} from 'vue-router';

interface Props {
  knowledgePoints: KnowledgePoint[];
  recommendedPath?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  recommendedPath: () => [],
});

const graphContainer = ref<HTMLElement | null>(null);
const knowledgeStore = useKnowledgeStore();
const router = useRouter();
let graph: Graph | null = null;

// 根据状态和难度返回节点样式
const getNodeStyle = (point: KnowledgePoint): {
  fill: string;
  stroke: string;
  gradient: string;
  textColor: string;
} => {
  const canUnlock = knowledgeStore.canUnlock(point.id);

  if (!canUnlock && point.status === 'not_started') {
    // 锁定状态 - 深灰色
    return {
      fill: '#424242',
      stroke: '#212121',
      gradient: 'linear-gradient(135deg, #616161 0%, #424242 100%)',
      textColor: '#9e9e9e',
    };
  }

  switch (point.status) {
    case 'completed':
      // 已完成 - 绿色渐变
      return {
        fill: '#52c41a',
        stroke: '#389e0d',
        gradient: 'linear-gradient(135deg, #73d13d 0%, #52c41a 100%)',
        textColor: '#ffffff',
      };
    case 'in_progress':
      // 学习中 - 橙色渐变
      return {
        fill: '#faad14',
        stroke: '#d48806',
        gradient: 'linear-gradient(135deg, #ffc53d 0%, #faad14 100%)',
        textColor: '#ffffff',
      };
    case 'not_started':
      // 未开始 - 根据难度使用不同渐变
      const difficulty = point.difficulty || 3;
      if (difficulty <= 2) {
        // 简单 - 蓝色渐变
        return {
          fill: '#1890ff',
          stroke: '#096dd9',
          gradient: 'linear-gradient(135deg, #40a9ff 0%, #1890ff 100%)',
          textColor: '#ffffff',
        };
      } else if (difficulty <= 3) {
        // 中等 - 紫色渐变
        return {
          fill: '#8a7ffb',
          stroke: '#6b5eca',
          gradient: 'linear-gradient(135deg, #9b8afb 0%, #7b6be8 100%)',
          textColor: '#ffffff',
        };
      } else {
        // 困难 - 粉紫色渐变
        return {
          fill: '#9b5de5',
          stroke: '#7b3fc4',
          gradient: 'linear-gradient(135deg, #b77aeb 0%, #9b5de5 100%)',
          textColor: '#ffffff',
        };
      }
    default:
      return {
        fill: '#d9d9d9',
        stroke: '#8c8c8c',
        gradient: 'linear-gradient(135deg, #e8e8e8 0%, #d9d9d9 100%)',
        textColor: '#666666',
      };
  }
};

// 获取难度等级显示
const getDifficultyStars = (difficulty?: number): string => {
  if (!difficulty) return '';
  return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
};

// 生成节点HTML内容
const generateNodeHTML = (point: KnowledgePoint, style: any, isRecommended: boolean): string => {
  const canUnlock = knowledgeStore.canUnlock(point.id);
  const isLocked = !canUnlock && point.status === 'not_started';
  const stars = getDifficultyStars(point.difficulty);
  const time = point.estimatedTime || 30;

  // 状态图标
  let statusIcon = '';
  let statusBadge = '';
  if (point.status === 'completed') {
    statusIcon = '✓';
    statusBadge = '<div class="node-badge completed">已完成</div>';
  } else if (point.status === 'in_progress') {
    statusIcon = '📚';
    statusBadge = '<div class="node-badge in-progress">学习中</div>';
  } else if (isLocked) {
    statusIcon = '🔒';
    statusBadge = '<div class="node-badge locked">已锁定</div>';
  } else if (isRecommended) {
    statusBadge = '<div class="node-badge recommended">推荐</div>';
  }

  return `
    <div class="knowledge-node" style="background: ${style.gradient}; width: 100%; height: 100%; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; position: relative; overflow: hidden;">
      ${statusBadge}
      ${
        statusIcon
          ? `<div class="node-icon" style="position: absolute; top: 8px; right: 8px; font-size: 20px;">${statusIcon}</div>`
          : ''
      }
      <div class="node-content" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 6px;">
        <div class="node-title" style="color: ${style.textColor}; font-size: 14px; font-weight: 600; text-align: center; line-height: 1.3; max-width: 100%; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
          ${point.title}
        </div>
        ${
          stars
            ? `<div class="node-difficulty" style="color: ${style.textColor}; font-size: 13px; opacity: 0.9; letter-spacing: 1px;">
          ${stars}
        </div>`
            : ''
        }
      </div>
      <div class="node-footer" style="display: flex; align-items: center; justify-content: center; gap: 4px; color: ${style.textColor}; font-size: 11px; opacity: 0.85;">
        <span>⏱</span>
        <span>${time}分钟</span>
      </div>
    </div>
  `;
};

// 初始化图谱
const initGraph = () => {
  if (!graphContainer.value) return;

  // 注册自定义HTML节点
  Graph.registerNode(
    'knowledge-card',
    {
      inherit: 'rect',
      width: 200,
      height: 120,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'foreignObject',
          selector: 'fo',
          children: [
            {
              tagName: 'div',
              ns: 'http://www.w3.org/1999/xhtml',
              selector: 'content',
            },
          ],
        },
      ],
      attrs: {
        body: {
          fill: 'transparent',
          stroke: 'none',
        },
        fo: {
          refWidth: '100%',
          refHeight: '100%',
        },
        content: {
          style: 'width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;',
        },
      },
    },
    true,
  );

  graph = new Graph({
    container: graphContainer.value,
    width: graphContainer.value.clientWidth,
    height: graphContainer.value.clientHeight,
    background: {
      color: 'transparent',
    },
    grid: {
      visible: true,
      type: 'dot',
      args: {
        color: 'rgba(255, 255, 255, 0.08)',
        thickness: 1,
      },
    },
    panning: {
      enabled: true,
      modifiers: ['shift', 'ctrl'],
    },
    mousewheel: {
      enabled: true,
      modifiers: ['ctrl', 'meta'],
      factor: 1.1,
      maxScale: 2,
      minScale: 0.3,
    },
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#fff',
            stroke: '#8a7ffb',
          },
        },
      },
    },
    connecting: {
      snap: true,
      allowBlank: false,
      allowLoop: false,
      highlight: true,
      connector: 'smooth',
    },
    interacting: {
      nodeMovable: false, // 禁止拖动节点，保持布局整洁
    },
  });

  // 渲染节点和边
  renderGraph();

  // 绑定节点点击事件
  graph.on('node:click', ({node}) => {
    const pointId = node.id;
    const point = props.knowledgePoints.find(p => p.id === pointId);
    if (!point) return;

    const canUnlock = knowledgeStore.canUnlock(pointId);
    if (!canUnlock) {
      const missingPrerequisites = knowledgeStore.getMissingPrerequisites(pointId);
      alert(`该课程已锁定。需要先完成以下前置课程：\n${missingPrerequisites.map(p => p.title).join('\n')}`);
      return;
    }

    // 跳转到学习页面
    router.push(`/learning/${pointId}`);
  });

  // 节点悬停效果
  graph.on('node:mouseenter', ({node}) => {
    const isRecommended = props.recommendedPath.includes(node.id);
    node.setAttrs({
      body: {
        strokeWidth: 4,
        stroke: isRecommended ? '#ff4d4f' : '#8a7ffb',
        filter: {
          name: 'dropShadow',
          args: {
            dx: 0,
            dy: 8,
            blur: 24,
            color: isRecommended ? 'rgba(255, 77, 79, 0.5)' : 'rgba(138, 127, 251, 0.5)',
          },
        },
      },
    });
  });

  graph.on('node:mouseleave', ({node}) => {
    const pointId = node.id;
    const isRecommended = props.recommendedPath.includes(pointId);
    node.setAttrs({
      body: {
        strokeWidth: isRecommended ? 3 : 0,
        stroke: isRecommended ? '#ff4d4f' : 'transparent',
        filter: {
          name: 'dropShadow',
          args: {
            dx: 0,
            dy: 6,
            blur: 16,
            color: isRecommended ? 'rgba(255, 77, 79, 0.3)' : 'rgba(0, 0, 0, 0.25)',
          },
        },
      },
    });
  });

  // 响应式调整
  window.addEventListener('resize', handleResize);
};

// 计算层级布局位置
const calculateHierarchicalLayout = () => {
  const pointsMap = new Map<string, KnowledgePoint>();
  props.knowledgePoints.forEach(p => pointsMap.set(p.id, p));

  // 1. 计算每个节点的层级
  const levels = new Map<string, number>();
  const visited = new Set<string>();

  const calculateLevel = (pointId: string): number => {
    if (levels.has(pointId)) return levels.get(pointId)!;
    if (visited.has(pointId)) return 0; // 避免循环依赖

    visited.add(pointId);
    const point = pointsMap.get(pointId);
    if (!point || !point.prerequisites || point.prerequisites.length === 0) {
      levels.set(pointId, 0);
      return 0;
    }

    const maxPreLevel = Math.max(...point.prerequisites.map(preId => calculateLevel(preId)));
    const level = maxPreLevel + 1;
    levels.set(pointId, level);
    return level;
  };

  props.knowledgePoints.forEach(p => calculateLevel(p.id));

  // 2. 按层级分组
  const levelGroups = new Map<number, string[]>();
  levels.forEach((level, pointId) => {
    if (!levelGroups.has(level)) {
      levelGroups.set(level, []);
    }
    levelGroups.get(level)!.push(pointId);
  });

  // 3. 计算布局位置
  const positions = new Map<string, {x: number; y: number}>();
  const nodeWidth = 200;
  const nodeHeight = 120;
  const horizontalSpacing = 250;
  const verticalSpacing = 180;

  const maxLevel = Math.max(...Array.from(levels.values()));

  levelGroups.forEach((pointIds, level) => {
    const groupWidth = pointIds.length * horizontalSpacing;
    const startX = -groupWidth / 2;

    pointIds.forEach((pointId, index) => {
      positions.set(pointId, {
        x: startX + index * horizontalSpacing + horizontalSpacing / 2,
        y: level * verticalSpacing,
      });
    });
  });

  return positions;
};

// 渲染图谱节点和边
const renderGraph = () => {
  if (!graph) return;

  graph.clearCells();

  const nodes: any[] = [];
  const edges: any[] = [];

  // 计算布局
  const positions = calculateHierarchicalLayout();

  // 创建节点
  props.knowledgePoints.forEach(point => {
    const style = getNodeStyle(point);
    const canUnlock = knowledgeStore.canUnlock(point.id);
    const isRecommended = props.recommendedPath.includes(point.id);
    const position = positions.get(point.id) || {x: 0, y: 0};
    const htmlContent = generateNodeHTML(point, style, isRecommended);

    nodes.push({
      id: point.id,
      shape: 'knowledge-card',
      x: position.x,
      y: position.y,
      width: 200,
      height: 120,
      attrs: {
        body: {
          fill: 'transparent',
          stroke: isRecommended ? '#ff4d4f' : 'transparent',
          strokeWidth: isRecommended ? 3 : 0,
          rx: 12,
          ry: 12,
          filter: {
            name: 'dropShadow',
            args: {
              dx: 0,
              dy: 6,
              blur: 16,
              color: isRecommended ? 'rgba(255, 77, 79, 0.3)' : 'rgba(0, 0, 0, 0.25)',
            },
          },
        },
        content: {
          html: htmlContent,
        },
      },
      data: {
        ...point,
        canUnlock,
      },
    });
  });

  // 创建边（前置依赖关系）
  props.knowledgePoints.forEach(point => {
    if (point.prerequisites && point.prerequisites.length > 0) {
      point.prerequisites.forEach(preId => {
        const isRecommendedEdge =
          props.recommendedPath.includes(preId) && props.recommendedPath.includes(point.id);

        edges.push({
          source: preId,
          target: point.id,
          attrs: {
            line: {
              stroke: isRecommendedEdge ? '#ff4d4f' : 'rgba(255, 255, 255, 0.3)',
              strokeWidth: isRecommendedEdge ? 3 : 2,
              targetMarker: {
                name: 'classic',
                size: isRecommendedEdge ? 10 : 8,
                fill: isRecommendedEdge ? '#ff4d4f' : 'rgba(255, 255, 255, 0.3)',
              },
              strokeDasharray: isRecommendedEdge ? '' : '5, 5',
            },
          },
          router: {
            name: 'manhattan',
            args: {
              padding: 20,
            },
          },
          connector: {
            name: 'rounded',
            args: {
              radius: 10,
            },
          },
        });
      });
    }
  });

  graph.addNodes(nodes);
  graph.addEdges(edges);

  // 自动居中并适应画布
  setTimeout(() => {
    if (graph) {
      graph.zoomToFit({padding: 40, maxScale: 1.2});
    }
  }, 100);
};

// 控制按钮方法
const zoomIn = () => {
  if (graph) graph.zoom(0.1);
};

const zoomOut = () => {
  if (graph) graph.zoom(-0.1);
};

const fitView = () => {
  if (graph) graph.zoomToFit({padding: 20, maxScale: 1});
};

const resetZoom = () => {
  if (graph) {
    graph.scale(1, 1);
    graph.centerContent();
  }
};

const handleResize = () => {
  if (graph && graphContainer.value) {
    graph.resize(graphContainer.value.clientWidth, graphContainer.value.clientHeight);
  }
};

// 监听知识点变化
watch(() => props.knowledgePoints, renderGraph, {deep: true});
watch(() => props.recommendedPath, renderGraph, {deep: true});

onMounted(() => {
  initGraph();
});
</script>

<style scoped>
.knowledge-graph-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.graph-canvas {
  width: 100%;
  height: 100%;
  border-radius: var(--border-radius);
  overflow: hidden;
  background: linear-gradient(135deg, rgba(138, 127, 251, 0.05) 0%, rgba(155, 93, 229, 0.05) 100%);
}

.graph-legend {
  position: absolute;
  top: 20px;
  left: 20px;
  background: var(--card-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.legend-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  border-bottom: 1px solid var(--card-border);
  padding-bottom: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.legend-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid transparent;
}

.legend-dot.completed {
  background: #52c41a;
  border-color: #389e0d;
}

.legend-dot.in-progress {
  background: #faad14;
  border-color: #d48806;
}

.legend-dot.not-started {
  background: #1890ff;
  border-color: #096dd9;
}

.legend-dot.locked {
  background: #555;
  border-color: #333;
}

.legend-line {
  width: 30px;
  height: 2px;
  background: #666;
}

.legend-line.recommended {
  background: #ff4d4f;
  height: 3px;
}

.graph-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  background: var(--card-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 8px;
}

.graph-controls button {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(138, 127, 251, 0.2);
  color: var(--text-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.graph-controls button:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(138, 127, 251, 0.4);
}

.graph-controls button:active {
  transform: translateY(0);
}

.graph-hint {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: var(--card-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--text-secondary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.graph-hint i {
  color: var(--primary-color);
  font-size: 14px;
}

/* 知识节点卡片样式 */
:deep(.knowledge-node) {
  cursor: pointer;
  transition: transform 0.3s ease;
}

:deep(.knowledge-node:hover) {
  transform: scale(1.05);
}

:deep(.node-badge) {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  backdrop-filter: blur(4px);
  z-index: 1;
  white-space: nowrap;
}

:deep(.node-badge.completed) {
  background: rgba(82, 196, 26, 0.9);
  color: white;
}

:deep(.node-badge.in-progress) {
  background: rgba(250, 173, 20, 0.9);
  color: white;
}

:deep(.node-badge.locked) {
  background: rgba(0, 0, 0, 0.6);
  color: #9e9e9e;
}

:deep(.node-badge.recommended) {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4d4f 100%);
  color: white;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

:deep(.node-icon) {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

:deep(.node-title) {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

:deep(.node-difficulty) {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .graph-legend {
    top: 10px;
    left: 10px;
    padding: 10px;
    font-size: 10px;
  }

  .legend-title {
    font-size: 11px;
  }

  .graph-hint {
    display: none;
  }

  .graph-controls {
    bottom: 10px;
    right: 10px;
    padding: 6px;
  }

  .graph-controls button {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
}
</style>




