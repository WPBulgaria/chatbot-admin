import { createFileRoute } from '@tanstack/react-router';
import { KnowledgeBase } from '../../pages/KnowledgeBase.tsx';
import type { KnowledgeBaseFile } from '../../types/knowledge-base.ts';
import { makeFilesApi } from '../../api/files-api.tsx';

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
  chatbotId: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Route = createFileRoute('/$chatbotId/knowledge-base' as any)({
  validateSearch: (search: Record<string, unknown>): KnowledgeBaseSearch => {
    return {
      page: Number(search.page) || 1,
      limit: Number(search.limit) || 10,
    };
  },
  loaderDeps: ({ search: { page, limit } }) => ({ page, limit }),
  loader: async ({ deps: { page, limit }, params }): Promise<LoaderData> => {
    const chatbotId = Number(params.chatbotId);
    const filesApi = makeFilesApi();
    const data = await filesApi.list(page, limit, chatbotId);
    return {
      files: data.files as KnowledgeBaseFile[],
      total: data.total,
      pages: data.pages,
      currentPage: page ?? 1,
      limit: limit ?? 10,
      chatbotId: chatbotId,
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
        chatbotId={data.chatbotId}
      />
    );
  },
});
