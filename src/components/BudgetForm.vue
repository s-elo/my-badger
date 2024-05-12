<script lang="ts" setup>
import { computed, ref, reactive } from 'vue';
import { BudgetItem, BudgetType } from '../type';
import type { FormInstance, FormRules } from 'element-plus';
import { useBudgetStore } from '../store';

const budgetStore = useBudgetStore();
const props = defineProps<{
  budget?: BudgetItem;
  show: boolean;
  loading?: boolean;
}>();

const emits = defineEmits(['cancel', 'confirm']);

const budgetFormRef = ref<FormInstance>();
const formData = ref({
  price: String(props.budget?.price || ''),
  tags: props.budget?.tags || [],
  desc: props.budget?.desc || '',
  type: props.budget?.type || BudgetType.spending,
  created: props.budget?.created || Date.now(),
});

const rules = reactive<FormRules<typeof formData>>({
  price: [
    {
      required: true,
      validator: (_, value: string) =>
        !!value && /^[\d\.\+\-\*\/]+$/.test(value),
      trigger: 'change',
      message: 'Invalid Expression.',
    },
  ],
  tags: [{ required: true, trigger: 'change', message: 'At least one tag.' }],
  created: [{ required: true, trigger: 'change', message: 'No Day?.' }],
});

const tagOptions = computed(() => Object.keys({ ...budgetStore.allTags }));
const calculatedPrice = computed(() => {
  if (/[\+\*\-\/]/.test(formData.value.price)) {
    try {
      return eval(formData.value.price);
    } catch {
      return formData.value.price || 0;
    }
  }

  return formData.value.price || 0;
});

const confirm = (formEl?: FormInstance) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (!valid) return;

    if (calculatedPrice.value) {
      formData.value.price = calculatedPrice.value;
    }

    emits('confirm', { ...(props.budget || {}), ...formData.value });
  });
};
</script>

<template>
  <el-dialog
    :model-value="show"
    title="How are you today"
    class="budget-form-modal"
    :show-close="false"
    width="80%"
  >
    <el-form
      ref="budgetFormRef"
      :model="formData"
      :rules="rules"
      label-position="top"
      label-width="auto"
      class="budget-form"
    >
      <el-form-item label="Type" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio :value="BudgetType.spending">spending</el-radio>
          <el-radio :value="BudgetType.income">income</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Value" prop="price">
        <el-input
          v-model="formData.price"
          placeholder="Can be an expression~"
          clearable
        >
          <template #prepend>{{ calculatedPrice }}</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Tags" prop="tags">
        <el-select
          v-model="formData.tags"
          multiple
          filterable
          clearable
          allow-create
          default-first-option
          :reserve-keyword="false"
          placeholder="Choose tags for this budget"
        >
          <el-option
            v-for="tag in tagOptions"
            :key="tag"
            :label="tag"
            :value="tag"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Date" prop="created">
        <el-date-picker
          v-model="formData.created"
          type="date"
          placeholder="When?"
        />
      </el-form-item>
      <el-form-item label="Note" prop="desc">
        <el-input
          v-model="formData.desc"
          placeholder="Any notes?"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="spacer" />
      <el-button outline @click="$emit('cancel')"> cancel </el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="confirm(budgetFormRef)"
      >
        confirm
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
