<script lang="ts" setup>
import { computed } from 'vue';
import { useBudgetStore } from '../store';

const budgetStore = useBudgetStore();

const balance = computed(
  () => budgetStore.totalIncoming - budgetStore.totalSpending,
);
const loading = computed(() => !budgetStore.summary);
</script>

<template>
  <q-card class="row summary-card">
    <div class="col">
      <div class="item">
        <div class="title">Balance</div>
        <div class="value">¥{{ balance }}</div>
      </div>
    </div>
    <div class="col">
      <div class="item">
        <div class="title">Income</div>
        <div class="value">¥{{ budgetStore.summary?.income || 0 }}</div>
      </div>
    </div>
    <div class="col">
      <div class="item">
        <div class="title">Spending</div>
        <div class="value">¥{{ budgetStore.summary?.spending || 0 }}</div>
      </div>
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<style lang="scss" scoped>
@import '../common.scss';

.summary-card {
  padding: 1rem 0;
  margin: 0 1rem;
  overflow: auto;
}
.item {
  padding: 0 1rem;
  text-align: center;
  min-width: 90px;
  .title {
    color: $grayText;
    font-size: 16px;
  }
  .value {
    font-size: 12px;
  }
}
</style>
