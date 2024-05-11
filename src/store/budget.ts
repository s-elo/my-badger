import { defineStore } from 'pinia';
import { Summary, getSummary, updateSummary } from '../api';

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    summary: null as Summary | null,
  }),
  getters: {
    totalIncoming: (state) => state.summary?.income || 0,
    totalSpending: (state) => state.summary?.spending || 0,
    allTags: (state) => state.summary?.tags || {},
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
  },
});
