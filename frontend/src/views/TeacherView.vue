<template>
  <div class="teacher-view">
    <el-tabs v-model="activeTab" class="teacher-tabs">
      <!-- 班级管理 -->
      <el-tab-pane label="班级管理" name="classes">
        <div class="tab-content">
          <div class="header-actions">
            <h2>我的班级</h2>
            <el-button type="primary" @click="showCreateClassDialog">
              <el-icon><Plus /></el-icon>
              创建班级
            </el-button>
          </div>

          <!-- 统计卡片 -->
          <el-row :gutter="20" class="stats-cards" v-if="classes.length > 0">
            <el-col :xs="24" :sm="12" :md="6">
              <div class="stat-card stat-primary">
                <div class="stat-icon">
                  <i class="fa-solid fa-chalkboard"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-label">班级总数</div>
                  <div class="stat-value">{{ classes.length }}</div>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="stat-card stat-success">
                <div class="stat-icon">
                  <i class="fa-solid fa-users"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-label">学生总数</div>
                  <div class="stat-value">{{ totalStudents }}</div>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="stat-card stat-warning">
                <div class="stat-icon">
                  <i class="fa-solid fa-clipboard-list"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-label">作业总数</div>
                  <div class="stat-value">{{ assignments.length }}</div>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="stat-card stat-info">
                <div class="stat-icon">
                  <i class="fa-solid fa-clock"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-label">本周活跃</div>
                  <div class="stat-value">{{ activeStudentsThisWeek }}</div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" v-if="classes.length > 0">
            <el-col :xs="24" :sm="12" :lg="8" v-for="cls in classes" :key="cls._id">
              <el-card class="class-card" shadow="hover" @click="viewClassDetail(cls)">
                <template #header>
                  <div class="card-header">
                    <span class="class-name">{{ cls.name }}</span>
                    <el-tag :type="cls.status === 'active' ? 'success' : 'info'">
                      {{ cls.status === 'active' ? '活跃' : '已归档' }}
                    </el-tag>
                  </div>
                </template>
                <div class="class-info">
                  <p v-if="cls.description" class="description">{{ cls.description }}</p>
                  <div class="meta">
                    <div class="meta-item">
                      <el-icon><User /></el-icon>
                      <span>{{ cls.students.filter((s: any) => s.status === 'active').length }} 名学生</span>
                    </div>
                    <div class="meta-item" v-if="cls.subject">
                      <el-icon><Reading /></el-icon>
                      <span>{{ cls.subject }}</span>
                    </div>
                  </div>
                  <div class="invite-code">
                    <span>邀请码：</span>
                    <el-tag>{{ cls.inviteCode }}</el-tag>
                    <el-button link @click.stop="copyInviteCode(cls.inviteCode)">
                      <el-icon><CopyDocument /></el-icon>
                    </el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <el-empty v-else description="还没有创建班级" />
        </div>
      </el-tab-pane>

      <!-- 作业管理 -->
      <el-tab-pane label="作业管理" name="assignments">
        <div class="tab-content">
          <div class="header-actions">
            <h2>作业列表</h2>
            <el-button type="primary" @click="showCreateAssignmentDialog" :disabled="classes.length === 0">
              <el-icon><DocumentAdd /></el-icon>
              创建作业
            </el-button>
          </div>

          <el-alert v-if="classes.length === 0" type="warning" :closable="false" style="margin-bottom: 20px;">
            请先创建班级才能布置作业
          </el-alert>

          <!-- 作业筛选 -->
          <div class="filter-section" v-if="assignments.length > 0">
            <el-select v-model="assignmentFilter.classId" placeholder="筛选班级" clearable style="width: 200px; margin-right: 12px;">
              <el-option label="全部班级" value="" />
              <el-option
                v-for="cls in classes"
                :key="cls._id"
                :label="cls.name"
                :value="cls._id"
              />
            </el-select>
            <el-select v-model="assignmentFilter.status" placeholder="筛选状态" clearable style="width: 150px;">
              <el-option label="全部状态" value="" />
              <el-option label="草稿" value="draft" />
              <el-option label="已发布" value="published" />
              <el-option label="已关闭" value="closed" />
            </el-select>
          </div>

          <el-table :data="filteredAssignments" v-loading="loading" class="assignment-table">
            <el-table-column prop="title" label="作业标题" min-width="200">
              <template #default="{ row }">
                <div class="assignment-title-cell">
                  <i class="fa-solid fa-file-alt"></i>
                  <span>{{ row.title }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="classId" label="班级" width="150">
              <template #default="{ row }">
                {{ getClassName(row.classId) }}
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <el-tag :type="getAssignmentTypeColor(row.type)">
                  {{ getAssignmentTypeName(row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="dueDate" label="截止时间" width="180">
              <template #default="{ row }">
                <div :class="{ 'due-soon': isDueSoon(row.dueDate) }">
                {{ row.dueDate ? formatDate(row.dueDate) : '无限制' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusColor(row.status)">
                  {{ getStatusName(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="提交情况" width="160">
              <template #default="{ row }">
                <div class="submission-progress">
                  <span>{{ getUniqueSubmissionCount(row) }} / {{ getClassStudentCount(row.classId) }}</span>
                  <el-progress 
                    :percentage="getSubmissionPercentage(row)" 
                    :stroke-width="6"
                    :show-text="false"
                    :color="getProgressColor(getSubmissionPercentage(row))"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300" fixed="right">
              <template #default="{ row }">
                <el-button link @click="viewSubmissions(row)">
                  <i class="fa-solid fa-eye"></i> 查看提交
                </el-button>
                <el-button link @click="viewAssignmentStats(row)">
                  <i class="fa-solid fa-chart-bar"></i> 统计
                </el-button>
                <el-button link @click="editAssignment(row)">编辑</el-button>
                <el-button link type="primary" v-if="row.status === 'draft'" @click="publishAssignment(row)">
                  发布
                </el-button>
                <el-button link type="danger" @click="deleteAssignment(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 学生监控 -->
      <el-tab-pane label="学生监控" name="students">
        <div class="tab-content">
          <div class="header-actions">
            <h2>学生学习情况</h2>
            <el-select v-model="selectedClassId" placeholder="选择班级" style="width: 200px;">
              <el-option
                v-for="cls in classes"
                :key="cls._id"
                :label="cls.name"
                :value="cls._id"
              />
            </el-select>
          </div>

          <div v-if="selectedClassId">
            <!-- 学生统计卡片 -->
            <el-row :gutter="20" class="student-stats-cards" v-if="studentStats.length > 0">
              <el-col :xs="24" :sm="12" :md="6">
                <div class="mini-stat-card">
                  <div class="mini-stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <i class="fa-solid fa-user-graduate"></i>
                  </div>
                  <div class="mini-stat-info">
                    <div class="mini-stat-label">学生总数</div>
                    <div class="mini-stat-value">{{ studentStats.length }}</div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <div class="mini-stat-card">
                  <div class="mini-stat-icon" style="background: linear-gradient(135deg, #48c774 0%, #00b894 100%);">
                    <i class="fa-solid fa-fire"></i>
                  </div>
                  <div class="mini-stat-info">
                    <div class="mini-stat-label">平均分</div>
                    <div class="mini-stat-value">{{ calculateAverageScore() }}</div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <div class="mini-stat-card">
                  <div class="mini-stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <i class="fa-solid fa-clock"></i>
                  </div>
                  <div class="mini-stat-info">
                    <div class="mini-stat-label">总学习时长</div>
                    <div class="mini-stat-value">{{ calculateTotalHours() }}h</div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <div class="mini-stat-card">
                  <div class="mini-stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    <i class="fa-solid fa-check-circle"></i>
                  </div>
                  <div class="mini-stat-info">
                    <div class="mini-stat-label">知识点掌握</div>
                    <div class="mini-stat-value">{{ calculateKnowledgeMastery() }}%</div>
                  </div>
                </div>
              </el-col>
            </el-row>

            <!-- 学生列表 -->
            <el-table :data="studentStats" v-loading="loading" class="student-table">
              <el-table-column type="expand">
                <template #default="{ row }">
                  <div class="student-detail">
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <div class="detail-section">
                          <h4>学习统计</h4>
                          <div class="detail-item">
                            <span class="label">累计学习：</span>
                            <span class="value">{{ formatDuration(row.totalTime) }}</span>
                          </div>
                          <div class="detail-item">
                            <span class="label">学习次数：</span>
                            <span class="value">{{ row.sessionCount }} 次</span>
                          </div>
                          <div class="detail-item">
                            <span class="label">知识点总数：</span>
                            <span class="value">{{ row.totalKnowledge }} 个</span>
                          </div>
                          <div class="detail-item">
                            <span class="label">已掌握：</span>
                            <span class="value">{{ row.masteredCount }} 个</span>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="detail-section">
                          <h4>作业情况</h4>
                          <div class="detail-item">
                            <span class="label">完成率：</span>
                            <span class="value">{{ row.assignmentCompletionRate || 0 }}%</span>
                          </div>
                          <div class="detail-item">
                            <span class="label">平均分：</span>
                            <span class="value">{{ row.avgScore || 0 }} 分</span>
                          </div>
                          <div class="detail-item">
                            <span class="label">最后活跃：</span>
                            <span class="value">{{ formatDate(row.lastActive) }}</span>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="userName" label="学生姓名" width="150" fixed>
                <template #default="{ row }">
                  <div class="student-name-cell">
                    <el-avatar :size="32" :src="row.avatar" style="margin-right: 8px;">
                      {{ row.userName?.charAt(0) }}
                    </el-avatar>
                    <span>{{ row.userName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="sessionCount" label="学习次数" width="120" sortable />
              <el-table-column prop="totalTime" label="学习时长" width="120" sortable>
              <template #default="{ row }">
                {{ formatDuration(row.totalTime) }}
              </template>
            </el-table-column>
              <el-table-column prop="totalKnowledge" label="知识点" width="100" sortable />
              <el-table-column prop="masteredCount" label="已掌握" width="100" sortable />
              <el-table-column label="掌握率" width="120">
              <template #default="{ row }">
                <el-progress
                    :percentage="calculateMasteryRate(row)"
                    :color="getScoreColor(calculateMasteryRate(row))"
                    :stroke-width="8"
                />
              </template>
            </el-table-column>
              <el-table-column prop="avgScore" label="平均分" width="120" sortable>
                <template #default="{ row }">
                  <el-tag :type="getScoreTagType(row.avgScore)">
                    {{ row.avgScore || 0 }} 分
                  </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="lastActive" label="最后活跃" width="180">
              <template #default="{ row }">
                  <span :class="{ 'text-muted': !isRecentlyActive(row.lastActive) }">
                {{ formatDate(row.lastActive) }}
                  </span>
              </template>
            </el-table-column>
          </el-table>
          </div>

          <el-empty v-else description="请选择班级查看学生情况" />
        </div>
      </el-tab-pane>

      <!-- 题库管理 -->
      <el-tab-pane label="题库管理" name="question-bank">
        <div class="tab-content">
          <QuestionBank />
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 创建班级对话框 -->
    <el-dialog v-model="createClassDialogVisible" title="创建班级" width="500px">
      <el-form :model="classForm" label-width="100px">
        <el-form-item label="班级名称" required>
          <el-input v-model="classForm.name" placeholder="例如：高一(1)班" />
        </el-form-item>
        <el-form-item label="班级描述">
          <el-input v-model="classForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="科目">
          <el-input v-model="classForm.subject" placeholder="例如：数学" />
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="classForm.grade" placeholder="例如：高一" />
        </el-form-item>
        <el-form-item label="学期">
          <el-input v-model="classForm.semester" placeholder="例如：2024春季" />
        </el-form-item>
        <el-form-item label="最大人数">
          <el-input-number v-model="classForm.maxStudents" :min="1" :max="200" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createClassDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createClass" :loading="submitting">创建</el-button>
      </template>
    </el-dialog>

    <!-- 创建/编辑作业对话框 -->
    <el-dialog 
      v-model="createAssignmentDialogVisible" 
      :title="editingAssignmentId ? '编辑作业' : '创建作业'" 
      width="600px"
      @close="handleDialogClose"
    >
      <el-form :model="assignmentForm" label-width="100px">
        <el-form-item label="作业标题" required>
          <el-input v-model="assignmentForm.title" placeholder="输入作业标题" />
        </el-form-item>
        <el-form-item label="选择班级" required>
          <el-select v-model="assignmentForm.classId" placeholder="选择班级" style="width: 100%;">
            <el-option
              v-for="cls in classes"
              :key="cls._id"
              :label="cls.name"
              :value="cls._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="作业描述">
          <el-input v-model="assignmentForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="作业类型">
          <el-select v-model="assignmentForm.type" style="width: 100%;">
            <el-option label="练习" value="practice" />
            <el-option label="测验" value="quiz" />
            <el-option label="作业" value="homework" />
            <el-option label="考试" value="exam" />
          </el-select>
        </el-form-item>
        <el-form-item label="难度">
          <el-select v-model="assignmentForm.difficulty" placeholder="选择难度" style="width: 100%;">
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-date-picker
            v-model="assignmentForm.dueDate"
            type="datetime"
            placeholder="选择截止时间"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="总分">
          <el-input-number v-model="assignmentForm.totalScore" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item label="及格分">
          <el-input-number v-model="assignmentForm.passingScore" :min="0" :max="assignmentForm.totalScore" />
        </el-form-item>
        <el-form-item label="题目">
          <div class="question-selector">
            <el-button type="primary" @click="showQuestionSelector">
              <i class="fa-solid fa-plus"></i> 添加题目
            </el-button>
            <div v-if="assignmentForm.questions.length > 0" class="selected-questions">
              <div class="question-count">
                已选 {{ assignmentForm.questions.length }} 道题目
              </div>
              <el-button link @click="showSelectedQuestions">
                查看题目列表
              </el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createAssignmentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAssignment" :loading="submitting">
          {{ editingAssignmentId ? '保存' : '创建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 题目选择对话框 -->
    <el-dialog
      v-model="questionSelectorDialogVisible"
      title="选择题目"
      width="90%"
      destroy-on-close
      :z-index="2500"
      append-to-body
    >
      <QuestionBank
        selection-mode
        :selected-questions="assignmentForm.questions"
        @select="handleQuestionsSelected"
      />
      <template #footer>
        <el-button @click="questionSelectorDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 已选题目列表对话框 -->
    <el-dialog
      v-model="selectedQuestionsDialogVisible"
      title="已选题目"
      width="800px"
    >
      <div class="selected-questions-list">
        <div
          v-for="(item, index) in assignmentForm.questions"
          :key="item.questionId || item._id"
          class="selected-question-item"
        >
          <div class="question-info">
            <span class="question-number">{{ index + 1 }}.</span>
            <span class="question-title">{{ item.title }}</span>
            <el-tag :type="getQuestionTypeTag(item.type)" size="small">
              {{ getQuestionTypeLabel(item.type) }}
            </el-tag>
          </div>
          <div class="question-score">
            <el-input-number
              v-model="item.score"
              :min="1"
              :max="100"
              size="small"
            />
            <span style="margin-left: 8px;">分</span>
          </div>
          <el-button
            type="danger"
            size="small"
            text
            @click="removeQuestion(index)"
          >
            删除
          </el-button>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="selectedQuestionsDialogVisible = false">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 查看作业提交对话框 -->
    <el-dialog
      v-model="submissionsDialogVisible"
      :title="submissionsData ? `${submissionsData.title} - 提交记录` : '提交记录'"
      width="90%"
      destroy-on-close
    >
      <div v-loading="loadingSubmissions" class="submissions-container">
        <div v-if="submissionsData" class="submissions-content">
          <!-- 统计概览 -->
          <div class="submissions-stats">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="6">
                <div class="mini-stat-card stat-primary">
                  <div class="stat-icon">
                    <i class="fa-solid fa-users"></i>
  </div>
                  <div class="stat-content">
                    <div class="stat-label">总学生数</div>
                    <div class="stat-value">{{ submissionsData.totalStudents }}</div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <div class="mini-stat-card stat-success">
                  <div class="stat-icon">
                    <i class="fa-solid fa-check"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">已提交</div>
                    <div class="stat-value">
                      {{ submissionsData.submittedCount }}
                      <span class="stat-badge">{{ submissionsData.submissionRate.toFixed(1) }}%</span>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <div class="mini-stat-card stat-info">
                  <div class="stat-icon">
                    <i class="fa-solid fa-star"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">平均分</div>
                    <div class="stat-value">{{ submissionsData.avgScore }}</div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <div class="mini-stat-card stat-warning">
                  <div class="stat-icon">
                    <i class="fa-solid fa-chart-line"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">及格率</div>
                    <div class="stat-value">{{ submissionsData.passRate.toFixed(1) }}%</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- 分数分布图表 -->
          <div class="score-distribution">
            <h3><i class="fa-solid fa-chart-bar"></i> 分数分布</h3>
            <el-row :gutter="16">
              <el-col :xs="12" :sm="6">
                <div class="distribution-item excellent">
                  <div class="distribution-label">优秀 (≥90)</div>
                  <div class="distribution-value">{{ submissionsData.scoreRanges.excellent }}</div>
                  <div class="distribution-bar">
                    <div 
                      class="distribution-fill" 
                      :style="{ width: getPercentage(submissionsData.scoreRanges.excellent, submissionsData.submittedCount) + '%' }"
                    ></div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="6">
                <div class="distribution-item good">
                  <div class="distribution-label">良好 (80-89)</div>
                  <div class="distribution-value">{{ submissionsData.scoreRanges.good }}</div>
                  <div class="distribution-bar">
                    <div 
                      class="distribution-fill" 
                      :style="{ width: getPercentage(submissionsData.scoreRanges.good, submissionsData.submittedCount) + '%' }"
                    ></div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="6">
                <div class="distribution-item pass">
                  <div class="distribution-label">及格 (60-79)</div>
                  <div class="distribution-value">{{ submissionsData.scoreRanges.pass }}</div>
                  <div class="distribution-bar">
                    <div 
                      class="distribution-fill" 
                      :style="{ width: getPercentage(submissionsData.scoreRanges.pass, submissionsData.submittedCount) + '%' }"
                    ></div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="6">
                <div class="distribution-item fail">
                  <div class="distribution-label">不及格 (<60)</div>
                  <div class="distribution-value">{{ submissionsData.scoreRanges.fail }}</div>
                  <div class="distribution-bar">
                    <div 
                      class="distribution-fill" 
                      :style="{ width: getPercentage(submissionsData.scoreRanges.fail, submissionsData.submittedCount) + '%' }"
                    ></div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- 提交记录列表 -->
          <div class="submissions-list">
            <h3><i class="fa-solid fa-list"></i> 提交记录</h3>
            <el-table 
              :data="submissionsData.submissions" 
              stripe
              :default-sort="{ prop: 'submittedAt', order: 'descending' }"
            >
              <el-table-column prop="userName" label="学生姓名" width="150" sortable />
              <el-table-column label="提交时间" width="180" sortable prop="submittedAt">
                <template #default="{ row }">
                  {{ formatDateTime(row.submittedAt) }}
                </template>
              </el-table-column>
              <el-table-column label="分数" width="120" sortable prop="score">
                <template #default="{ row }">
                  <el-tag :type="getScoreTagType(row.score)">
                    {{ row.score }} 分
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="用时" width="120" sortable prop="timeSpent">
                <template #default="{ row }">
                  {{ formatTimeSpent(row.timeSpent) }}
                </template>
              </el-table-column>
              <el-table-column label="尝试次数" width="120" align="center" sortable prop="attempt">
                <template #default="{ row }">
                  第 {{ row.attempt }} 次
                </template>
              </el-table-column>
              <el-table-column label="状态" width="120">
                <template #default="{ row }">
                  <el-tag :type="getSubmissionStatusTag(row.status).type">
                    {{ getSubmissionStatusTag(row.status).text }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" size="small" @click="viewSubmissionDetail(row)">
                    <i class="fa-solid fa-file-lines"></i> 查看详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 未提交学生提示 -->
            <div v-if="submissionsData.notSubmittedCount > 0" class="not-submitted-notice">
              <el-alert
                :title="`还有 ${submissionsData.notSubmittedCount} 名学生未提交作业`"
                type="warning"
                :closable="false"
                show-icon
              />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="submissionsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 查看提交详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="提交详情"
      width="90%"
      top="5vh"
      :close-on-click-modal="false"
    >
      <div v-loading="loadingDetail" class="submission-detail-container">
        <div v-if="submissionDetail" class="detail-content">
          <!-- 学生信息卡片 -->
          <el-card class="student-info-card" shadow="hover">
            <div class="info-grid">
              <div class="info-item">
                <i class="fa-solid fa-user"></i>
                <div class="info-text">
                  <span class="info-label">学生姓名</span>
                  <span class="info-value">{{ submissionDetail.studentName }}</span>
                </div>
              </div>
              <div class="info-item">
                <i class="fa-solid fa-clock"></i>
                <div class="info-text">
                  <span class="info-label">提交时间</span>
                  <span class="info-value">{{ formatDateTime(submissionDetail.submittedAt) }}</span>
                </div>
              </div>
              <div class="info-item">
                <i class="fa-solid fa-hourglass-half"></i>
                <div class="info-text">
                  <span class="info-label">用时</span>
                  <span class="info-value">{{ formatTimeSpent(submissionDetail.timeSpent) }}</span>
                </div>
              </div>
              <div class="info-item">
                <i class="fa-solid fa-star"></i>
                <div class="info-text">
                  <span class="info-label">得分</span>
                  <span class="info-value score-highlight">{{ submissionDetail.score || '未批改' }}</span>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 答题记录 -->
          <div class="questions-section">
            <h3 class="section-title">
              <i class="fa-solid fa-list-check"></i> 答题详情
            </h3>
            
            <div 
              v-for="(question, index) in submissionDetail.questions" 
              :key="index"
              class="question-card"
              :class="{ 'correct': isAnswerCorrect(question), 'incorrect': !isAnswerCorrect(question) }"
            >
              <div class="question-header">
                <span class="question-number">第 {{ index + 1 }} 题</span>
                <el-tag :type="getQuestionTypeLabel(question.type) === '单选题' ? '' : 'info'" size="small">
                  {{ getQuestionTypeLabel(question.type) }}
                </el-tag>
                <el-tag 
                  :type="isAnswerCorrect(question) ? 'success' : 'danger'" 
                  size="small"
                >
                  {{ isAnswerCorrect(question) ? '✓ 正确' : '✗ 错误' }}
                </el-tag>
              </div>
              
              <div class="question-content">
                <div class="question-text">
                  <strong>题目：</strong>{{ question.content }}
                </div>
                
                <!-- 选项 (单选/多选/判断题) -->
                <div v-if="['single', 'multiple', 'judge'].includes(question.type)" class="question-options">
                  <div 
                    v-for="(option, optIndex) in question.options" 
                    :key="optIndex"
                    class="option-item"
                    :class="{
                      'student-selected': isOptionSelected(question.studentAnswer, option.key),
                      'correct-option': isOptionCorrect(question.correctAnswer, option.key),
                      'wrong-option': isOptionSelected(question.studentAnswer, option.key) && !isOptionCorrect(question.correctAnswer, option.key)
                    }"
                  >
                    <span class="option-key">{{ option.key }}.</span>
                    <span class="option-text">{{ option.text }}</span>
                    <i v-if="isOptionCorrect(question.correctAnswer, option.key)" class="fa-solid fa-check correct-icon"></i>
                  </div>
                </div>
                
                <!-- 答案对比 -->
                <div class="answer-comparison">
                  <div class="answer-row student-answer-row">
                    <span class="answer-label">
                      <i class="fa-solid fa-user"></i> 学生答案：
                    </span>
                    <span class="answer-value">{{ formatAnswer(question.studentAnswer) }}</span>
                  </div>
                  <div class="answer-row correct-answer-row">
                    <span class="answer-label">
                      <i class="fa-solid fa-circle-check"></i> 正确答案：
                    </span>
                    <span class="answer-value">{{ formatAnswer(question.correctAnswer) }}</span>
                  </div>
                </div>
                
                <!-- 解析 -->
                <div v-if="question.explanation" class="question-explanation">
                  <strong><i class="fa-solid fa-lightbulb"></i> 解析：</strong>
                  <span>{{ question.explanation }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 批改区域 -->
          <el-card class="grading-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <i class="fa-solid fa-pen-to-square"></i> 批改作业
              </div>
            </template>
            <el-form :model="gradingForm" label-width="80px">
              <el-form-item label="分数">
                <el-input-number 
                  v-model="gradingForm.score" 
                  :min="0" 
                  :max="100"
                  :step="1"
                  style="width: 200px;"
                />
                <span class="score-hint">/ 100分</span>
              </el-form-item>
              <el-form-item label="评语">
                <el-input
                  v-model="gradingForm.feedback"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入对学生的评语和建议..."
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="grading" @click="submitGrading">
          <i class="fa-solid fa-check"></i> 提交批改
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, User, Reading, CopyDocument, DocumentAdd } from '@element-plus/icons-vue';
import axios from 'axios';
import QuestionBank from '@/components/QuestionBank.vue';
import { apiService as importedApiService } from '@/services/apiService';

const apiService = axios.create({
  baseURL: '/api'
});

// 添加请求拦截器，动态获取 token
apiService.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const activeTab = ref('classes');
const loading = ref(false);
const submitting = ref(false);

// 班级相关
const classes = ref<any[]>([]);
const createClassDialogVisible = ref(false);
const classForm = ref({
  name: '',
  description: '',
  subject: '',
  grade: '',
  semester: '',
  maxStudents: 50
});

// 统计数据
const totalStudents = computed(() => {
  return classes.value.reduce((sum, cls) => {
    return sum + cls.students.filter((s: any) => s.status === 'active').length;
  }, 0);
});

const activeStudentsThisWeek = ref(0);

// 加载本周活跃学生数
async function loadActiveStudents() {
  try {
    const response = await apiService.get('/stats/active-students-this-week');
    activeStudentsThisWeek.value = response.data.count;
  } catch (error) {
    console.error('加载活跃学生数失败:', error);
  }
}

// 作业相关
const assignments = ref<any[]>([]);
const createAssignmentDialogVisible = ref(false);
const editingAssignmentId = ref<string | null>(null);
const questionSelectorDialogVisible = ref(false);
const selectedQuestionsDialogVisible = ref(false);
const assignmentForm = ref({
  title: '',
  classId: '',
  description: '',
  type: 'homework',
  difficulty: 'medium',
  dueDate: null as Date | null,
  totalScore: 100,
  passingScore: 60,
  questions: [] as any[]
});

// 作业筛选
const assignmentFilter = ref({
  classId: '',
  status: ''
});

// 筛选后的作业列表
const filteredAssignments = computed(() => {
  let result = assignments.value;
  
  if (assignmentFilter.value.classId) {
    result = result.filter(a => a.classId === assignmentFilter.value.classId);
  }
  
  if (assignmentFilter.value.status) {
    result = result.filter(a => a.status === assignmentFilter.value.status);
  }
  
  return result;
});

// 学生监控
const selectedClassId = ref('');
const studentStats = ref<any[]>([]);

onMounted(() => {
  loadClasses();
  loadActiveStudents();
});

watch(activeTab, (newTab) => {
  if (newTab === 'assignments') {
    loadAssignments();
  } else if (newTab === 'students' && selectedClassId.value) {
    loadStudentStats();
  }
});

watch(selectedClassId, () => {
  if (selectedClassId.value) {
    loadStudentStats();
  }
});

// 加载班级列表
async function loadClasses() {
  try {
    loading.value = true;
    const response = await apiService.get('/class/my');
    classes.value = response.data;
  } catch (error) {
    console.error('加载班级失败:', error);
    ElMessage.error('加载班级失败');
  } finally {
    loading.value = false;
  }
}

// 创建班级
function showCreateClassDialog() {
  classForm.value = {
    name: '',
    description: '',
    subject: '',
    grade: '',
    semester: '',
    maxStudents: 50
  };
  createClassDialogVisible.value = true;
}

async function createClass() {
  if (!classForm.value.name) {
    ElMessage.warning('请输入班级名称');
    return;
  }

  try {
    submitting.value = true;
    await apiService.post('/class', {
      ...classForm.value,
      settings: {
        maxStudents: classForm.value.maxStudents
      }
    });
    ElMessage.success('班级创建成功');
    createClassDialogVisible.value = false;
    loadClasses();
  } catch (error: any) {
    console.error('创建班级失败:', error);
    ElMessage.error(error.response?.data?.error || '创建班级失败');
  } finally {
    submitting.value = false;
  }
}

// 查看班级详情
function viewClassDetail(cls: any) {
  // TODO: 跳转到班级详情页
  console.log('查看班级详情:', cls);
}

// 复制邀请码
function copyInviteCode(code: string) {
  navigator.clipboard.writeText(code);
  ElMessage.success('邀请码已复制');
}

// 加载作业列表
async function loadAssignments() {
  if (classes.value.length === 0) return;

  try {
    loading.value = true;
    // 加载所有班级的作业
    const promises = classes.value.map(cls =>
      apiService.get(`/assignment/class/${cls._id}`)
    );
    const results = await Promise.all(promises);
    assignments.value = results.flatMap(r => r.data);
  } catch (error) {
    console.error('加载作业失败:', error);
    ElMessage.error('加载作业失败');
  } finally {
    loading.value = false;
  }
}

// 创建作业
function showCreateAssignmentDialog() {
  editingAssignmentId.value = null;
  assignmentForm.value = {
    title: '',
    classId: classes.value[0]?._id || '',
    description: '',
    type: 'homework',
    difficulty: 'medium',
    dueDate: null,
    totalScore: 100,
    passingScore: 60,
    questions: []
  };
  createAssignmentDialogVisible.value = true;
}

// 保存作业（创建或更新）
async function saveAssignment() {
  if (!assignmentForm.value.title || !assignmentForm.value.classId) {
    ElMessage.warning('请填写必填项');
    return;
  }

  try {
    submitting.value = true;
    if (editingAssignmentId.value) {
      // 更新作业
      await apiService.put(`/assignment/${editingAssignmentId.value}`, assignmentForm.value);
      ElMessage.success('作业更新成功');
    } else {
      // 创建作业
      await apiService.post('/assignment', assignmentForm.value);
      ElMessage.success('作业创建成功');
    }
    createAssignmentDialogVisible.value = false;
    loadAssignments();
  } catch (error: any) {
    console.error('保存作业失败:', error);
    ElMessage.error(error.response?.data?.error || '保存作业失败');
  } finally {
    submitting.value = false;
  }
}

// 对话框关闭时重置编辑状态
function handleDialogClose() {
  editingAssignmentId.value = null;
  assignmentForm.value.questions = [];
}

// 显示题目选择器
function showQuestionSelector() {
  questionSelectorDialogVisible.value = true;
}

// 处理题目选择
function handleQuestionsSelected(questions: any[]) {
  // 保留分数设置（如果已经设置过）
  const scoreMap = new Map(
    assignmentForm.value.questions.map(q => [q._id || q.questionId, q.score])
  );

  assignmentForm.value.questions = questions.map(q => ({
    questionId: q._id,
    _id: q._id,
    title: q.title,
    type: q.type,
    score: scoreMap.get(q._id) || 10 // 默认10分
  }));
}

// 显示已选题目列表
function showSelectedQuestions() {
  selectedQuestionsDialogVisible.value = true;
}

// 移除题目
function removeQuestion(index: number) {
  assignmentForm.value.questions.splice(index, 1);
}

// 题型标签相关
function getQuestionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    single: '单选题',
    multiple: '多选题',
    truefalse: '判断题',
    short: '简答题',
    essay: '论述题'
  };
  return labels[type] || type;
}

function getQuestionTypeTag(type: string): string {
  const types: Record<string, string> = {
    single: 'primary',
    multiple: 'success',
    truefalse: 'warning',
    short: 'info',
    essay: 'danger'
  };
  return types[type] || '';
}

// 发布作业
async function publishAssignment(assignment: any) {
  try {
    await ElMessageBox.confirm('确定要发布这个作业吗？发布后学生将可以看到并提交。', '确认发布', {
      type: 'warning'
    });

    await apiService.post(`/assignment/${assignment._id}/publish`);
    ElMessage.success('作业已发布');
    loadAssignments();
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('发布作业失败:', error);
      ElMessage.error(error.response?.data?.error || '发布作业失败');
    }
  }
}

// 查看作业统计
async function viewAssignmentStats(assignment: any) {
  try {
    const response = await apiService.get(`/assignment/${assignment._id}/submissions/stats`);
    const stats = response.data;

    ElMessageBox.alert(
      `<div style="text-align: left;">
        <p><strong>总学生数：</strong>${stats.totalStudents}</p>
        <p><strong>已提交：</strong>${stats.submittedCount} (${stats.submissionRate.toFixed(1)}%)</p>
        <p><strong>平均分：</strong>${stats.avgScore}</p>
        <p><strong>及格率：</strong>${stats.passRate.toFixed(1)}%</p>
        <p><strong>分数分布：</strong></p>
        <ul>
          <li>优秀(90+)：${stats.scoreRanges.excellent}人</li>
          <li>良好(80-89)：${stats.scoreRanges.good}人</li>
          <li>及格(60-79)：${stats.scoreRanges.pass}人</li>
          <li>不及格(<60)：${stats.scoreRanges.fail}人</li>
        </ul>
      </div>`,
      `${assignment.title} - 提交统计`,
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '关闭'
      }
    );
  } catch (error) {
    console.error('获取统计失败:', error);
    ElMessage.error('获取统计失败');
  }
}

// 编辑作业
function editAssignment(assignment: any) {
  assignmentForm.value = {
    title: assignment.title,
    classId: assignment.classId,
    description: assignment.description || '',
    type: assignment.type,
    difficulty: assignment.difficulty || 'medium',
    dueDate: assignment.dueDate ? new Date(assignment.dueDate) : null,
    totalScore: assignment.totalScore || 100,
    passingScore: assignment.passingScore || 60,
    questions: assignment.questions || []
  };
  editingAssignmentId.value = assignment._id;
  createAssignmentDialogVisible.value = true;
}

// 删除作业
async function deleteAssignment(assignment: any) {
  try {
    await ElMessageBox.confirm(
      `确定要删除作业"${assignment.title}"吗？此操作不可恢复！`,
      '删除确认',
      {
        type: 'warning',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'el-button--danger'
      }
    );

    const response = await apiService.delete(`/assignment/${assignment._id}`);
    // 根据后端返回的消息显示提示
    ElMessage.success(response.data.message || '操作成功');
    loadAssignments();
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除作业失败:', error);
      ElMessage.error(error.response?.data?.error || '删除作业失败');
    }
  }
}

// 加载学生统计
async function loadStudentStats() {
  if (!selectedClassId.value) return;

  try {
    loading.value = true;
    const response = await apiService.get(`/class/${selectedClassId.value}/students/stats`);
    studentStats.value = response.data.students;
  } catch (error) {
    console.error('加载学生统计失败:', error);
    ElMessage.error('加载学生统计失败');
  } finally {
    loading.value = false;
  }
}

// 工具函数
function getClassName(classId: string) {
  const cls = classes.value.find(c => c._id === classId);
  return cls?.name || '未知班级';
}

function getAssignmentTypeName(type: string) {
  const map: any = {
    practice: '练习',
    quiz: '测验',
    homework: '作业',
    exam: '考试'
  };
  return map[type] || type;
}

function getAssignmentTypeColor(type: string) {
  const map: any = {
    practice: 'info',
    quiz: 'warning',
    homework: 'success',
    exam: 'danger'
  };
  return map[type] || 'info';
}

function getStatusName(status: string) {
  const map: any = {
    draft: '草稿',
    published: '已发布',
    closed: '已关闭',
    archived: '已归档'
  };
  return map[status] || status;
}

function getStatusColor(status: string) {
  const map: any = {
    draft: 'info',
    published: 'success',
    closed: 'warning',
    archived: 'info'
  };
  return map[status] || 'info';
}

function formatDate(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleString('zh-CN');
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}小时${minutes}分钟`;
}

function getScoreColor(score: number) {
  if (score >= 90) return '#67c23a';
  if (score >= 80) return '#409eff';
  if (score >= 60) return '#e6a23c';
  return '#f56c6c';
}

// 作业管理辅助函数
function getClassStudentCount(classId: string) {
  const cls = classes.value.find(c => c._id === classId);
  return cls?.students.filter((s: any) => s.status === 'active').length || 0;
}

// 获取提交作业的唯一学生数量
function getUniqueSubmissionCount(assignment: any) {
  if (!assignment.submissions || assignment.submissions.length === 0) return 0;
  const uniqueUserIds = new Set(assignment.submissions.map((s: any) => s.userId));
  return uniqueUserIds.size;
}

function getSubmissionPercentage(assignment: any) {
  const studentCount = getClassStudentCount(assignment.classId);
  if (studentCount === 0) return 0;
  const submissionCount = getUniqueSubmissionCount(assignment);
  return Math.round((submissionCount / studentCount) * 100);
}

function getProgressColor(percentage: number) {
  if (percentage >= 80) return '#67c23a';
  if (percentage >= 50) return '#409eff';
  if (percentage >= 30) return '#e6a23c';
  return '#f56c6c';
}

function isDueSoon(dueDate: string | Date | null) {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  const daysDiff = diff / (1000 * 60 * 60 * 24);
  return daysDiff > 0 && daysDiff < 2; // 2天内到期
}

// 查看作业提交
const submissionsDialogVisible = ref(false);
const submissionsData = ref<any>(null);
const loadingSubmissions = ref(false);

async function viewSubmissions(assignment: any) {
  try {
    loadingSubmissions.value = true;
    submissionsDialogVisible.value = true;
    
    const token = localStorage.getItem('authToken');
    const data = await importedApiService.getAssignmentSubmissions(token!, assignment._id);
    submissionsData.value = data;
  } catch (error) {
    console.error('加载提交记录失败:', error);
    ElMessage.error('加载提交记录失败');
    submissionsDialogVisible.value = false;
  } finally {
    loadingSubmissions.value = false;
  }
}

function formatTimeSpent(seconds: number) {
  if (!seconds) return '0分钟';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }
  return `${minutes}分钟`;
}

function getSubmissionStatusTag(status: string) {
  const statusMap: Record<string, any> = {
    'graded': { type: 'success', text: '已批改' },
    'submitted': { type: 'info', text: '已提交' },
    'late': { type: 'warning', text: '迟交' }
  };
  return statusMap[status] || { type: 'info', text: '已提交' };
}

function getPercentage(count: number, total: number) {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}

function formatDateTime(date: string | Date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 查看提交详情
const detailDialogVisible = ref(false);
const submissionDetail = ref<any>(null);
const loadingDetail = ref(false);
const grading = ref(false);
const gradingForm = ref({
  score: 0,
  feedback: ''
});

async function viewSubmissionDetail(submission: any) {
  try {
    loadingDetail.value = true;
    detailDialogVisible.value = true;
    
    const token = localStorage.getItem('authToken');
    const data = await importedApiService.getSubmissionDetail(token!, submission._id);
    submissionDetail.value = data;
    
    // 初始化批改表单
    gradingForm.value = {
      score: data.score || 0,
      feedback: data.feedback || ''
    };
  } catch (error) {
    console.error('加载提交详情失败:', error);
    ElMessage.error('加载提交详情失败');
    detailDialogVisible.value = false;
  } finally {
    loadingDetail.value = false;
  }
}

function isAnswerCorrect(question: any) {
  if (!question.studentAnswer || !question.correctAnswer) return false;
  
  if (question.type === 'multiple') {
    // 多选题需要完全匹配
    const studentAns = Array.isArray(question.studentAnswer) 
      ? question.studentAnswer.sort() 
      : [question.studentAnswer];
    const correctAns = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.sort()
      : [question.correctAnswer];
    return JSON.stringify(studentAns) === JSON.stringify(correctAns);
  }
  
  return question.studentAnswer === question.correctAnswer;
}

async function submitGrading() {
  try {
    grading.value = true;
    const token = localStorage.getItem('authToken');
    
    await apiService.post(
      `/assignment/submission/${submissionDetail.value._id}/grade`,
      {
        score: gradingForm.value.score,
        feedback: gradingForm.value.feedback
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    ElMessage.success('批改成功');
    detailDialogVisible.value = false;
    
    // 刷新提交列表
    if (submissionsData.value) {
      const assignment = { _id: submissionDetail.value.assignmentId };
      await viewSubmissions(assignment);
    }
  } catch (error) {
    console.error('批改失败:', error);
    ElMessage.error('批改失败');
  } finally {
    grading.value = false;
  }
}

function isOptionSelected(studentAnswer: any, optionKey: string) {
  if (!studentAnswer) return false;
  if (Array.isArray(studentAnswer)) {
    return studentAnswer.includes(optionKey);
  }
  return studentAnswer === optionKey;
}

function isOptionCorrect(correctAnswer: any, optionKey: string) {
  if (!correctAnswer) return false;
  if (Array.isArray(correctAnswer)) {
    return correctAnswer.includes(optionKey);
  }
  return correctAnswer === optionKey;
}

function formatAnswer(answer: any) {
  if (!answer) return '未作答';
  if (Array.isArray(answer)) {
    return answer.join(', ');
  }
  return String(answer);
}

// 学生监控辅助函数
function calculateAverageScore() {
  if (studentStats.value.length === 0) return 0;
  const total = studentStats.value.reduce((sum, s) => sum + (s.avgScore || 0), 0);
  return Math.round(total / studentStats.value.length);
}

function calculateTotalHours() {
  if (studentStats.value.length === 0) return 0;
  const totalSeconds = studentStats.value.reduce((sum, s) => sum + (s.totalTime || 0), 0);
  return Math.round(totalSeconds / 3600);
}

function calculateKnowledgeMastery() {
  if (studentStats.value.length === 0) return 0;
  const totalKnowledge = studentStats.value.reduce((sum, s) => sum + (s.totalKnowledge || 0), 0);
  const totalMastered = studentStats.value.reduce((sum, s) => sum + (s.masteredCount || 0), 0);
  if (totalKnowledge === 0) return 0;
  return Math.round((totalMastered / totalKnowledge) * 100);
}

function calculateMasteryRate(student: any) {
  if (!student.totalKnowledge || student.totalKnowledge === 0) return 0;
  return Math.round((student.masteredCount / student.totalKnowledge) * 100);
}

function getScoreTagType(score: number) {
  if (score >= 90) return 'success';
  if (score >= 80) return '';
  if (score >= 60) return 'warning';
  return 'danger';
}

function isRecentlyActive(lastActive: string | Date) {
  if (!lastActive) return false;
  const last = new Date(lastActive);
  const now = new Date();
  const diff = now.getTime() - last.getTime();
  const daysDiff = diff / (1000 * 60 * 60 * 24);
  return daysDiff < 7; // 7天内活跃
}
</script>

<style scoped>
.teacher-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.teacher-tabs {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid var(--card-border);
}

.tab-content {
  padding: 24px 0;
  animation: fadeIn 0.5s ease;
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

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-actions h2::before {
  content: '';
  width: 4px;
  height: 24px;
  background: linear-gradient(180deg, var(--primary-color), #667eea);
  border-radius: 2px;
}

.header-actions .el-button {
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(var(--primary-color-rgb, 102, 126, 234), 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-actions .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--primary-color-rgb, 102, 126, 234), 0.4);
}

/* 统计卡片 */
.stats-cards {
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, var(--card-bg) 0%, var(--card-bg) 100%);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  margin-bottom: 20px;
  border: 1px solid var(--card-border);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.stat-primary .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-success .stat-icon {
  background: linear-gradient(135deg, #48c774 0%, #00b894 100%);
}

.stat-warning .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-info .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: var(--text-primary);
  line-height: 1;
}

/* 班级卡片 */
.class-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--card-border);
  background: var(--card-bg);
  animation: slideInUp 0.4s ease;
  animation-fill-mode: both;
}

.class-card:nth-child(1) { animation-delay: 0.1s; }
.class-card:nth-child(2) { animation-delay: 0.2s; }
.class-card:nth-child(3) { animation-delay: 0.3s; }
.class-card:nth-child(4) { animation-delay: 0.4s; }
.class-card:nth-child(5) { animation-delay: 0.5s; }
.class-card:nth-child(6) { animation-delay: 0.6s; }

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.class-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.class-name {
  font-size: 16px;
  font-weight: 600;
}

.class-info {
  padding: 10px 0;
}

.description {
  color: var(--text-secondary);
  margin-bottom: 15px;
  line-height: 1.6;
}

.meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-secondary);
  font-size: 14px;
}

.invite-code {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--card-border);
  font-size: 14px;
}

/* 作业管理样式 */
.filter-section {
  margin-bottom: 20px;
  padding: 16px;
  background: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--card-border);
}

.assignment-table {
  border-radius: 8px;
  overflow: hidden;
}

.assignment-title-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.assignment-title-cell i {
  color: var(--primary-color);
}

.due-soon {
  color: #f56c6c;
  font-weight: 600;
}

.submission-progress {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
}

/* 学生监控样式 */
.student-stats-cards {
  margin-bottom: 24px;
}

.mini-stat-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  margin-bottom: 16px;
  border: 1px solid var(--card-border);
}

.mini-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mini-stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
}

.mini-stat-info {
  flex: 1;
}

.mini-stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.mini-stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
  line-height: 1;
}

.student-table {
  border-radius: 8px;
  overflow: hidden;
}

.student-name-cell {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.student-detail {
  padding: 24px;
  background: var(--card-bg);
  border-radius: 8px;
  margin: 12px 0;
  border: 1px solid var(--card-border);
}

.detail-section {
  background: var(--card-bg);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--card-border);
}

.detail-section h4 {
  margin: 0 0 16px 0;
  color: var(--primary-color);
  font-size: 16px;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--card-border);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  color: var(--text-secondary);
  font-size: 14px;
}

.detail-item .value {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
}

.text-muted {
  color: var(--text-secondary) !important;
  opacity: 0.6;
}

/* 响应式 */
@media (max-width: 768px) {
  .teacher-view {
    padding: 10px;
  }

  .teacher-tabs {
    padding: 10px;
  }

  .header-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .stats-cards .stat-card {
    padding: 16px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .filter-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .filter-section .el-select {
    width: 100% !important;
  }
  
  .student-detail {
    padding: 16px;
  }
  
  .detail-section {
    padding: 12px;
  }
}

/* 深色主题优化 */
html:not(.light-theme) .teacher-tabs {
  backdrop-filter: blur(var(--backdrop-blur));
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

html:not(.light-theme) .stat-card,
html:not(.light-theme) .mini-stat-card {
  backdrop-filter: blur(var(--backdrop-blur));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

html:not(.light-theme) .class-card:hover {
  box-shadow: 0 12px 30px rgba(138, 127, 251, 0.3);
}

html:not(.light-theme) .detail-section {
  backdrop-filter: blur(8px);
}

/* 浅色主题优化 */
html.light-theme .teacher-tabs {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

html.light-theme .stat-card,
html.light-theme .mini-stat-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

html.light-theme .class-card:hover {
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.15);
}

/* Element Plus 组件全局主题适配 - Empty 组件 */
.teacher-tabs :deep(.el-empty) {
  background: transparent;
}

.teacher-tabs :deep(.el-empty__description p) {
  color: var(--text-secondary);
}

/* Element Plus 组件全局主题适配 - Table 组件 */
.teacher-tabs :deep(.el-table) {
  background: var(--card-bg);
  color: var(--text-primary);
}

.teacher-tabs :deep(.el-table th.el-table__cell) {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-bottom: 1px solid var(--card-border);
}

.teacher-tabs :deep(.el-table tr) {
  background: var(--card-bg);
}

.teacher-tabs :deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid var(--card-border);
  color: var(--text-primary);
}

.teacher-tabs :deep(.el-table__inner-wrapper::before),
.teacher-tabs :deep(.el-table__inner-wrapper::after) {
  background-color: var(--card-border);
}

.teacher-tabs :deep(.el-table__body tr:hover > td) {
  background: var(--bg-secondary) !important;
}

.teacher-tabs :deep(.el-table__expand-icon) {
  color: var(--text-primary);
}

.teacher-tabs :deep(.el-table__expanded-cell) {
  background: var(--bg-secondary);
}

/* Element Plus 组件全局主题适配 - Select 组件 */
.teacher-tabs :deep(.el-select .el-input__wrapper) {
  background: var(--card-bg);
  box-shadow: 0 0 0 1px var(--card-border) inset;
}

.teacher-tabs :deep(.el-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--primary-color) inset;
}

.teacher-tabs :deep(.el-select .el-input__inner) {
  color: var(--text-primary);
}

.teacher-tabs :deep(.el-select .el-input__suffix) {
  color: var(--text-secondary);
}

/* 题目选择器样式 */
.question-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selected-questions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.question-count {
  padding: 8px 16px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 4px;
  color: var(--primary-color);
  font-weight: 600;
}

.selected-questions-list {
  max-height: 500px;
  overflow-y: auto;
}

.selected-question-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin-bottom: 12px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.selected-question-item:hover {
  background: var(--card-bg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.question-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.question-number {
  font-weight: 600;
  color: var(--primary-color);
  min-width: 30px;
}

.question-title {
  font-size: 14px;
  color: var(--text-primary);
}

.question-score {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

/* 创建考试按钮增强样式 */
.create-exam-btn {
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.create-exam-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.create-exam-btn i {
  margin-right: 6px;
}

/* 添加题目按钮增强样式 - 改为蓝底白字 */
.question-selector .el-button--primary {
  font-size: 16px;
  font-weight: 600;
  padding: 12px 24px;
  height: auto;
}

.question-selector .el-button--primary i {
  margin-right: 6px;
}

/* 查看提交对话框样式 */
.submissions-container {
  min-height: 300px;
}

.submissions-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.submissions-stats {
  margin-bottom: 8px;
}

.submissions-stats .stat-badge {
  font-size: 14px;
  color: var(--text-secondary);
  margin-left: 8px;
  font-weight: normal;
}

/* 分数分布 */
.score-distribution {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 20px;
}

.score-distribution h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-distribution h3 i {
  color: var(--primary-color);
}

.distribution-item {
  padding: 16px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.distribution-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.distribution-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.distribution-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
}

.distribution-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.distribution-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.distribution-item.excellent .distribution-value {
  color: #10b981;
}

.distribution-item.excellent .distribution-fill {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.distribution-item.good .distribution-value {
  color: #3b82f6;
}

.distribution-item.good .distribution-fill {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.distribution-item.pass .distribution-value {
  color: #f59e0b;
}

.distribution-item.pass .distribution-fill {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.distribution-item.fail .distribution-value {
  color: #ef4444;
}

.distribution-item.fail .distribution-fill {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

/* 提交记录列表 */
.submissions-list {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 20px;
}

.submissions-list h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.submissions-list h3 i {
  color: var(--primary-color);
}

.not-submitted-notice {
  margin-top: 16px;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .submissions-stats .el-col {
    margin-bottom: 12px;
  }
  
  .score-distribution,
  .submissions-list {
    padding: 16px;
  }
  
  .distribution-item {
    margin-bottom: 12px;
  }
}

/* ==================== 提交详情样式 ==================== */
.submission-detail-container {
  min-height: 300px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 学生信息卡片 */
.student-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-item i {
  font-size: 24px;
  opacity: 0.9;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  opacity: 0.8;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
}

.score-highlight {
  font-size: 20px;
  color: #fbbf24;
}

/* 答题详情 */
.questions-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--card-border);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: var(--primary-color);
}

/* 题目卡片 */
.question-card {
  background: var(--card-bg);
  border: 2px solid var(--card-border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.question-card:last-child {
  margin-bottom: 0;
}

.question-card.correct {
  border-color: #10b981;
  background: linear-gradient(to right, rgba(16, 185, 129, 0.05), transparent);
}

.question-card.incorrect {
  border-color: #ef4444;
  background: linear-gradient(to right, rgba(239, 68, 68, 0.05), transparent);
}

.question-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.question-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--card-border);
}

.question-number {
  font-weight: 600;
  font-size: 16px;
  color: var(--primary-color);
}

.question-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-text {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-primary);
}

/* 选项 */
.question-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 12px 0;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid var(--card-border);
  background: var(--card-bg);
  transition: all 0.2s ease;
  position: relative;
}

.option-key {
  font-weight: 600;
  color: var(--text-primary);
  min-width: 24px;
}

.option-text {
  flex: 1;
  color: var(--text-secondary);
}

.option-item.student-selected {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

.option-item.correct-option {
  background: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
  font-weight: 500;
}

.option-item.correct-option .option-text {
  color: #10b981;
}

.option-item.wrong-option {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.option-item.wrong-option .option-text {
  color: #ef4444;
}

.correct-icon {
  color: #10b981;
  font-size: 16px;
  margin-left: auto;
}

/* 答案对比 */
.answer-comparison {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.answer-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 6px;
}

.student-answer-row {
  background: rgba(59, 130, 246, 0.1);
}

.correct-answer-row {
  background: rgba(16, 185, 129, 0.1);
}

.answer-label {
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 120px;
}

.student-answer-row .answer-label {
  color: #3b82f6;
}

.correct-answer-row .answer-label {
  color: #10b981;
}

.answer-value {
  font-size: 15px;
  color: var(--text-primary);
  font-weight: 500;
}

/* 解析 */
.question-explanation {
  background: rgba(251, 191, 36, 0.1);
  border-left: 3px solid #f59e0b;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.question-explanation strong {
  color: #f59e0b;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.question-explanation i {
  font-size: 16px;
}

/* 批改卡片 */
.grading-card {
  border: 2px solid var(--primary-color);
  background: var(--card-bg);
}

.grading-card .card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--primary-color);
  font-size: 16px;
}

.score-hint {
  margin-left: 12px;
  color: var(--text-secondary);
  font-size: 14px;
}

/* 响应式 - 详情对话框 */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .question-card {
    padding: 16px;
  }
  
  .answer-comparison {
    padding: 12px;
  }
  
  .answer-label {
    min-width: 100px;
    font-size: 13px;
  }
  
  .answer-value {
    font-size: 14px;
  }
}

/* Element Plus 卡片组件样式覆盖 */
:deep(.el-card) {
  background: var(--card-bg);
  border-color: var(--card-border);
  color: var(--text-primary);
}

:deep(.el-card__header) {
  background: transparent;
  border-color: var(--card-border);
  color: var(--text-primary);
}

:deep(.el-card__body) {
  color: var(--text-primary);
}
</style>

