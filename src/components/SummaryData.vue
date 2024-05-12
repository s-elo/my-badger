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
  <el-row>
    <el-col :span="8">
      <el-statistic v-loading="loading" title="Balance" :value="balance" />
    </el-col>
    <el-col :span="8">
      <el-statistic
        v-loading="loading"
        title="Income"
        :value="budgetStore.totalIncoming"
      />
    </el-col>
    <el-col :span="8">
      <el-statistic
        v-loading="loading"
        title="Spending"
        :value="budgetStore.totalSpending"
      />
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.el-col {
  text-align: center;
}
</style>
