import { createFileRoute } from '@tanstack/react-router';
import { Chats } from '../pages/Chats';
import { makeChatsApi, type Chat } from '../api/chats-api';

type ChatsSearch = {
  page?: number;
  limit?: number;
};

type LoaderData = {
  chats: Chat[];
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Route = createFileRoute('/chats' as any)({
  validateSearch: (search: Record<string, unknown>): ChatsSearch => {
    return {
      page: Number(search.page) || 1,
      limit: Number(search.limit) || 20,
    };
  },
  loaderDeps: ({ search: { page, limit } }) => ({ page, limit }),
  loader: async ({ deps: { page, limit } }): Promise<LoaderData> => {
    const chatsApi = makeChatsApi();
    const data = await chatsApi.list(page, limit);
    return {
      chats: data.chats,
      total: data.total,
      pages: data.pages,
      currentPage: page ?? 1,
      limit: limit ?? 20,
    };
  },
  component: () => {
    const data = Route.useLoaderData() as LoaderData;
    return (
      <Chats
        chats={data.chats}
        total={data.total}
        pages={data.pages}
        currentPage={data.currentPage}
        limit={data.limit}
      />
    );
  },
});
