<script lang="ts" setup>
import { ref } from 'vue';
import BudgetForm from '../components/BudgetForm.vue';
import { useBudgetStore } from '../store';
import { BudgetItem } from '../type';
import { AxiosError } from 'axios';

const budgetStore = useBudgetStore();

const show = ref(false);
const adding = ref(false);

const addBudget = async (budget: BudgetItem) => {
  adding.value = true;
  try {
    console.log(budget);
    await budgetStore.addBudget(budget);
    ElMessage({
      message: 'woo, new budget!',
      type: 'success',
    });
  } catch (e) {
    ElMessage({
      message:
        (e as AxiosError<{ message: string }>).response?.data?.message ||
        (e as Error).message,
      type: 'error',
    });
  } finally {
    adding.value = false;
  }
};
</script>

<template>
  <div class="add-budget">
    <el-button type="primary" class="add-btn" @click="show = true">
      One More!
    </el-button>
    <BudgetForm
      :show="show"
      :loading="adding"
      @cancel="show = false"
      @confirm="addBudget"
    />
  </div>
</template>

<style lang="scss" scoped>
.add-budget {
  margin-top: 1rem;
  .add-btn {
    width: 100%;
  }
}
</style>
