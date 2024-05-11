<script lang="ts" setup>
import { computed } from 'vue';
import { useBudgetStore } from '../store';

const budgetStore = useBudgetStore();

const balance = computed(
  () => budgetStore.totalIncoming - budgetStore.totalSpending,
);
</script>

<template>
  <div class="summary-data">
    <div class="total-data">balance: {{ balance }}</div>
    <div class="total-income">income: {{ budgetStore.totalIncoming }}</div>
    <div class="total-spending">spending: {{ budgetStore.totalSpending }}</div>
  </div>
</template>

<style lang="scss" scoped>
.summary-data {
  width: 100%;
  height: 30px;
  display: flex;
  [class^='total'] {
    margin-right: 1rem;
  }
}
</style>
