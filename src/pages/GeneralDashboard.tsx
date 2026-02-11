import { Card, StatCardSkeleton, ChartSkeleton, TableSkeleton } from '../components';
import { StatCard } from '../components/StatCard';
import { SimpleChart } from '../components/SimpleChart';
import { useNavigate } from '@tanstack/react-router';
import type { PeriodStats, ComparativeStats, ChartStatsResponse, TopUsersResponse } from '../types/stats';

export interface GeneralDashboardProps {
  periodStats: { success: boolean; stats: PeriodStats };
  comparativeStats: ComparativeStats;
  chartStats: ChartStatsResponse;
  topUsers: TopUsersResponse;
  period: 'day' | 'week' | 'month' | 'year';
}

export function GeneralDashboard({ 
  periodStats, 
  comparativeStats, 
  chartStats, 
  topUsers,
  period: selectedPeriod 
}: GeneralDashboardProps) {
  const navigate = useNavigate();

  const handlePeriodChange = (period: 'day' | 'week' | 'month' | 'year') => {
    navigate({ 
      to: '/dashboard',
      search: { period },
    });
  };

  const stats = periodStats?.stats;
  const growth = comparativeStats?.stats?.growth;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of all chatbots</p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Period:</span>
        <div className="flex gap-2">
          {(['day', 'week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
              className={`px-3 py-1.5 text-sm font-medium rounded transition ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {!periodStats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          <Card title="Activity Chart" description={`Activity over the selected period (${selectedPeriod})`}>
            <ChartSkeleton height={250} />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Period Breakdown">
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-b-0">
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="animate-pulse space-y-2">
                      <div className="h-5 w-20 bg-gray-200 rounded ml-auto"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded ml-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Top Users" description="Most active users by chat count">
              <TableSkeleton rows={5} />
            </Card>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Chats"
              value={stats?.total_chats?.toLocaleString() || '0'}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              trend={growth ? {
                value: growth.chats_growth_percentage,
                isPositive: growth.chats_growth_percentage >= 0,
              } : undefined}
              subtitle={`For selected period: ${selectedPeriod}`}
            />

            <StatCard
              title="Total Questions"
              value={stats?.total_questions?.toLocaleString() || '0'}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              trend={growth ? {
                value: growth.questions_growth_percentage,
                isPositive: growth.questions_growth_percentage >= 0,
              } : undefined}
              subtitle={`For selected period: ${selectedPeriod}`}
            />

            <StatCard
              title="Unique Users"
              value={stats?.unique_users?.toLocaleString() || '0'}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              trend={growth ? {
                value: growth.users_growth_percentage,
                isPositive: growth.users_growth_percentage >= 0,
              } : undefined}
            />

            <StatCard
              title="Avg Questions/Chat"
              value={stats?.avg_questions_per_chat?.toFixed(2) || '0'}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          </div>

          <Card title="Activity Chart" description={`Activity over the selected period (${selectedPeriod})`}>
            <SimpleChart
              data={chartStats?.stats?.data || []}
              height={250}
            />
          </Card>

          <Card title="Top Users" description="Most active users by chat count">
            <div className="space-y-3">
              {topUsers?.stats?.users && topUsers.stats.users.length > 0 ? (
                topUsers.stats.users.map((user, index) => (
                  <div key={user.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.user_name || 'Unknown User'}</div>
                        <div className="text-xs text-gray-500">{user.user_email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{user.chat_count} chats</div>
                      <div className="text-xs text-gray-600">{user.question_count} questions</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 text-sm">No user activity yet</div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
