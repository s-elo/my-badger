<script lang="ts" setup>
import { ref } from 'vue';
import BudgetForm from '../components/BudgetForm.vue';
import { useBudgetStore } from '../store';
import { BudgetItem } from '../type';
import { AxiosError } from 'axios';

const budgetStore = useBudgetStore();

const show = ref(false);
const adding = ref(false);
const errorMsg = ref('');

const addBudget = async (budget: BudgetItem) => {
  adding.value = true;
  try {
    await budgetStore.addBudget(budget);
    show.value = false;
  } catch (e) {
    errorMsg.value =
      (e as AxiosError<{ message: string }>).response?.data?.message || 'Error';
  } finally {
    adding.value = false;
  }
};
</script>

<template>
  <div class="add-budget">
    <w-button class="px4" @click="show = true"> + </w-button>
    <BudgetForm
      :show="show"
      :adding="adding"
      @cancel="show = false"
      @confirm="addBudget"
    />
    <w-notification
      v-model="errorMsg"
      :timeout="1000"
      error
      plain
      round
      shadow
      top
      center
      absolute
    >
      {{ errorMsg }}.
    </w-notification>
  </div>
</template>

<style lang="scss" scoped>
.add-budget {
  margin-top: 1rem;
}
</style>
