import { createFileRoute } from '@tanstack/react-router';
import { Chatbot } from '../../types/chatbot';
import { chatbotsApi } from '../../api/chatbots-api';
import { statsApi } from '../../api/stats-api';
import { ChatbotDashboard } from '../../pages/ChatbotDashboard';
import type { PeriodStats, ComparativeStats, ChartStatsResponse, TopUsersResponse } from '../../types/stats';

type DashboardSearch = {
  period?: 'day' | 'week' | 'month' | 'year';
};

type LoaderData = {
  chatbot: Chatbot;
  chatbotId: number;
  periodStats: { success: boolean; stats: PeriodStats };
  comparativeStats: ComparativeStats;
  chartStats: ChartStatsResponse;
  topUsers: TopUsersResponse;
  period: 'day' | 'week' | 'month' | 'year';
};

export const Route = createFileRoute('/$chatbotId/dashboard')({
  validateSearch: (search: Record<string, unknown>): DashboardSearch => {
    return {
      period: (search.period as 'day' | 'week' | 'month' | 'year') || 'week',
    };
  },
  loaderDeps: ({ search }) => ({ period: (search as DashboardSearch).period || 'week' }),
  loader: async ({ params, deps: { period }, abortController }): Promise<LoaderData> => {
    const chatbotId = Number(params.chatbotId);
    
    const [chatbotData, periodStats, comparativeStats, chartStats, topUsers] = await Promise.all([
      chatbotsApi.get(chatbotId),
      statsApi.getChatbotStatsByPeriod(chatbotId, period, abortController.signal),
      statsApi.getChatbotComparativeStats(chatbotId, period, abortController.signal),
      statsApi.getChatbotChartStats(chatbotId, period, abortController.signal),
      statsApi.getChatbotTopUsers(chatbotId, 5, abortController.signal),
    ]);

    return {
      chatbot: chatbotData.chatbot as Chatbot,
      chatbotId,
      periodStats,
      comparativeStats,
      chartStats,
      topUsers,
      period,
    };
  },
  component: () => {
    const data = Route.useLoaderData() as LoaderData;
    return <ChatbotDashboard {...data} />;
  },
});
