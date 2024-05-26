<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { AxiosError } from 'axios';
import { useBudgetStore } from '../store';
import BudgetItem from './BudgetItem.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const budgetStore = useBudgetStore();

const loading = ref(true);

const onLoad = async (_: number, done: () => void) => {
  await budgetStore.fetchBudgets();
  done();
};

onMounted(async () => {
  try {
    await budgetStore.fetchBudgets();
  } catch (e) {
    $q.notify({
      message:
        (e as AxiosError<{ message: string }>).response?.data?.message ||
        (e as Error).message,
      type: 'negative',
    });
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="budget-list">
    <q-infinite-scroll @load="onLoad">
      <q-card
        v-for="dateBudgets in budgetStore.budgetsByDate"
        :key="dateBudgets.date"
        class="budget-group-card"
      >
        <BudgetItem
          v-for="budget in dateBudgets.budgets"
          :key="budget.id"
          :budget="budget"
        />
      </q-card>
      <template #loading>
        <div class="row justify-center q-my-md">
          <q-spinner-gears color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <div
      v-if="!loading && !budgetStore.budgetList.length"
      class="no-data"
      description="Start Your Budget Now!"
    >
      Start Your Budget Now!
    </div>
  </div>
</template>

<style lang="scss" scoped>
.budget-list {
  width: 100%;
  flex: 1;
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
  .budget-group-card {
    padding: 1rem;
    margin: 1rem;
  }
}
</style>
