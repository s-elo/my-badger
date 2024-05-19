<script lang="ts" setup>
import { ref } from 'vue';
import BudgetForm from './BudgetForm.vue';
import { BudgetItem } from '../type';
import { useQuasar } from 'quasar';
import { AxiosError } from 'axios';

const $q = useQuasar();

defineProps<{
  budget: BudgetItem;
}>();

const show = ref(false);
const editing = ref(false);

const editBudget = async (budget: BudgetItem) => {
  editing.value = true;
  try {
    console.log(budget);
    $q.notify({
      message: 'woo, budget is edited!',
      type: 'positive',
    });
  } catch (e) {
    $q.notify({
      message:
        (e as AxiosError<{ message: string }>).response?.data?.message ||
        (e as Error).message,
      type: 'negative',
    });
  } finally {
    editing.value = false;
  }
};
</script>

<template>
  <div class="budget-item" @click="show = true">
    <el-tag class="type">{{ budget.type }}</el-tag>
    <div class="price">{{ budget.price }}</div>
    <div class="desc">{{ budget.desc }}</div>
    <div class="date">{{ budget.created.split(' ')[0] }}</div>
    <BudgetForm
      :show="show"
      :budget="budget"
      :mode="'Edit'"
      :loading="editing"
      @cancel="show = false"
      @confirm="editBudget"
    />
  </div>
</template>

<style lang="scss" scoped>
.budget-item {
  border-bottom: 1px solid #e6e6e6;
}
</style>
