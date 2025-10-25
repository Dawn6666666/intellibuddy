<template>
  <div class="notification-panel">
    <div class="panel-header">
      <h3>通知中心</h3>
      <el-button link @click="markAllRead" :disabled="unreadCount === 0">
        全部已读
      </el-button>
    </div>

    <el-tabs v-model="activeTab" class="notification-tabs">
      <el-tab-pane label="全部" name="all">
        <div class="tab-badge" v-if="unreadCount > 0">{{ unreadCount }}</div>
      </el-tab-pane>
      <el-tab-pane label="未读" name="unread">
        <div class="tab-badge" v-if="unreadCount > 0">{{ unreadCount }}</div>
      </el-tab-pane>
      <el-tab-pane label="作业" name="assignment" />
      <el-tab-pane label="成绩" name="grade" />
      <el-tab-pane label="系统" name="system" />
    </el-tabs>

    <div class="notifications-list" v-loading="loading">
      <el-empty v-if="notifications.length === 0" description="暂无通知" />
      
      <div 
        v-for="notification in notifications" 
        :key="notification._id"
        class="notification-item"
        :class="{ unread: !notification.read }"
        @click="handleNotificationClick(notification)"
      >
        <div class="notification-icon" :class="`type-${notification.type}`">
          <i :class="getNotificationIcon(notification.type)"></i>
        </div>
        
        <div class="notification-content">
          <div class="notification-header">
            <h4>{{ notification.title }}</h4>
            <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
          </div>
          <p class="notification-text">{{ notification.content }}</p>
          
          <div class="notification-meta" v-if="notification.metadata">
            <el-tag size="small" v-if="notification.metadata.className">
              {{ notification.metadata.className }}
            </el-tag>
            <el-tag size="small" type="warning" v-if="notification.metadata.dueDateStr">
              截止：{{ notification.metadata.dueDateStr }}
            </el-tag>
            <el-tag size="small" type="success" v-if="notification.metadata.totalScore">
              总分：{{ notification.metadata.totalScore }}
            </el-tag>
          </div>
        </div>

        <div class="notification-actions">
          <el-button 
            link 
            size="small" 
            @click.stop="markAsRead(notification)"
            v-if="!notification.read"
          >
            标记已读
          </el-button>
          <el-button 
            link 
            size="small" 
            type="danger"
            @click.stop="deleteNotification(notification)"
          >
            删除
          </el-button>
        </div>
      </div>
    </div>

    <div class="panel-footer" v-if="totalPages > 1">
      <el-pagination
        small
        layout="prev, pager, next"
        :total="total"
        :page-size="limit"
        v-model:current-page="currentPage"
        @current-change="loadNotifications"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { apiClient } from '@/services/apiService';
import { useRouter } from 'vue-router';

const router = useRouter();

const activeTab = ref('all');
const loading = ref(false);
const notifications = ref<any[]>([]);
const unreadCount = ref(0);
const total = ref(0);
const currentPage = ref(1);
const limit = ref(20);

const totalPages = computed(() => Math.ceil(total.value / limit.value));

const emit = defineEmits(['update-count', 'close']);

onMounted(() => {
  loadNotifications();
});

watch(activeTab, () => {
  currentPage.value = 1;
  loadNotifications();
});

async function loadNotifications() {
  try {
    loading.value = true;
    
    const params: any = {
      page: currentPage.value,
      limit: limit.value
    };

    if (activeTab.value === 'unread') {
      params.unreadOnly = true;
    } else if (activeTab.value !== 'all') {
      params.type = activeTab.value;
    }

    const response = await apiClient.get('/notification/my', { params });
    notifications.value = response.data.notifications;
    unreadCount.value = response.data.unreadCount;
    total.value = response.data.total;
    
    emit('update-count', unreadCount.value);
  } catch (error) {
    console.error('加载通知失败:', error);
    ElMessage.error('加载通知失败');
  } finally {
    loading.value = false;
  }
}

async function markAsRead(notification: any) {
  try {
    await apiClient.put(`/notification/${notification._id}/read`);
    notification.read = true;
    notification.readAt = new Date();
    unreadCount.value = Math.max(0, unreadCount.value - 1);
    emit('update-count', unreadCount.value);
  } catch (error) {
    console.error('标记已读失败:', error);
    ElMessage.error('标记已读失败');
  }
}

async function markAllRead() {
  try {
    await apiClient.put('/notification/mark-all-read');
    notifications.value.forEach(n => {
      n.read = true;
      n.readAt = new Date();
    });
    unreadCount.value = 0;
    emit('update-count', 0);
    ElMessage.success('已标记全部已读');
  } catch (error) {
    console.error('标记全部已读失败:', error);
    ElMessage.error('操作失败');
  }
}

async function deleteNotification(notification: any) {
  try {
    await ElMessageBox.confirm('确定要删除这条通知吗？', '确认删除', {
      type: 'warning'
    });

    await apiClient.delete(`/notification/${notification._id}`);
    
    const index = notifications.value.findIndex(n => n._id === notification._id);
    if (index > -1) {
      notifications.value.splice(index, 1);
      if (!notification.read) {
        unreadCount.value = Math.max(0, unreadCount.value - 1);
        emit('update-count', unreadCount.value);
      }
    }
    
    ElMessage.success('通知已删除');
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除通知失败:', error);
      ElMessage.error('删除失败');
    }
  }
}

function handleNotificationClick(notification: any) {
  // 标记为已读
  if (!notification.read) {
    markAsRead(notification);
  }

  // 跳转到相关页面
  if (notification.actionUrl) {
    emit('close');
    router.push(notification.actionUrl);
  }
}

function getNotificationIcon(type: string) {
  const icons: Record<string, string> = {
    assignment: 'fa-solid fa-file-pen',
    grade: 'fa-solid fa-star',
    class: 'fa-solid fa-users',
    system: 'fa-solid fa-bell',
    announcement: 'fa-solid fa-bullhorn'
  };
  return icons[type] || 'fa-solid fa-bell';
}

function formatTime(date: string | Date) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  
  return d.toLocaleDateString('zh-CN');
}
</script>

<style scoped>
.notification-panel {
  width: 420px;
  max-height: 600px;
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--card-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.notification-tabs {
  border-bottom: 1px solid var(--card-border);
}

.notification-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 20px;
}

.notification-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.tab-badge {
  position: absolute;
  top: 8px;
  right: -8px;
  background: #f56c6c;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

.notifications-list {
  flex: 1;
  overflow-y: auto;
  max-height: 450px;
}

.notification-item {
  padding: 16px 20px;
  border-bottom: 1px solid var(--card-border);
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}

.notification-item:hover {
  background: var(--hover-bg);
}

.notification-item.unread {
  background: var(--primary-bg-light);
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 24px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary-color);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
  color: white;
}

.notification-icon.type-assignment {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.notification-icon.type-grade {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.notification-icon.type-class {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.notification-icon.type-system {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.notification-icon.type-announcement {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
  gap: 8px;
}

.notification-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.notification-time {
  font-size: 12px;
  color: var(--text-tertiary);
  white-space: nowrap;
}

.notification-text {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.notification-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.notification-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.panel-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--card-border);
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .notification-panel {
    width: 100vw;
    max-height: 100vh;
    border-radius: 0;
  }
}
</style>

