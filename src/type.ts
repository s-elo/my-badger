export type BudgetItem = {
  id: number;
  type: BudgetType;
  issueId: number;
  price: number;
  desc: string;
  tags: string[];
  created: string;
  updated: string;
};

export enum BudgetType {
  spending = 'spending',
  income = 'income',
}
