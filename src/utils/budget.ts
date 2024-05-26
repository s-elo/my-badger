import { IssueItem, Summary } from '../api';
import {
  DESC_LINE_SPLITTER,
  LINE_SPLITTER,
  PARSE_BUDGET_ITEM_REG,
} from '../constant';
import { BudgetItem, BudgetType } from '../type';

export function parseBudget(str: string, issueId: number): BudgetItem | null {
  const [id, type, price, desc, tags, created, updated] =
    str.match(PARSE_BUDGET_ITEM_REG)?.slice(1) || [];

  if (!id || !type || !price || !desc || !tags || !created || !updated) {
    return null;
  }

  return {
    id: Number(id),
    type: type as BudgetType,
    issueId,
    price: Number(price),
    desc: desc.replaceAll(DESC_LINE_SPLITTER, LINE_SPLITTER),
    tags: tags.replaceAll('#', '').split(','),
    created,
    updated,
  };
}

export function parseBudgets(issueBody: string, issueId: number) {
  const items = issueBody.split(LINE_SPLITTER);
  return items.reduce<BudgetItem[]>((budgets, item) => {
    const budget = parseBudget(item, issueId);
    if (budget) {
      budgets.push(budget);
    }
    return budgets;
  }, []);
}

export function issuesToBudgets(issues: IssueItem[]) {
  return issues.reduce<BudgetItem[]>((budgets, issue) => {
    if (issue.body) {
      budgets.push(...parseBudgets(issue.body, issue.number));
    }
    return budgets;
  }, []);
}

export function stringifyBudget({
  id,
  type,
  price,
  desc,
  tags,
  created,
  updated,
}: BudgetItem) {
  return `${id} *${type}* *${price}* *${desc}* *${tags
    .map((tag) => `#${tag}`)
    .join(',')}* *${created}* *${updated}*`;
}

export function syncSummary(
  diff: number,
  sum: Summary,
  tags: string[],
  type: BudgetType = BudgetType.spending,
) {
  sum[type] += diff;
  tags.forEach((tag) => {
    // newly added tag
    sum.tags[tag] = sum.tags[tag] || {
      income: 0,
      spending: 0,
    };
    sum.tags[tag][type] += diff;
  });
  return sum;
}

export function sortByCreateDate(a: BudgetItem, b: BudgetItem) {
  return new Date(b.created).getTime() - new Date(a.created).getTime();
}
