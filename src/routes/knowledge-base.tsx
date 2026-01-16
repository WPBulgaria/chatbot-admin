import { createFileRoute } from '@tanstack/react-router';
import { KnowledgeBase } from '../pages/KnowledgeBase';
import type { KnowledgeBaseFile } from '../types/knowledge-base.ts';
import { makeFilesApi } from '../api/files-api.tsx';

type KnowledgeBaseSearch = {
  page?: number;
  limit?: number;
};

type LoaderData = {
  files: KnowledgeBaseFile[];
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Route = createFileRoute('/knowledge-base' as any)({
  validateSearch: (search: Record<string, unknown>): KnowledgeBaseSearch => {
    return {
      page: Number(search.page) || 1,
      limit: Number(search.limit) || 10,
    };
  },
  loaderDeps: ({ search: { page, limit } }) => ({ page, limit }),
  loader: async ({ deps: { page, limit } }): Promise<LoaderData> => {
    const filesApi = makeFilesApi();
    const data = await filesApi.list(page, limit);
    return {
      files: data.files as KnowledgeBaseFile[],
      total: data.total,
      pages: data.pages,
      currentPage: page ?? 1,
      limit: limit ?? 10,
    };
  },
  component: () => {
    const data = Route.useLoaderData() as LoaderData;
    return (
      <KnowledgeBase
        files={data.files}
        total={data.total}
        pages={data.pages}
        currentPage={data.currentPage}
        limit={data.limit}
      />
    );
  },
});
