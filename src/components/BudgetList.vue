<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { AxiosError } from 'axios';
import { useBudgetStore } from '../store';
import BudgetItem from './BudgetItem.vue';

const budgetStore = useBudgetStore();

const loading = ref(true);
const errorMsg = ref('');

onMounted(async () => {
  try {
    await budgetStore.fetchBudgets();
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
    <BudgetItem
      v-for="budget in budgetStore.budgetList"
      :key="budget.id"
      :budget="budget"
    />
    <w-progress v-if="loading" circle class="loading"></w-progress>
    <div v-if="errorMsg">{{ errorMsg }}</div>
    <div v-if="!loading && !budgetStore.budgetList.length" class="no-data">
      Start Your Budget Now!
    </div>
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
