import { createFileRoute } from '@tanstack/react-router';
import { GeneralDashboard } from '../../pages/GeneralDashboard';
import { statsApi } from '../../api/stats-api';
import type { PeriodStats, ComparativeStats, ChartStatsResponse, TopUsersResponse } from '../../types/stats';

type DashboardSearch = {
  period?: 'day' | 'week' | 'month' | 'year';
};

type LoaderData = {
  periodStats: { success: boolean; stats: PeriodStats };
  comparativeStats: ComparativeStats;
  chartStats: ChartStatsResponse;
  topUsers: TopUsersResponse;
  period: 'day' | 'week' | 'month' | 'year';
};

export const Route = createFileRoute('/_general/dashboard')({
  validateSearch: (search: Record<string, unknown>): DashboardSearch => {
    return {
      period: (search.period as 'day' | 'week' | 'month' | 'year') || 'week',
    };
  },
  loaderDeps: ({ search }) => ({ period: (search as DashboardSearch).period || 'week' }),
  loader: async ({ deps: { period }, abortController }): Promise<LoaderData> => {
    const [periodStats, comparativeStats, chartStats, topUsers] = await Promise.all([
      statsApi.getStatsByPeriod(period, abortController.signal),
      statsApi.getComparativeStats(period, abortController.signal),
      statsApi.getChartStats(period, abortController.signal),
      statsApi.getTopUsers(5, abortController.signal),
    ]);

    return {
      periodStats,
      comparativeStats,
      chartStats,
      topUsers,
      period,
    };
  },
  component: () => {
    const data = Route.useLoaderData();
    return <GeneralDashboard {...data} />;
  },
});
