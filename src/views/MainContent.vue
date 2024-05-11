<script lang="ts" setup>
import BudgetList from '../components/BudgetList.vue';
import SummaryData from '../components/SummaryData.vue';
import AddBudget from '../views/AddBudget.vue';
</script>

<template>
  <div class="main-content">
    <SummaryData />
    <hr />
    <AddBudget />
    <BudgetList />
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
