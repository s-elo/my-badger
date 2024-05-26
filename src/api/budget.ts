import { DESC_LINE_SPLITTER, LINE_SPLITTER } from '../constant';
import { BudgetItem } from '../type';
import {
  base64ToStr,
  formatDate,
  getCurrentRecordTitle,
  issuesToBudgets,
  sortByCreateDate,
  strToBase64,
  stringifyBudget,
  set,
} from '../utils';
import {
  checkIssue,
  createIssue,
  getIssue,
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

export async function getIssueBudgets(issueNum: number) {
  const issue = await getIssue(issueNum);
  return issuesToBudgets([issue]);
}

/** add to specific issue,
 * if no specified date, add to current month issue;
 */
export async function addBudget(
  budget: BudgetItem,
  createdTime?: number | string,
) {
  const curIssueTitle = getCurrentRecordTitle(createdTime);

  budget.updated = formatDate(Date.now());

  const issueExisted = await checkIssue(curIssueTitle);
  if (issueExisted) {
    budget.issueId = issueExisted.number;
    const existedBudgets = issuesToBudgets([issueExisted]);

    await updateIssue(issueExisted.number, {
      body: set([budget, ...existedBudgets], 'id')
        .sort(sortByCreateDate)
        .map((item) =>
          stringifyBudget(item).replaceAll(LINE_SPLITTER, DESC_LINE_SPLITTER),
        )
        .join(LINE_SPLITTER),
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

export async function deleteBudget(budget: BudgetItem) {
  const issueBudgets = await getIssueBudgets(budget.issueId);
  const filteredBudgets = issueBudgets.filter((item) => item.id !== budget.id);
  return updateIssue(budget.issueId, {
    body: filteredBudgets
      .map((item) =>
        stringifyBudget(item).replaceAll(LINE_SPLITTER, DESC_LINE_SPLITTER),
      )
      .join(LINE_SPLITTER),
  });
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
