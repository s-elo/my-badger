import { defineStore } from 'pinia';
import {
  Summary,
  addBudget,
  getBudgets,
  getSummary,
  updateSummary,
} from '../api';
import { BudgetItem } from '../type';
import { syncSummary } from '../utils';
import { toRaw } from 'vue';

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    summary: null as Summary | null,
    budgets: {
      data: [] as BudgetItem[],
      pageIdx: 0,
      pageSize: 10,
    },
  }),
  getters: {
    totalIncoming: (state) => state.summary?.income || 0,
    totalSpending: (state) => state.summary?.spending || 0,
    allTags: (state) => state.summary?.tags || {},
    budgetList: (state) => state.budgets.data,
  },
  actions: {
    setSummary(sum: Summary) {
      this.summary = sum;
    },
    async getSummary() {
      const sum = await getSummary();
      this.summary = sum;
    },
    async syncSummary(sum: Summary) {
      this.summary = sum;
      return updateSummary(sum);
    },
    async fetchBudgets() {
      try {
        this.budgets.pageIdx += 1;
        const budgets = await getBudgets({
          pageIndex: this.budgets.pageIdx,
          pageSize: this.budgets.pageSize,
        });
        this.budgets.data.push(...budgets);
      } catch (e) {
        this.budgets.pageIdx -= 1;
        throw e;
      }
    },
    async addBudget(budget: BudgetItem) {
      if (!this.summary) return;

      this.summary.incrementalId = this.summary.incrementalId || 0;

      const processedBudget = {
        ...budget,
        id: this.summary.incrementalId + 1,
        price: Number(budget.price),
      };
      const addedBudget = await addBudget(processedBudget);

      this.budgets.data.unshift(addedBudget);

      this.summary.incrementalId += 1;
      this.summary = syncSummary(
        processedBudget.price,
        this.summary,
        processedBudget.tags,
        budget.type,
      );

      await updateSummary(toRaw(this.summary));
    },
  },
});
