import { createFileRoute } from '@tanstack/react-router';
import { EditChat } from '../../pages/EditChat';
import { makeChatsApi, type ChatWithMessages } from '../../api/chats-api';

type LoaderData = {
  chat: ChatWithMessages;
  chatbotId: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Route = createFileRoute('/$chatbotId/chats/$chatId' as any)({
  loader: async ({ params }): Promise<LoaderData> => {
    const chatId = Number(params.chatId);
    const chatbotId = Number(params.chatbotId);
    const chatsApi = makeChatsApi();
    const response = await chatsApi.get(chatId, chatbotId);

    if (!response.success || !response.chat) {
      throw new Error(response.message || 'Chat not found');
    }

    return {
      chat: response.chat,
      chatbotId: chatbotId,
    };
  },
  component: () => {
    const data = Route.useLoaderData() as LoaderData;
    return <EditChat chat={data.chat} chatbotId={data.chatbotId} />;
  },
});
