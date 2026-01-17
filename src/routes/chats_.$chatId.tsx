import { createFileRoute } from '@tanstack/react-router';
import { EditChat } from '../pages/EditChat';
import { makeChatsApi, type ChatWithMessages } from '../api/chats-api';

type LoaderData = {
  chat: ChatWithMessages;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Route = createFileRoute('/chats/$chatId' as any)({
  loader: async ({ params }): Promise<LoaderData> => {
    const chatId = Number(params.chatId);
    const chatsApi = makeChatsApi();
    const response = await chatsApi.get(chatId);

    if (!response.success || !response.chat) {
      throw new Error(response.message || 'Chat not found');
    }

    return {
      chat: response.chat,
    };
  },
  component: () => {
    const data = Route.useLoaderData() as LoaderData;
    return <EditChat chat={data.chat} />;
  },
});
