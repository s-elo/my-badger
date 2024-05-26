import { defineStore } from 'pinia';
import {
  Summary,
  addBudget,
  deleteBudget,
  getBudgets,
  getSummary,
  updateSummary,
} from '../api';
import { BudgetItem } from '../type';
import { formatDate, sortByCreateDate, syncSummary } from '../utils';
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
      allFetched: false,
    },
  }),
  getters: {
    totalIncoming: (state) => state.summary?.income || 0,
    totalSpending: (state) => state.summary?.spending || 0,
    allTags: (state) => state.summary?.tags || {},
    budgetList: (state) => state.budgets.data,
    budgetsByDate: (state) => {
      const groupByDate: { date: string; budgets: BudgetItem[] }[] = [];

      const dateRecord = state.budgets.data.reduce<
        Record<string, BudgetItem[]>
      >((ret, item) => {
        const date = item.created.split(' ')[0];
        ret[date] = ret[date] || [];
        ret[date].push(item);
        return ret;
      }, {});

      Object.keys(dateRecord).forEach((date) => {
        groupByDate.push({
          date,
          budgets: dateRecord[date],
        });
      });

      return groupByDate;
    },
  },
  actions: {
    async getSummary() {
      const { sum, sha } = await getSummary();
      this.summary = sum;
      this.summarySha = sha;
    },
    async setSummary(sum: Summary) {
      this.summary = sum;
      const {
        content: { sha },
      } = await updateSummary(toRaw(sum), this.summarySha);
      this.summarySha = sha;
    },
    async fetchBudgets() {
      if (this.budgets.allFetched) return;

      try {
        this.budgets.pageIdx += 1;
        const budgets = await getBudgets({
          pageIndex: this.budgets.pageIdx,
          pageSize: this.budgets.pageSize,
        });
        if (budgets.length) {
          this.budgets.data.push(...budgets);
        } else {
          this.budgets.allFetched = true;
        }
      } catch (e) {
        this.budgets.pageIdx -= 1;
        throw e;
      }
    },
    async addBudget(budget: BudgetItem) {
      if (!this.summary) return;

      this.summary.incrementalId = this.summary.incrementalId || 0;
      console.log(budget.desc);
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
      this.budgets.data = this.budgets.data.sort(sortByCreateDate);

      this.summary.incrementalId += 1;
      this.summary = syncSummary(
        Number(budget.price),
        this.summary,
        budget.tags,
        budget.type,
      );

      await this.setSummary(this.summary);
    },
    /** delete the original one and add the edited one directly with the same budget id */
    async editBudget(budget: BudgetItem, originalBudget: BudgetItem) {
      if (!this.summary) return;

      const processedBudget = {
        ...budget,
        price: Number(budget.price),
        desc: (budget.desc || 'no').replaceAll(
          LINE_SPLITTER,
          DESC_LINE_SPLITTER,
        ),
        created: formatDate(budget.created),
      };

      const addedBudget = await addBudget(processedBudget, budget.created);

      /** if in current month, no need to delete, since has been removed by duplicated id at addBudget step */
      const isCurrentMonth =
        new Date(budget.created).getMonth() === new Date(Date.now()).getMonth();
      if (!isCurrentMonth) {
        await deleteBudget(budget);
      }

      const budgetIdx = this.budgets.data.findIndex(
        (item) => item.id === budget.id,
      );
      this.budgets.data.splice(budgetIdx, 1, addedBudget);
      this.budgets.data = this.budgets.data.sort(sortByCreateDate);

      // delete sync
      this.summary = syncSummary(
        -Number(originalBudget.price),
        this.summary,
        originalBudget.tags,
        originalBudget.type,
      );
      // add sync
      this.summary = syncSummary(
        Number(budget.price),
        this.summary,
        budget.tags,
        budget.type,
      );

      await this.setSummary(this.summary);
    },
    async deleteBudget(budget: BudgetItem) {
      if (!this.summary) return;

      await deleteBudget(budget);
      const idx = this.budgetList.findIndex((item) => item.id === budget.id);
      this.budgets.data.splice(idx, 1);

      this.summary = syncSummary(
        -Number(budget.price),
        this.summary,
        budget.tags,
        budget.type,
      );

      await this.setSummary(this.summary);
    },
  },
});
