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

export async function getIssues(
  params: GetIssuesParams = { pageIndex: 1, pageSize: 10 },
) {
  return gbReq.get(`/repos/${OWNER}/${REPO}/issues`, {
    params: {
      per_page: params.pageSize,
      page: params.pageIndex,
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

export async function checkIssue(content: string) {
  return (await searchIssues({ content })).items[0];
}

export type UpdateIssueParams = {
  title?: string;
  body: string;
};

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
  pageIndex?: number;
  pageSize?: number;
};

export type IssueItem = {
  id: number;
  labels: string[];
  created_at: string;
  body: string;
  title: string;
  number: number; // as issue id
};
