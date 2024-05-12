import { BudgetItem } from '../type';
import {
  base64ToStr,
  getCurrentRecordTitle,
  issuesToBudgets,
  strToBase64,
  stringifyBudget,
} from '../utils';
import {
  checkIssue,
  createIssue,
  getIssues,
  searchIssues,
  updateIssue,
} from './issue';
import { createOrUpdateRepoContent, getRepoContent } from './repo-content';

export async function searchBudgets({
  content = '',
  labels = [],
}: SearchBudgetParams) {
  const issues = await searchIssues({ content, labels });
  return issuesToBudgets(issues.items);
}

export async function getBudgets(params?: GetBudgetParams) {
  const issues = await getIssues(params);
  return issuesToBudgets(issues);
}

export async function addBudget(budget: BudgetItem) {
  const curIssueTitle = getCurrentRecordTitle();

  const issueExisted = await checkIssue(curIssueTitle);
  if (issueExisted) {
    budget.issueId = issueExisted.number;
    await updateIssue(issueExisted.number, {
      body: `${stringifyBudget(budget)}\n${issueExisted.body}`,
    });
  } else {
    const issue = await createIssue({
      title: curIssueTitle,
      body: stringifyBudget(budget),
    });
    budget.issueId = issue.number;
  }

  return budget;
}

export async function getSummary() {
  const { content } = await getRepoContent('summary.json');
  const decodedContent = base64ToStr(content);
  return JSON.parse(decodedContent) as Summary;
}

export async function updateSummary(sum: Summary) {
  console.log(sum, JSON.stringify(sum));
  const encodedSum = strToBase64(JSON.stringify(sum));
  console.log(encodedSum);
  return createOrUpdateRepoContent(
    'summary.json',
    encodedSum,
    'update summary',
  );
}

export type Summary = {
  income: number;
  spending: number;
  tags: Record<string, Omit<Summary, 'tags' | 'incrementalId'>>;
  incrementalId: number; // for budget item record
};

export type GetBudgetParams = {
  pageIndex?: number;
  pageSize?: number;
};

export type SearchBudgetParams = {
  content?: string;
  labels?: string[];
  date?: number;
};
