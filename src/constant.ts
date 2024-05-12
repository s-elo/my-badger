import { BudgetType } from './type';

export const BUDGET_TOKEN_LOCAL_STORAGE_KEY = 'budget_token';

export const OWNER = 's-elo';

export const REPO = 'budget-pool';

export const PARSE_BUDGET_ITEM_REG =
  /^(\d+)\s\*([^\*]+)\*\s\*([^\*]+)\*\s\*([^\*]+)\*\s\*([^\*]+)\*\s\*([^\*]+)\*\s\*([^\*]+)\*/;

export const BUDGET_TYPE_OPTS = Object.keys(BudgetType).map((key) => ({
  label: key,
}));
