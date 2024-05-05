import { getIssues, searchIssues } from './issue';

export async function searchBudgets({
  content = '',
  labels = [],
}: SearchBudgetParams) {
  return searchIssues({ content, labels });
}

export async function getBudgets(params: GetBudgetParams = { page: 1 }) {
  return getIssues(params);
}

export type GetBudgetParams = {
  page?: number;
};

export type SearchBudgetParams = {
  content?: string;
  labels?: string[];
  date?: number;
};

export type IssueItem = {
  id: number;
  labels: string[];
  created_at: string;
  body: string;
  title: string;
};
