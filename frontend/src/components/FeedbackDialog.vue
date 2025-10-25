<template>
  <el-dialog
    v-model="dialogVisible"
    title="意见反馈"
    width="600px"
    :before-close="handleClose"
    class="feedback-dialog"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="top"
    >
      <el-form-item label="反馈类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择反馈类型" style="width: 100%">
          <el-option
            v-for="type in feedbackTypes"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          >
            <span style="display: flex; align-items: center; gap: 8px">
              <i :class="type.icon"></i>
              {{ type.label }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
          <el-option
            v-for="cat in categories"
            :key="cat"
            :label="cat"
            :value="cat"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="标题" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请简要描述您的反馈"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="详细描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="6"
          placeholder="请详细描述您的问题或建议，我们会认真对待每一条反馈"
          maxlength="5000"
          show-word-limit
        />
      </el-form-item>

      <el-form-item v-if="form.type === 'bug'" label="满意度">
        <el-rate v-model="form.rating" :colors="['#F7BA2A', '#F7BA2A', '#F7BA2A']" />
      </el-form-item>

      <el-form-item label="截图（可选）">
        <div class="screenshot-upload">
          <el-upload
            v-model:file-list="fileList"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="3"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">
            <i class="fa-solid fa-info-circle"></i>
            最多上传3张截图，有助于我们更好地理解问题
          </div>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          提交反馈
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';

interface Props {
  modelValue: boolean;
}

interface FeedbackForm {
  type: string;
  category: string;
  title: string;
  description: string;
  rating?: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', form: FeedbackForm): void;
}>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const formRef = ref<FormInstance>();
const submitting = ref(false);
const fileList = ref([]);

const form = reactive<FeedbackForm>({
  type: '',
  category: '',
  title: '',
  description: '',
  rating: undefined,
});

const feedbackTypes = [
  { value: 'bug', label: 'Bug反馈', icon: 'fa-solid fa-bug' },
  { value: 'feature', label: '功能建议', icon: 'fa-solid fa-lightbulb' },
  { value: 'improvement', label: '改进建议', icon: 'fa-solid fa-wand-magic-sparkles' },
  { value: 'other', label: '其他', icon: 'fa-solid fa-comment' },
];

const categories = [
  '学习功能',
  'AI助教',
  '知识图谱',
  '测验系统',
  '错题本',
  '成就系统',
  '用户界面',
  '性能问题',
  '其他',
];

const rules: FormRules = {
  type: [{ required: true, message: '请选择反馈类型', trigger: 'change' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 5, max: 200, message: '标题长度应在5-200个字符之间', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '请输入详细描述', trigger: 'blur' },
    { min: 10, max: 5000, message: '描述长度应在10-5000个字符之间', trigger: 'blur' },
  ],
};

const handleClose = () => {
  dialogVisible.value = false;
  resetForm();
};

const resetForm = () => {
  formRef.value?.resetFields();
  form.type = '';
  form.category = '';
  form.title = '';
  form.description = '';
  form.rating = undefined;
  fileList.value = [];
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    submitting.value = true;

    // 收集设备信息
    const deviceInfo = {
      platform: navigator.platform,
      browser: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    };

    // 提交反馈
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        ...form,
        url: window.location.href,
        deviceInfo,
      }),
    });

    if (!response.ok) {
      throw new Error('提交失败');
    }

    ElMessage.success('感谢您的反馈！我们会认真对待您的建议');
    emit('submit', form);
    handleClose();
  } catch (error: any) {
    console.error('提交反馈失败:', error);
    ElMessage.error(error.message || '提交反馈失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.feedback-dialog :deep(.el-dialog__body) {
  padding: 20px 24px;
}

.screenshot-upload {
  width: 100%;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 移动端优化 */
@media (max-width: 767px) {
  .feedback-dialog {
    width: 95% !important;
  }
}
</style>


