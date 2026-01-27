import { createFileRoute, Link } from '@tanstack/react-router';
import { Card } from '../../components';
import { Chatbot } from '../../types/chatbot';
import { chatbotsApi } from '../../api/chatbots-api';

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

function Dashboard({ chatbot }: { chatbot: Chatbot, chatbotId: number }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of {chatbot.title}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Status</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900 capitalize">{chatbot.status}</div>
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Chatbot ID</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">#{chatbot.id}</div>
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Created</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-sm font-bold text-gray-900">
              {new Date(Date.parse(chatbot.createdAt)).toLocaleDateString()}
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Updated</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm font-bold text-gray-900">
              {new Date(Date.parse(chatbot.modifiedAt)).toLocaleDateString()}
            </div>
          </div>
        </Card>
      </div>

      {chatbot.description && (
        <Card>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Description</h3>
            <p className="text-gray-900">{chatbot.description}</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <div className="space-y-2">
              <Link to={`/$chatbotId/chats`} params={{ chatbotId: chatbot.id.toString() }} className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition">
                View Chats
              </Link>
              <Link to={`/$chatbotId/knowledge-base`} params={{ chatbotId: chatbot.id.toString() }} className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition">
                Manage Knowledge Base
              </Link>
              <Link to={`/$chatbotId/plans`} params={{ chatbotId: chatbot.id.toString() }} className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition">
                Configure Plans
              </Link>
              <Link to={`/$chatbotId/configuration`} params={{ chatbotId: chatbot.id.toString() }} className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition">
                Configuration
              </Link>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
            <div className="text-sm text-gray-600">
              <p>Configure your chatbot settings, appearance, and behavior to match your needs.</p>
              <Link to={`/$chatbotId/configuration`} params={{ chatbotId: chatbot.id.toString() }} className="text-blue-600 hover:underline mt-2 inline-block">
                Go to Configuration →
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

