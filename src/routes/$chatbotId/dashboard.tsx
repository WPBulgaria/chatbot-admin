import { createFileRoute } from '@tanstack/react-router';
import { Chatbot } from '../../types/chatbot';
import { chatbotsApi } from '../../api/chatbots-api';
import { Dashboard } from '../../pages/Dashboard';

type LoaderData = {
  chatbot: Chatbot;
  chatbotId: number;
  success: boolean;
  message?: string;
};

export const Route = createFileRoute('/$chatbotId/dashboard')({
  loader: async ({ params }) => {
    const chatbotId = Number(params.chatbotId);
    const data = await chatbotsApi.get(chatbotId);
    return { chatbot: data.chatbot as Chatbot, chatbotId: chatbotId, success: data.success, message: data.message };
  },
  component: () => {
    const { chatbot, chatbotId } = Route.useLoaderData() as LoaderData;
    return <Dashboard chatbot={chatbot} chatbotId={chatbotId} />;
  },
});

