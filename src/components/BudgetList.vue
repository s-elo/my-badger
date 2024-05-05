<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { IssueItem, getBudgets } from '../api';
import { AxiosError } from 'axios';

const budgetsList = ref<IssueItem[]>([]);
const loading = ref(true);
const errorMsg = ref('');

onMounted(async () => {
  try {
    const budgets = await getBudgets();
    budgetsList.value = budgets;
  } catch (e) {
    errorMsg.value =
      (e as AxiosError<{ message: string }>).response?.data?.message || 'Error';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="budget-list">
    <div v-for="budget in budgetsList" :key="budget.id" class="budget-item">
      {{ budget.title }}
    </div>
    <w-progress v-if="loading" circle :model-value="undefined"></w-progress>
    <div v-if="errorMsg">{{ errorMsg }}</div>
  </div>
</template>

<style lang="scss" scoped>
.budget-list {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
