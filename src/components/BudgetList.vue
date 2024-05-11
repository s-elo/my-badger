<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getBudgets } from '../api';
import { BudgetItem } from '../type';
import { AxiosError } from 'axios';

const budgetsList = ref<BudgetItem[]>([]);
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
      <div class="price">{{ budget.price }}</div>
      <div class="desc">{{ budget.desc }}</div>
      <div class="date">{{ budget.created }}</div>
    </div>
    <w-progress v-if="loading" circle :model-value="undefined"></w-progress>
    <div v-if="errorMsg">{{ errorMsg }}</div>
  </div>
</template>

<style lang="scss" scoped>
.budget-list {
  width: 100%;
  flex: 1;
  margin-top: 1rem;
  .budget-item {
    border-bottom: 1px solid #e6e6e6;
  }
}
</style>
