import { createFileRoute } from '@tanstack/react-router'
import { Header } from '../../components/Header';
import { Outlet } from '@tanstack/react-router';
import { Chatbot } from '../../types/chatbot';
import { chatbotsApi } from '../../api/chatbots-api';

type LoaderData = {
  chatbot: Chatbot;
};

export const Route = createFileRoute('/$chatbotId')({
  loader: async ({ params }) => {
    const chatbotId = Number(params.chatbotId);
    const chatbot = await chatbotsApi.get(chatbotId);
    return { chatbot: chatbot.chatbot as Chatbot, success: chatbot.success, message: chatbot.message };
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { chatbot } = Route.useLoaderData() as LoaderData;
  return (
    <>
      <Header chatbot={chatbot} />
      <main className="max-w-7xl mx-auto p-8">
        <Outlet />
      </main>
    </>
  );
}
