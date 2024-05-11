import { OWNER, REPO } from '../constant';
import { gbReq } from './base';

export async function getRepoContent(path: string) {
  return gbReq.get(
    `/repos/${OWNER}/${REPO}/contents/${path}`,
  ) as Promise<RepoContent>;
}

export async function createOrUpdateRepoContent(
  path: string,
  content: string, // base64 encoded content
  message: string,
) {
  return gbReq.put(`/repos/${OWNER}/${REPO}/contents/${path}`, {
    message,
    content,
  }) as Promise<{
    content?: { name: string };
  }>;
}

export type RepoContent = {
  name: string;
  path: string;
  content: string; // base64
};
