<script lang="ts" setup>
import { ref } from 'vue';
import BudgetForm from '../components/BudgetForm.vue';
import { useBudgetStore } from '../store';
import { BudgetItem } from '../type';
import { AxiosError } from 'axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const budgetStore = useBudgetStore();

const show = ref(false);
const adding = ref(false);

const addBudget = async (budget: BudgetItem) => {
  adding.value = true;
  try {
    await budgetStore.addBudget(budget);
    $q.notify({
      message: 'woo, new budget!',
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
    adding.value = false;
  }
};
</script>

<template>
  <div class="add-budget">
    <q-btn
      class="add-btn"
      round
      color="primary"
      icon="savings"
      @click="show = true"
    />
    <BudgetForm
      :show="show"
      :loading="adding"
      :mode="'Add'"
      @cancel="show = false"
      @confirm="addBudget"
    />
  </div>
</template>

<style lang="scss" scoped>
.add-budget {
  margin-top: 1rem;
  .add-btn {
    position: fixed;
    z-index: 1000;
    bottom: 24px;
    right: 8px;
  }
}
</style>
