import { createFileRoute } from '@tanstack/react-router';
import { Chatbot } from '../../types/chatbot';
import { chatbotsApi } from '../../api/chatbots-api';
import { statsApi } from '../../api/stats-api';
import { Analytics } from '../../pages/Analytics';
import type { PeriodStats, ComparativeStats, ChartStatsResponse, TopUsersResponse } from '../../types/stats';

type AnalyticsSearch = {
  period?: 'day' | 'week' | 'month' | 'year';
  limit?: number;
};

type LoaderData = {
  chatbot: Chatbot;
  chatbotId: number;
  periodStats: { success: boolean; stats: PeriodStats };
  comparativeStats: ComparativeStats;
  chartStats: ChartStatsResponse;
  topUsers: TopUsersResponse;
  period: 'day' | 'week' | 'month' | 'year';
  topUsersLimit: number;
};

export const Route = createFileRoute('/$chatbotId/analytics')({
  validateSearch: (search: Record<string, unknown>): AnalyticsSearch => {
    return {
      period: (search.period as 'day' | 'week' | 'month' | 'year') || 'month',
      limit: (search.limit as number) || 10,
    };
  },
  loaderDeps: ({ search }) => ({ 
    period: (search as AnalyticsSearch).period || 'month',
    limit: (search as AnalyticsSearch).limit || 10,
  }),
  loader: async ({ params, deps: { period, limit }, abortController }): Promise<LoaderData> => {
    const chatbotId = Number(params.chatbotId);
    
    const [chatbotData, periodStats, comparativeStats, chartStats, topUsers] = await Promise.all([
      chatbotsApi.get(chatbotId),
      statsApi.getChatbotStatsByPeriod(chatbotId, period, abortController.signal),
      statsApi.getChatbotComparativeStats(chatbotId, period, abortController.signal),
      statsApi.getChatbotChartStats(chatbotId, period, abortController.signal),
      statsApi.getChatbotTopUsers(chatbotId, limit, abortController.signal),
    ]);

    return {
      chatbot: chatbotData.chatbot as Chatbot,
      chatbotId,
      periodStats,
      comparativeStats,
      chartStats,
      topUsers,
      period,
      topUsersLimit: limit,
    };
  },
  component: () => {
    const data = Route.useLoaderData() as LoaderData;
    return <Analytics {...data} />;
  },
});
