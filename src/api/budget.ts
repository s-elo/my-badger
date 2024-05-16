import { DESC_LINE_SPLITTER, LINE_SPLITTER } from '../constant';
import { BudgetItem } from '../type';
import {
  base64ToStr,
  formatDate,
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

  budget.updated = formatDate(Date.now());

  const issueExisted = await checkIssue(curIssueTitle);
  if (issueExisted) {
    budget.issueId = issueExisted.number;
    await updateIssue(issueExisted.number, {
      body: `${stringifyBudget(budget)}${LINE_SPLITTER}${issueExisted.body}`,
    });
  } else {
    const issue = await createIssue({
      title: curIssueTitle,
      body: stringifyBudget(budget),
    });
    budget.issueId = issue.number;
  }

  budget.desc = budget.desc.replaceAll(DESC_LINE_SPLITTER, LINE_SPLITTER);

  return budget;
}

export async function getSummary() {
  const { content, sha } = await getRepoContent('summary.json');
  const decodedContent = base64ToStr(content);
  return { sum: JSON.parse(decodedContent) as Summary, sha };
}

export async function updateSummary(sum: Summary, sha: string) {
  const encodedSum = strToBase64(JSON.stringify(sum));
  return createOrUpdateRepoContent(
    'summary.json',
    encodedSum,
    'update summary',
    sha,
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
