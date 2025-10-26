<template>
  <div class="my-classes-view">
    <div class="page-header">
      <h1><i class="fa-solid fa-users"></i> 我的班级</h1>
      <el-button type="primary" @click="showJoinDialog = true">
        <i class="fa-solid fa-plus"></i> 加入班级
      </el-button>
    </div>

    <!-- 已加入的班级列表 -->
    <div class="classes-section">
      <!-- 加载骨架屏 -->
      <el-row :gutter="20" v-if="loading">
        <el-col :xs="24"
:sm="12"
:lg="8"
v-for="i in 3"
:key="'skeleton-' + i">
          <div class="class-card skeleton-card">
            <div class="class-header">
              <div class="class-info">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-teacher"></div>
              </div>
              <div class="skeleton skeleton-badge"></div>
            </div>
            
            <div class="class-content">
              <div class="skeleton skeleton-description"></div>
              <div class="skeleton skeleton-description" style="width: 70%;"></div>
              <div class="class-meta" style="margin-top: 12px;">
                <div class="skeleton skeleton-meta-item"></div>
                <div class="skeleton skeleton-meta-item"></div>
                <div class="skeleton skeleton-meta-item"></div>
              </div>
            </div>

            <div class="class-footer">
              <div class="skeleton skeleton-tag"></div>
              <div class="skeleton skeleton-button"></div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 实际班级列表 -->
      <el-row :gutter="20" v-else-if="myClasses.length > 0">
        <el-col :xs="24"
:sm="12"
:lg="8"
v-for="cls in myClasses"
:key="cls._id">
          <el-card class="class-card" shadow="hover" @click="viewClassDetail(cls)">
            <div class="class-header">
              <div class="class-info">
                <h3>{{ cls.name }}</h3>
                <p class="teacher-name">
                  <i class="fa-solid fa-chalkboard-user"></i>
                  {{ cls.teacher?.username || '未知教师' }}
                </p>
              </div>
              <div class="class-badge">
                <i class="fa-solid fa-graduation-cap"></i>
              </div>
            </div>
            
            <div class="class-content">
              <p v-if="cls.description" class="description">{{ cls.description }}</p>
              <div class="class-meta">
                <div class="meta-item" v-if="cls.subject">
                  <i class="fa-solid fa-book"></i>
                  <span>{{ cls.subject }}</span>
                </div>
                <div class="meta-item" v-if="cls.grade">
                  <i class="fa-solid fa-school"></i>
                  <span>{{ cls.grade }}</span>
                </div>
                <div class="meta-item">
                  <i class="fa-solid fa-users"></i>
                  <span>{{ cls.students?.length || 0 }} 人</span>
                </div>
              </div>
            </div>

            <div class="class-footer">
              <el-tag size="small" type="info">
                加入时间: {{ formatDate(cls.joinedAt) }}
              </el-tag>
              <el-button 
                type="primary" 
                link 
                @click.stop="viewClassDetail(cls)"
              >
                查看详情 <i class="fa-solid fa-arrow-right"></i>
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 空状态 -->
      <el-empty 
        v-else 
        description="还没有加入任何班级"
        :image-size="200"
      >
        <el-button type="primary" @click="showJoinDialog = true">
          <i class="fa-solid fa-plus"></i> 加入班级
        </el-button>
      </el-empty>
    </div>

    <!-- 加入班级对话框 -->
    <el-dialog
      v-model="showJoinDialog"
      title="加入班级"
      width="90%"
      :style="{ maxWidth: '500px' }"
      :close-on-click-modal="false"
    >
      <div class="join-dialog-content">
        <div class="join-illustration">
          <i class="fa-solid fa-users-line"></i>
        </div>
        
        <p class="join-tips">
          请输入教师提供的 <strong>8位邀请码</strong> 来加入班级
        </p>

        <el-form :model="joinForm" label-width="0">
          <el-form-item>
            <el-input
              v-model="joinForm.inviteCode"
              placeholder="请输入邀请码（8位字母或数字）"
              maxlength="8"
              show-word-limit
              size="large"
              clearable
              @input="formatInviteCode"
            >
              <template #prefix>
                <i class="fa-solid fa-key"></i>
              </template>
            </el-input>
          </el-form-item>
        </el-form>

        <div class="join-help">
          <el-alert
            type="info"
            :closable="false"
            show-icon
          >
            <template #title>
              <div class="help-content">
                <p>💡 <strong>如何获取邀请码？</strong></p>
                <p>请向您的老师索取班级邀请码，邀请码通常为8位字符</p>
              </div>
            </template>
          </el-alert>
        </div>
      </div>

      <template #footer>
        <el-button @click="showJoinDialog = false" size="large">取消</el-button>
        <el-button 
          type="primary" 
          @click="joinClass" 
          :loading="joining"
          :disabled="joinForm.inviteCode.length !== 8"
          size="large"
        >
          <i class="fa-solid fa-right-to-bracket"></i> 加入班级
        </el-button>
      </template>
    </el-dialog>

    <!-- 班级详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      :title="selectedClass?.name"
      width="90%"
      :style="{ maxWidth: '800px' }"
    >
      <div class="class-detail" v-if="selectedClass">
        <div class="detail-header">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="班级名称">
              {{ selectedClass.name }}
            </el-descriptions-item>
            <el-descriptions-item label="任课教师">
              {{ selectedClass.teacher?.username || '未知' }}
            </el-descriptions-item>
            <el-descriptions-item label="科目">
              {{ selectedClass.subject || '未设置' }}
            </el-descriptions-item>
            <el-descriptions-item label="年级">
              {{ selectedClass.grade || '未设置' }}
            </el-descriptions-item>
            <el-descriptions-item label="学期">
              {{ selectedClass.semester || '未设置' }}
            </el-descriptions-item>
            <el-descriptions-item label="班级人数">
              {{ selectedClass.students?.length || 0 }} 人
            </el-descriptions-item>
            <el-descriptions-item label="班级描述" :span="2">
              {{ selectedClass.description || '暂无描述' }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-stats">
          <h4><i class="fa-solid fa-chart-simple"></i> 我的学习情况</h4>
          <el-row :gutter="16">
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-value">{{ classStats.completedAssignments }}</div>
                <div class="stat-label">已完成作业</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-value">{{ classStats.pendingAssignments }}</div>
                <div class="stat-label">待完成作业</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-value">{{ classStats.avgScore }}%</div>
                <div class="stat-label">平均成绩</div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 作业列表 -->
        <div class="detail-assignments">
          <h4><i class="fa-solid fa-clipboard-list"></i> 班级作业</h4>
          <div v-loading="loadingAssignments">
            <div
              v-for="assignment in classAssignments"
              :key="assignment._id"
              class="assignment-item"
            >
              <div class="assignment-info">
                <h5>{{ assignment.title }}</h5>
                <div class="assignment-meta">
                  <el-tag :type="getAssignmentTypeTag(assignment.type)" size="small">
                    {{ getAssignmentTypeLabel(assignment.type) }}
                  </el-tag>
                  <span class="meta-text">
                    <i class="fa-solid fa-star"></i> {{ assignment.totalScore }}分
                  </span>
                  <span class="meta-text" v-if="assignment.dueDate">
                    <i class="fa-solid fa-calendar"></i> {{ formatDate(assignment.dueDate) }}
                  </span>
                </div>
              </div>
              <div class="assignment-actions">
                <el-tag
                  v-if="getSubmissionStatus(assignment._id)"
                  :type="getSubmissionStatus(assignment._id) === '已提交' ? 'success' : 'warning'"
                  size="small"
                >
                  {{ getSubmissionStatus(assignment._id) }}
                </el-tag>
                <div style="display: flex; gap: 8px;">
                  <el-button
                    v-if="!getSubmissionStatus(assignment._id)"
                    type="primary"
                    size="small"
                    @click="startAssignment(assignment)"
                  >
                    开始答题
                  </el-button>
                  <template v-else>
                    <el-button
                      type="info"
                      size="small"
                      @click="viewSubmission(assignment)"
                    >
                      查看提交
                    </el-button>
                    <el-button
                      v-if="canRetakeAssignment(assignment)"
                      type="primary"
                      size="small"
                      @click="startAssignment(assignment)"
                    >
                      重新提交
                    </el-button>
                  </template>
                </div>
              </div>
            </div>
            <el-empty v-if="classAssignments.length === 0" description="暂无作业" />
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
        <el-button type="danger" @click="confirmLeaveClass" v-if="selectedClass">
          <i class="fa-solid fa-right-from-bracket"></i> 退出班级
        </el-button>
      </template>
    </el-dialog>

    <!-- 答题对话框 -->
    <el-dialog
      v-model="showAnswerDialog"
      :title="currentAssignment?.title"
      width="95%"
      fullscreen
      destroy-on-close
    >
      <AnswerSheet
        v-if="currentAssignment"
        :assignment="currentAssignment"
        @submit="handleSubmitAssignment"
        @cancel="showAnswerDialog = false"
      />
    </el-dialog>

    <!-- 提交详情对话框 -->
    <el-dialog
      v-model="showSubmissionDialog"
      title="我的提交记录"
      width="90%"
      :style="{ maxWidth: '900px' }"
      :close-on-click-modal="false"
    >
      <div v-loading="loadingSubmission" class="submission-detail">
        <div v-if="submissionData">
          <!-- 作业信息 -->
          <div class="submission-header">
            <h3>{{ submissionData.assignmentTitle }}</h3>
            <el-tag :type="getAssignmentTypeTag(submissionData.assignmentType)" size="large">
              {{ getAssignmentTypeLabel(submissionData.assignmentType) }}
            </el-tag>
          </div>

          <!-- 提交列表 -->
          <div class="submissions-list">
            <div
              v-for="(submission, index) in submissionData.submissions"
              :key="index"
              class="submission-card"
              :class="{ 'is-latest': submission.isLatest }"
            >
              <div class="submission-summary">
                <div class="summary-left">
                  <div class="attempt-badge">
                    <i class="fa-solid fa-pen-to-square"></i>
                    第 {{ submission.attempt }} 次提交
                    <el-tag v-if="submission.isLatest"
type="success"
size="small"
style="margin-left: 8px;">
                      最新
                    </el-tag>
                  </div>
                  <div class="submit-time">
                    <i class="fa-regular fa-clock"></i>
                    {{ formatDateTime(submission.submittedAt) }}
                  </div>
                  <div class="time-spent" v-if="submission.timeSpent">
                    <i class="fa-solid fa-hourglass-half"></i>
                    用时 {{ formatTimeSpent(submission.timeSpent) }}
                  </div>
                </div>
                <div class="summary-right">
                  <div class="score-display">
                    <div class="score-value" :class="{ 'passed': submission.isPassed }">
                      {{ submission.score }}
                    </div>
                    <div class="score-total">/ {{ submission.totalScore }}</div>
                  </div>
                  <el-tag
                    :type="submission.isPassed ? 'success' : 'danger'"
                    size="large"
                  >
                    {{ submission.isPassed ? '及格' : '不及格' }}
                  </el-tag>
                  <el-tag
                    v-if="submission.status === 'late'"
                    type="warning"
                    size="small"
                    style="margin-top: 4px;"
                  >
                    迟交
                  </el-tag>
                </div>
              </div>

              <!-- 详细答题情况 -->
              <div v-if="submissionData.showAnswers && submission.questionResults" class="question-results">
                <el-divider content-position="left">
                  <i class="fa-solid fa-list-check"></i> 答题详情
                </el-divider>
                <div
                  v-for="result in submission.questionResults"
                  :key="result.questionIndex"
                  class="question-result-item"
                  :class="{ 'is-correct': result.isCorrect, 'is-wrong': !result.isCorrect }"
                >
                  <div class="result-header">
                    <span class="question-num">第 {{ result.questionIndex }} 题</span>
                    <span class="question-title">{{ result.questionTitle }}</span>
                    <el-tag
                      :type="result.isCorrect ? 'success' : 'danger'"
                      size="small"
                    >
                      {{ result.isCorrect ? '✓ 正确' : '✗ 错误' }}
                    </el-tag>
                    <span class="question-score">
                      {{ result.score }} / {{ result.maxScore }} 分
                    </span>
                  </div>
                  <div class="result-answers" v-if="submissionData.showAnswers">
                    <div class="answer-row">
                      <span class="answer-label">你的答案：</span>
                      <span class="answer-value user-answer">{{ formatAnswer(result.userAnswer) }}</span>
                    </div>
                    <div class="answer-row" v-if="!result.isCorrect">
                      <span class="answer-label">正确答案：</span>
                      <span class="answer-value correct-answer">{{ formatAnswer(result.correctAnswer) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="!submissionData.showAnswers" class="no-answers-tip">
                <el-alert
                  type="info"
                  :closable="false"
                  show-icon
                >
                  教师设置了不显示答案，暂时无法查看详细答题情况
                </el-alert>
              </div>
            </div>
          </div>

          <!-- 重做提示 -->
          <div v-if="submissionData.allowRetake" class="retake-info">
            <el-alert
              type="success"
              :closable="false"
              show-icon
            >
              <template #title>
                <div>
                  该作业允许重做
                  <span v-if="submissionData.maxAttempts">
                    （最多 {{ submissionData.maxAttempts }} 次，已提交 {{ submissionData.submissions.length }} 次）
                  </span>
                </div>
              </template>
            </el-alert>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="showSubmissionDialog = false" size="large">关闭</el-button>
        <el-button
          v-if="submissionData?.allowRetake && canRetake"
          type="primary"
          size="large"
          @click="retakeAssignment"
        >
          <i class="fa-solid fa-rotate-right"></i> 重新答题
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { apiClient } from '@/services/apiService';
import { useUserStore } from '@/stores/user';
import AnswerSheet from '@/components/AnswerSheet.vue';

const userStore = useUserStore();

// 数据
const loading = ref(false);
const myClasses = ref<any[]>([]);
const showJoinDialog = ref(false);
const showDetailDialog = ref(false);
const joining = ref(false);
const selectedClass = ref<any>(null);
const classStats = ref({
  completedAssignments: 0,
  pendingAssignments: 0,
  avgScore: 0
});

// 作业相关
const loadingAssignments = ref(false);
const classAssignments = ref<any[]>([]);
const showAnswerDialog = ref(false);
const currentAssignment = ref<any>(null);

// 提交详情相关
const showSubmissionDialog = ref(false);
const loadingSubmission = ref(false);
const submissionData = ref<any>(null);
const currentSubmissionAssignment = ref<any>(null);

// 表单
const joinForm = ref({
  inviteCode: ''
});

// 加载我的班级列表
const loadMyClasses = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get('/class/joined', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    });
    myClasses.value = response.data;
  } catch (error: any) {
    console.error('加载班级列表失败:', error);
    ElMessage.error(error.response?.data?.error || '加载班级列表失败');
  } finally {
    loading.value = false;
  }
};

// 格式化邀请码（自动转大写）
const formatInviteCode = () => {
  joinForm.value.inviteCode = joinForm.value.inviteCode.toUpperCase();
};

// 加入班级
const joinClass = async () => {
  if (!joinForm.value.inviteCode || joinForm.value.inviteCode.length !== 8) {
    ElMessage.warning('请输入正确的8位邀请码');
    return;
  }

  joining.value = true;
  try {
    await apiClient.post('/class/join', 
      { inviteCode: joinForm.value.inviteCode },
      { headers: { Authorization: `Bearer ${userStore.token}` } }
    );
    
    ElMessage.success('成功加入班级！');
    showJoinDialog.value = false;
    joinForm.value.inviteCode = '';
    
    // 重新加载班级列表
    await loadMyClasses();
  } catch (error: any) {
    console.error('加入班级失败:', error);
    ElMessage.error(error.response?.data?.error || '加入班级失败，请检查邀请码是否正确');
  } finally {
    joining.value = false;
  }
};

// 查看班级详情
const viewClassDetail = async (cls: any) => {
  selectedClass.value = cls;
  showDetailDialog.value = true;
  
  // 加载班级作业
  await loadClassAssignments(cls._id);
  
  // 计算统计数据
  const completedCount = classAssignments.value.filter(a => 
    getSubmissionStatus(a._id)
  ).length;
  
  classStats.value = {
    completedAssignments: completedCount,
    pendingAssignments: classAssignments.value.length - completedCount,
    avgScore: 0 // TODO: 计算平均分
  };
};

// 加载班级作业列表
const loadClassAssignments = async (classId: string) => {
  try {
    loadingAssignments.value = true;
    const response = await apiClient.get(`/assignment/class/${classId}`, {
      headers: { Authorization: `Bearer ${userStore.token}` }
    });
    classAssignments.value = response.data.filter((a: any) => a.status === 'published');
  } catch (error: any) {
    console.error('加载作业列表失败:', error);
    ElMessage.error(error.response?.data?.error || '加载作业列表失败');
  } finally {
    loadingAssignments.value = false;
  }
};

// 获取提交状态
const getSubmissionStatus = (assignmentId: string) => {
  const assignment = classAssignments.value.find(a => a._id === assignmentId);
  if (!assignment) return null;
  
  const userId = userStore.user?._id;
  const submission = assignment.submissions?.find((s: any) => s.userId === userId);
  
  if (submission) {
    return submission.status === 'graded' ? '已批改' : '已提交';
  }
  return null;
};

// 判断是否可以重新提交
const canRetakeAssignment = (assignment: any) => {
  if (!assignment.settings?.allowRetake) return false;
  
  const userId = userStore.user?._id;
  const userSubmissions = assignment.submissions?.filter((s: any) => s.userId === userId) || [];
  
  // 如果没有设置最大尝试次数，则允许无限重做
  if (!assignment.settings.maxAttempts) return true;
  
  // 检查是否还有剩余尝试次数
  return userSubmissions.length < assignment.settings.maxAttempts;
};

// 开始答题
const startAssignment = (assignment: any) => {
  if (assignment.questions.length === 0) {
    ElMessage.warning('该作业暂无题目');
    return;
  }
  
  currentAssignment.value = assignment;
  showAnswerDialog.value = true;
};

// 提交作业
const handleSubmitAssignment = async (answers: any[]) => {
  try {
    await apiClient.post(
      `/assignment/${currentAssignment.value._id}/submit`,
      { answers },
      { headers: { Authorization: `Bearer ${userStore.token}` } }
    );
    
    ElMessage.success('作业提交成功！');
    showAnswerDialog.value = false;
    
    // 重新加载作业列表
    await loadClassAssignments(selectedClass.value._id);
    
    // 更新统计
    const completedCount = classAssignments.value.filter(a => 
      getSubmissionStatus(a._id)
    ).length;
    classStats.value.completedAssignments = completedCount;
    classStats.value.pendingAssignments = classAssignments.value.length - completedCount;
  } catch (error: any) {
    console.error('提交作业失败:', error);
    ElMessage.error(error.response?.data?.error || '提交作业失败');
  }
};

// 查看提交记录
const viewSubmission = async (assignment: any) => {
  currentSubmissionAssignment.value = assignment;
  showSubmissionDialog.value = true;
  loadingSubmission.value = true;
  
  try {
    const response = await apiClient.get(
      `/assignment/${assignment._id}/my-submission`,
      { headers: { Authorization: `Bearer ${userStore.token}` }}
    );
    submissionData.value = response.data;
  } catch (error: any) {
    console.error('获取提交详情失败:', error);
    ElMessage.error(error.response?.data?.error || '获取提交详情失败');
    showSubmissionDialog.value = false;
  } finally {
    loadingSubmission.value = false;
  }
};

// 计算是否可以重做
const canRetake = computed(() => {
  if (!submissionData.value) return false;
  if (!submissionData.value.allowRetake) return false;
  if (!submissionData.value.maxAttempts) return true;
  return submissionData.value.submissions.length < submissionData.value.maxAttempts;
});

// 重新答题
const retakeAssignment = () => {
  showSubmissionDialog.value = false;
  startAssignment(currentSubmissionAssignment.value);
};

// 格式化答案显示
const formatAnswer = (answer: any) => {
  if (!answer && answer !== false && answer !== 0) return '未作答';
  
  // 判断题答案转换
  if (answer === 'true' || answer === true) return '正确';
  if (answer === 'false' || answer === false) return '错误';
  
  // 字符串直接返回
  if (typeof answer === 'string') return answer;
  
  // 数组（多选题）拼接
  if (Array.isArray(answer)) return answer.join(', ');
  
  return JSON.stringify(answer);
};

// 格式化时间显示（日期+时间）
const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 格式化用时显示
const formatTimeSpent = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  } else if (minutes > 0) {
    return `${minutes}分钟${secs}秒`;
  } else {
    return `${secs}秒`;
  }
};

// 作业类型标签
const getAssignmentTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    practice: '练习',
    quiz: '测验',
    homework: '作业',
    exam: '考试'
  };
  return labels[type] || type;
};

const getAssignmentTypeTag = (type: string) => {
  const tags: Record<string, string> = {
    practice: 'info',
    quiz: 'warning',
    homework: 'success',
    exam: 'danger'
  };
  return tags[type] || '';
};


// 退出班级
const confirmLeaveClass = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要退出班级"${selectedClass.value?.name}"吗？退出后将无法查看该班级的作业和资料。`,
      '确认退出',
      {
        confirmButtonText: '确定退出',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    // 执行退出
    await apiClient.post(
      `/class/${selectedClass.value._id}/leave`,
      {},
      { headers: { Authorization: `Bearer ${userStore.token}` } }
    );
    ElMessage.success('已退出班级');
    showDetailDialog.value = false;
    selectedClass.value = null;
    
    // 重新加载列表
    await loadMyClasses();
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('退出班级失败:', error);
      ElMessage.error(error.response?.data?.error || '退出班级失败');
    }
  }
};

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '未知';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN');
};


// 初始化
onMounted(() => {
  loadMyClasses();
});
</script>

<style scoped>
.my-classes-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
}

.page-header h1 i {
  color: var(--primary-color);
}

/* 骨架屏动画 */
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(138, 127, 251, 0.1) 25%,
    rgba(138, 127, 251, 0.2) 50%,
    rgba(138, 127, 251, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skeleton-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  pointer-events: none;
  animation: fadeIn 0.3s ease-out;
}

/* 实际卡片淡入动画 */
.class-card {
  animation: fadeIn 0.4s ease-out;
}

.skeleton-title {
  width: 60%;
  height: 24px;
  margin-bottom: 8px;
}

.skeleton-teacher {
  width: 40%;
  height: 16px;
}

.skeleton-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  flex-shrink: 0;
}

.skeleton-description {
  width: 100%;
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-meta-item {
  width: 80px;
  height: 16px;
  border-radius: 6px;
}

.skeleton-tag {
  width: 120px;
  height: 24px;
  border-radius: 4px;
}

.skeleton-button {
  width: 90px;
  height: 24px;
  border-radius: 4px;
}

/* 班级卡片 */
.class-card:not(.skeleton-card) {
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
}

.class-card:not(.skeleton-card):hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.skeleton-card {
  cursor: default;
}

.skeleton-card:hover {
  transform: none;
  box-shadow: none;
}

.class-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.class-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.teacher-name {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.class-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.class-content {
  margin-bottom: 16px;
}

.description {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.6;
}

.class-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.meta-item i {
  color: var(--primary-color);
}

.class-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--card-border);
}

/* 加入对话框 */
.join-dialog-content {
  padding: 20px 0;
}

.join-illustration {
  text-align: center;
  margin-bottom: 24px;
}

.join-illustration i {
  font-size: 64px;
  color: var(--primary-color);
  opacity: 0.8;
}

.join-tips {
  text-align: center;
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.6;
}

.join-tips strong {
  color: var(--primary-color);
  font-weight: 600;
}

.join-help {
  margin-top: 20px;
}

.help-content p {
  margin: 4px 0;
  font-size: 13px;
  line-height: 1.6;
}

/* 班级详情 */
.class-detail {
  padding: 10px 0;
}

.detail-header {
  margin-bottom: 24px;
}

.detail-stats {
  margin-bottom: 24px;
}

.detail-stats h4,
.detail-assignments h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-stats h4 i,
.detail-assignments h4 i {
  color: var(--primary-color);
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
}

/* 作业列表样式 */
.assignment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  background: var(--hover-bg);
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.assignment-item:hover {
  background: var(--card-border);
  border-color: var(--primary-color);
}

.assignment-info {
  flex: 1;
}

.assignment-info h5 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.assignment-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-text {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-secondary);
}

.meta-text i {
  color: var(--primary-color);
}

.assignment-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 响应式 */
@media (max-width: 768px) {
  .my-classes-view {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .class-meta {
    flex-direction: column;
    gap: 8px;
  }

  .class-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  /* 骨架屏移动端适配 */
  .skeleton-title {
    width: 80%;
  }

  .skeleton-teacher {
    width: 60%;
  }

  .skeleton-badge {
    width: 40px;
    height: 40px;
  }
}

/* 提交详情对话框样式 */
.submission-detail {
  padding: 20px 0;
}

.submission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 24px;
}

.submission-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.submission-card {
  background: var(--hover-bg);
  border-radius: 12px;
  padding: 24px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.submission-card.is-latest {
  background: var(--primary-bg-light);
  border-color: #67c23a;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.15);
}

.submission-summary {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 20px;
}

.summary-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attempt-badge {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-time,
.time-spent {
  font-size: 14px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.score-display {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.score-value {
  font-size: 48px;
  font-weight: 700;
  color: #f56c6c;
  line-height: 1;
}

.score-value.passed {
  color: #67c23a;
}

.score-total {
  font-size: 24px;
  color: #909399;
  font-weight: 500;
}

.question-results {
  margin-top: 20px;
}

.question-result-item {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border-left: 4px solid var(--card-border);
  transition: all 0.3s ease;
}

.question-result-item.is-correct {
  border-left-color: #67c23a;
  background: var(--success-bg-light);
}

.question-result-item.is-wrong {
  border-left-color: #f56c6c;
  background: var(--danger-bg-light);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.question-num {
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 60px;
}

.question-title {
  flex: 1;
  color: var(--text-primary);
  font-size: 15px;
}

.question-score {
  font-weight: 600;
  color: var(--text-secondary);
  margin-left: auto;
}

.result-answers {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 72px;
}

.answer-row {
  display: flex;
  gap: 12px;
  line-height: 1.6;
}

.answer-label {
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 80px;
  flex-shrink: 0;
}

.answer-value {
  flex: 1;
  color: var(--text-primary);
}

.answer-value.user-answer {
  color: #409eff;
}

.answer-value.correct-answer {
  color: #67c23a;
  font-weight: 500;
}

.no-answers-tip {
  margin-top: 20px;
}

.retake-info {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .submission-summary {
    flex-direction: column;
  }

  .summary-right {
    align-items: flex-start;
  }

  .result-answers {
    padding-left: 0;
  }

  .answer-row {
    flex-direction: column;
    gap: 4px;
  }
}
</style>

