import { Card, ChartSkeleton, SkeletonLoader } from '../components';
import { SimpleChart } from '../components/SimpleChart';
import { Chatbot } from '../types/chatbot';
import { useNavigate } from '@tanstack/react-router';
import type { PeriodStats, ComparativeStats, ChartStatsResponse, TopUsersResponse } from '../types/stats';

export interface AnalyticsProps {
  chatbot: Chatbot;
  chatbotId: number;
  periodStats: { success: boolean; stats: PeriodStats };
  comparativeStats: ComparativeStats;
  chartStats: ChartStatsResponse;
  topUsers: TopUsersResponse;
  period: 'day' | 'week' | 'month' | 'year';
  topUsersLimit: number;
}

export function Analytics({ 
  chatbot, 
  chatbotId,
  periodStats,
  comparativeStats,
  chartStats,
  topUsers,
  period: selectedPeriod,
  topUsersLimit,
}: AnalyticsProps) {
  const navigate = useNavigate();

  const handlePeriodChange = (period: 'day' | 'week' | 'month' | 'year') => {
    navigate({ 
      to: '/$chatbotId/analytics',
      params: { chatbotId: chatbotId.toString() },
      search: (prev) => ({ ...prev, period }),
    });
  };

  const handleLimitChange = (limit: number) => {
    navigate({ 
      to: '/$chatbotId/analytics',
      params: { chatbotId: chatbotId.toString() },
      search: (prev) => ({ ...prev, limit }),
    });
  };

  const stats = periodStats?.stats;
  const current = comparativeStats?.stats?.current;
  const previous = comparativeStats?.stats?.previous;
  const growth = comparativeStats?.stats?.growth;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">Detailed insights for {chatbot.title}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Compare Period:</span>
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
      </div>

      {!periodStats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Chats Comparison">
              <div className="space-y-3">
                <div className="animate-pulse space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  <div className="h-8 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="animate-pulse space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="animate-pulse h-4 w-28 bg-gray-200 rounded"></div>
              </div>
            </Card>

            <Card title="Questions Comparison">
              <div className="space-y-3">
                <div className="animate-pulse space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  <div className="h-8 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="animate-pulse space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="animate-pulse h-4 w-28 bg-gray-200 rounded"></div>
              </div>
            </Card>

            <Card title="Users Comparison">
              <div className="space-y-3">
                <div className="animate-pulse space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  <div className="h-8 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="animate-pulse space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="animate-pulse h-4 w-28 bg-gray-200 rounded"></div>
              </div>
            </Card>
          </div>

          <Card title="Activity Trend" description={`Activity chart for the selected period (${selectedPeriod})`}>
            <ChartSkeleton height={300} />
          </Card>

          <Card title={`Period Statistics (${selectedPeriod})`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <SkeletonLoader width="w-20" height="h-3" />
                  <SkeletonLoader width="w-16" height="h-8" />
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Chats Comparison">
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Current Period</div>
              <div className="text-2xl font-bold text-gray-900">{current?.total_chats?.toLocaleString() || '0'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Previous Period</div>
              <div className="text-lg font-semibold text-gray-600">{previous?.total_chats?.toLocaleString() || '0'}</div>
            </div>
            {growth && (
              <div className={`flex items-center text-sm font-medium ${growth.chats_growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growth.chats_growth_percentage >= 0 ? (
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                <span>{Math.abs(growth.chats_growth_percentage).toFixed(1)}% growth</span>
              </div>
            )}
          </div>
        </Card>

        <Card title="Questions Comparison">
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Current Period</div>
              <div className="text-2xl font-bold text-gray-900">{current?.total_questions?.toLocaleString() || '0'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Previous Period</div>
              <div className="text-lg font-semibold text-gray-600">{previous?.total_questions?.toLocaleString() || '0'}</div>
            </div>
            {growth && (
              <div className={`flex items-center text-sm font-medium ${growth.questions_growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growth.questions_growth_percentage >= 0 ? (
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                <span>{Math.abs(growth.questions_growth_percentage).toFixed(1)}% growth</span>
              </div>
            )}
          </div>
        </Card>

        <Card title="Users Comparison">
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Current Period</div>
              <div className="text-2xl font-bold text-gray-900">{current?.unique_users?.toLocaleString() || '0'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Previous Period</div>
              <div className="text-lg font-semibold text-gray-600">{previous?.unique_users?.toLocaleString() || '0'}</div>
            </div>
            {growth && (
              <div className={`flex items-center text-sm font-medium ${growth.users_growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growth.users_growth_percentage >= 0 ? (
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                <span>{Math.abs(growth.users_growth_percentage).toFixed(1)}% growth</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card title="Activity Trend" description={`Activity chart for the selected period (${selectedPeriod})`}>
        <SimpleChart
          data={chartStats?.stats?.data || []}
          height={300}
        />
      </Card>

      <Card title={`Period Statistics (${selectedPeriod})`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-gray-500">Total Chats</div>
            <div className="text-2xl font-bold text-gray-900">{stats?.total_chats?.toLocaleString() || '0'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-500">Total Questions</div>
            <div className="text-2xl font-bold text-gray-900">{stats?.total_questions?.toLocaleString() || '0'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-500">Unique Users</div>
            <div className="text-2xl font-bold text-gray-900">{stats?.unique_users?.toLocaleString() || '0'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-500">Avg Q/Chat</div>
            <div className="text-2xl font-bold text-gray-900">{stats?.avg_questions_per_chat?.toFixed(2) || '0'}</div>
          </div>
        </div>
      </Card>
        </>
      )}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top Users</h3>
          <div className="flex items-center gap-2">
            <label htmlFor="topUsersLimit" className="text-sm text-gray-600">Show:</label>
            <select
              id="topUsersLimit"
              value={topUsersLimit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
              <option value={20}>Top 20</option>
              <option value={50}>Top 50</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Chats</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Q/Chat</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!topUsers ? (
                [...Array(topUsersLimit)].map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <SkeletonLoader width="w-8" height="h-8" rounded />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <SkeletonLoader width="w-24" height="h-4" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <SkeletonLoader width="w-40" height="h-4" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <SkeletonLoader width="w-12" height="h-4" className="ml-auto" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <SkeletonLoader width="w-12" height="h-4" className="ml-auto" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <SkeletonLoader width="w-10" height="h-4" className="ml-auto" />
                    </td>
                  </tr>
                ))
              ) : topUsers?.stats?.users && topUsers.stats.users.length > 0 ? (
                topUsers.stats.users.map((user, index) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-200 text-gray-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.user_name || 'Unknown User'}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.user_email}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-gray-900">{user.chat_count}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-gray-900">{user.question_count}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-600">{(user.question_count / user.chat_count).toFixed(2)}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">
                    No user activity yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
