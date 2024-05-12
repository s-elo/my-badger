<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { AxiosError } from 'axios';
import { useBudgetStore } from '../store';
import BudgetItem from './BudgetItem.vue';

const budgetStore = useBudgetStore();

const loading = ref(true);

onMounted(async () => {
  try {
    await budgetStore.fetchBudgets();
  } catch (e) {
    ElMessage({
      message:
        (e as AxiosError<{ message: string }>).response?.data?.message ||
        (e as Error).message,
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-loading="loading" class="budget-list">
    <BudgetItem
      v-for="budget in budgetStore.budgetList"
      :key="budget.id"
      :budget="budget"
    />
    <el-empty
      v-if="!loading && !budgetStore.budgetList.length"
      class="no-data"
      image="https://api.oneneko.com/v1/bing_today"
      description="Start Your Budget Now!"
    />
  </div>
</template>

<style lang="scss" scoped>
.budget-list {
  width: 100%;
  flex: 1;
  margin-top: 1rem;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .no-data {
    color: #c9c4c4;
    align-self: center;
  }
  .loading {
    align-self: center;
  }
}
</style>
