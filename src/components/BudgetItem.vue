<script lang="ts" setup>
import { ref } from 'vue';
import BudgetForm from './BudgetForm.vue';
import { BudgetItem } from '../type';
import { useQuasar } from 'quasar';
import { AxiosError } from 'axios';
import { useBudgetStore } from '../store';

const $q = useQuasar();
const budgetStore = useBudgetStore();

const props = defineProps<{
  budget: BudgetItem;
}>();

const show = ref(false);
const editing = ref(false);

const editBudget = async (budget: BudgetItem, originalBudget: BudgetItem) => {
  editing.value = true;
  try {
    await budgetStore.editBudget(budget, originalBudget);
    $q.notify({
      message: 'woo, budget is edited!',
      type: 'positive',
    });
    show.value = false;
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

const deleteBudget = async () => {
  const confirm = await new Promise((res) =>
    $q
      .dialog({
        title: 'Warning',
        message: 'Would you like to delete this budget?',
        cancel: true,
        persistent: true,
      })
      .onOk(() => res(true))
      .onCancel(() => res(false)),
  );
  if (!confirm) return;

  $q.loading.show();
  try {
    await budgetStore.deleteBudget(props.budget);
    $q.notify({
      message: 'okk, budget is deleted!',
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
    $q.loading.hide();
  }
};
</script>

<template>
  <div class="budget-item">
    <q-chip size="xs" color="primary" text-color="white">
      {{ budget.type }}
    </q-chip>
    <q-icon name="delete" color="red" @click="deleteBudget" />
    <q-icon name="edit" color="primary" @click="show = true" />
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
