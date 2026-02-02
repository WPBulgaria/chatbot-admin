import { createFileRoute } from '@tanstack/react-router';
import { Chatbots } from '../../pages/Chatbots';
import { Chatbot } from '../../types/chatbot';
import { chatbotsApi } from '../../api/chatbots-api';

type ChatbotsSearch = {
  page?: number;
  limit?: number;
};

type LoaderData = {
  chatbots: Chatbot[];
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
};

export const Route = createFileRoute('/_general/chatbots')({
  validateSearch: (search: Record<string, unknown>): ChatbotsSearch => {
    return {
      page: Number(search.page) || 1,
      limit: Number(search.limit) || 20,
    };
  },
  loaderDeps: ({ search: { page, limit } }) => ({ page, limit }),
  loader: async ({ deps: { page, limit } }): Promise<LoaderData> => {
    const data = await chatbotsApi.list(page, limit);
    return { chatbots: data.chatbots as Chatbot[], total: data.total, pages: data.pages, currentPage: page ?? 1, limit: limit ?? 20 };
  },
  component: () => {
    const data = Route.useLoaderData() as LoaderData;
    return (
      <Chatbots
        chatbots={data.chatbots}
        total={data.total}
        pages={data.pages}
        currentPage={data.currentPage}
        limit={data.limit}
      />
    );
  },

  pendingComponent: () => {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading chatbots...</div>
      </div>
    );
  },
});
