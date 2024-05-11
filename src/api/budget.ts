import { BudgetItem } from '../type';
import { base64ToStr, parseBudgets, strToBase64 } from '../utils';
import { getIssues, searchIssues } from './issue';
import { createOrUpdateRepoContent, getRepoContent } from './repo-content';

export async function searchBudgets({
  content = '',
  labels = [],
}: SearchBudgetParams) {
  return searchIssues({ content, labels });
}

export async function getBudgets(params: GetBudgetParams = { page: 1 }) {
  const issues = await getIssues(params);
  return issues.reduce<BudgetItem[]>((budgets, issue) => {
    budgets.push(...parseBudgets(issue.body));
    return budgets;
  }, []);
}

export async function getSummary() {
  const { content } = await getRepoContent('summary.json');
  const decodedContent = base64ToStr(content);
  return JSON.parse(decodedContent) as Summary;
}

export async function updateSummary(sum: Summary) {
  const encodedSum = strToBase64(JSON.stringify(sum));
  return createOrUpdateRepoContent(
    'summary.json',
    encodedSum,
    'update summary',
  );
}

export type Summary = {
  income: number;
  spending: number;
  tags: Record<string, Omit<Summary, 'tags'>>;
  incrementalId: number; // for budget item record
};

export type GetBudgetParams = {
  page?: number;
};

export type SearchBudgetParams = {
  content?: string;
  labels?: string[];
  date?: number;
};
