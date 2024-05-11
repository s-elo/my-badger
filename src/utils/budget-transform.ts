import { PARSE_BUDGET_ITEM_REG } from '../constant';
import { BudgetItem } from '../type';

export function parseBudget(str: string): BudgetItem | null {
  const [id, price, desc, tags, created, updated] =
    str.match(PARSE_BUDGET_ITEM_REG)?.slice(1) || [];

  if (!id || !price || !desc || !tags || !created || !updated) {
    return null;
  }

  return {
    id: Number(id),
    price: Number(price),
    desc,
    tags: tags.replaceAll('#', '').split(','),
    created,
    updated,
  };
}

export function parseBudgets(issueBody: string) {
  const items = issueBody.split('\n');
  return items.reduce<BudgetItem[]>((budgets, item) => {
    const budget = parseBudget(item);
    if (budget) {
      budgets.push(budget);
    }
    return budgets;
  }, []);
}

export function stringifyBudget({
  id,
  price,
  desc,
  tags,
  created,
  updated,
}: BudgetItem) {
  return `${id} *${price}* *${desc}* *${tags
    .map((tag) => `#${tag}`)
    .join(',')}* *${created}* *${updated}*`;
}
