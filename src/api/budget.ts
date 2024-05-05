import { OWNER, REPO } from '../constant';
import { gbReq } from './base';

export function searchBudgets({ content = '' }: SearchBudgetParams) {
  return gbReq.get('/search/issues', {
    params: {
      q: `${content} is:issue repo:${OWNER}/${REPO}`,
    },
  }) as Promise<{
    incomplete_results: boolean;
    total_count: number;
    items: IssueItem[];
  }>;
}

export function getBudgets(params: GetBudgetParams = { page: 1 }) {
  return gbReq.get(`/repos/${OWNER}/${REPO}/issues`, {
    params: {
      per_page: 10,
      page: params.page,
    },
  }) as Promise<IssueItem[]>;
}

export type GetBudgetParams = {
  page?: number;
};

export type SearchBudgetParams = {
  content?: string;
  label?: string[];
  date?: number;
};

export type IssueItem = {
  id: number;
  labels: string[];
  created_at: string;
  body: string;
  title: string;
};
