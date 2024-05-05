import { OWNER, REPO } from '../constant';
import { gbReq } from './base';

export async function searchIssues({
  content = '',
  labels = [],
}: SearchIssuesParams) {
  const labelQuery = labels.length
    ? ` ${labels.map((label) => `label:${label}`).join(' ')}`
    : '';
  return gbReq.get('/search/issues', {
    params: {
      q: `${content} is:issue repo:${OWNER}/${REPO}${labelQuery}`,
    },
  }) as Promise<{
    incomplete_results: boolean;
    total_count: number;
    items: IssueItem[];
  }>;
}

export async function getIssues(params: GetIssuesParams = { page: 1 }) {
  return gbReq.get(`/repos/${OWNER}/${REPO}/issues`, {
    params: {
      per_page: 10,
      page: params.page,
    },
  }) as Promise<IssueItem[]>;
}

export async function createIssue(params: CreateIssueParams) {
  return gbReq.post(`/repos/${OWNER}/${REPO}/issues`, {
    ...params,
  }) as Promise<IssueItem>;
}

export async function updateIssue(issueNum: number, params: UpdateIssueParams) {
  return gbReq.patch(`/repos/${OWNER}/${REPO}/issues/${issueNum}`, {
    ...params,
  }) as Promise<IssueItem>;
}

export async function getIssue(issueNum: number) {
  return gbReq.get(
    `/repos/${OWNER}/${REPO}/issues/${issueNum}`,
  ) as Promise<IssueItem>;
}

export type UpdateIssueParams = CreateIssueParams;

export type CreateIssueParams = {
  title: string;
  body: string;
};

export type SearchIssuesParams = {
  content?: string;
  labels?: string[];
  date?: number;
};

export type GetIssuesParams = {
  page?: number;
};

export type IssueItem = {
  id: number;
  labels: string[];
  created_at: string;
  body: string;
  title: string;
};
