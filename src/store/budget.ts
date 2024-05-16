import { defineStore } from 'pinia';
import {
  Summary,
  addBudget,
  getBudgets,
  getSummary,
  updateSummary,
} from '../api';
import { BudgetItem } from '../type';
import { formatDate, syncSummary } from '../utils';
import { toRaw } from 'vue';
import { DESC_LINE_SPLITTER, LINE_SPLITTER } from '../constant';

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    summary: null as Summary | null,
    summarySha: '',
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
    async getSummary() {
      const { sum, sha } = await getSummary();
      this.summary = sum;
      this.summarySha = sha;
    },
    async setSummary(sum: Summary) {
      this.summary = sum;
      const { sha } = await updateSummary(toRaw(sum), this.summarySha);
      this.summarySha = sha;
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
        desc: (budget.desc || 'no').replaceAll(
          LINE_SPLITTER,
          DESC_LINE_SPLITTER,
        ),
        created: formatDate(budget.created),
      };
      const addedBudget = await addBudget(processedBudget);

      this.budgets.data.unshift(addedBudget);
      this.budgets.data = this.budgets.data.sort((a, b) =>
        new Date(b.created).getTime() - new Date(a.created).getTime() < 0
          ? 1
          : -1,
      );

      this.summary.incrementalId += 1;
      this.summary = syncSummary(
        processedBudget.price,
        this.summary,
        processedBudget.tags,
        budget.type,
      );

      await this.setSummary(this.summary);
    },
  },
});
