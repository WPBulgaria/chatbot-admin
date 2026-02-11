import { useState } from 'react';
import { Card, Button, Input, Toast, StatCardSkeleton, ChartSkeleton, TableSkeleton } from '../components';
import { StatCard } from '../components/StatCard';
import { SimpleChart } from '../components/SimpleChart';
import { Chatbot } from '../types/chatbot';
import { Link, useRouter, useNavigate } from '@tanstack/react-router';
import { chatbotsApi } from '../api/chatbots-api';
import type { PeriodStats, ComparativeStats, ChartStatsResponse, TopUsersResponse } from '../types/stats';

export interface ChatbotDashboardProps {
  chatbot: Chatbot;
  chatbotId: number;
  periodStats: { success: boolean; stats: PeriodStats };
  comparativeStats: ComparativeStats;
  chartStats: ChartStatsResponse;
  topUsers: TopUsersResponse;
  period: 'day' | 'week' | 'month' | 'year';
}

export function ChatbotDashboard({ 
  chatbot, 
  chatbotId,
  periodStats,
  comparativeStats,
  chartStats,
  topUsers,
  period: selectedPeriod 
}: ChatbotDashboardProps) {
  const router = useRouter();
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState<'title' | 'description' | 'status' | null>(null);
  const [editedTitle, setEditedTitle] = useState(chatbot.title);
  const [editedDescription, setEditedDescription] = useState(chatbot.description || '');
  const [editedStatus, setEditedStatus] = useState(chatbot.status);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handlePeriodChange = (period: 'day' | 'week' | 'month' | 'year') => {
    navigate({ 
      to: '/$chatbotId/dashboard',
      params: { chatbotId: chatbotId.toString() },
      search: { period },
    });
  };

  const stats = periodStats?.stats;
  const growth = comparativeStats?.stats?.growth;

  const handleEdit = (field: 'title' | 'description' | 'status') => {
    setEditingField(field);
    setEditedTitle(chatbot.title);
    setEditedDescription(chatbot.description || '');
    setEditedStatus(chatbot.status);
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditedTitle(chatbot.title);
    setEditedDescription(chatbot.description || '');
    setEditedStatus(chatbot.status);
  };

  const handleSave = async () => {
    if (!editingField) return;

    const payload: any = { ...chatbot, config: undefined, modifiedAt: undefined, createdAt: undefined };
    if (editingField === 'title') {
      if (!editedTitle.trim()) {
        setToast({ message: 'Title cannot be empty', type: 'error' });
        return;
      }
      payload.title = editedTitle;
    } else if (editingField === 'description') {
      payload.description = editedDescription;
    } else if (editingField === 'status') {
      payload.status = editedStatus;
    }

    setLoading(true);
    try {
      await chatbotsApi.update(chatbotId, payload);
      setToast({ message: 'Updated successfully', type: 'success' });
      setEditingField(null);
      router.invalidate();
    } catch (error) {
      setToast({ message: 'Failed to update', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          {editingField === 'title' ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="flex-1"
                placeholder="Enter title"
              />
              <Button onClick={handleSave} disabled={loading} className="whitespace-nowrap">
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="secondary" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">{chatbot.title}</h1>
              <button
                onClick={() => handleEdit('title')}
                className="text-gray-400 hover:text-gray-600 transition"
                title="Edit title"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">Dashboard & Statistics</p>
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

          <Card title="Top Users" description="Most active users by chat count">
            <TableSkeleton rows={5} />
          </Card>
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

      <Card>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Description</h3>
            {editingField !== 'description' && (
              <button
                onClick={() => handleEdit('description')}
                className="text-gray-400 hover:text-gray-600 transition"
                title="Edit description"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>
          {editingField === 'description' ? (
            <div className="space-y-2">
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="secondary" onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-900">{chatbot.description || 'No description'}</p>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Status</span>
              {editingField !== 'status' && (
                <button
                  onClick={() => handleEdit('status')}
                  className="text-gray-400 hover:text-gray-600 transition"
                  title="Edit status"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
            </div>
            {editingField === 'status' ? (
              <div className="space-y-2">
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value as 'publish' | 'draft')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="publish">Publish</option>
                  <option value="draft">Draft</option>
                </select>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={loading} className="flex-1 text-xs">
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="secondary" onClick={handleCancel} disabled={loading} className="flex-1 text-xs">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-lg font-bold text-gray-900 capitalize">{chatbot.status}</div>
            )}
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
            <div className="text-lg font-bold text-gray-900">
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
            <div className="text-lg font-bold text-gray-900">
              {new Date(Date.parse(chatbot.modifiedAt)).toLocaleDateString()}
            </div>
          </div>
        </Card>
      </div>

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

      {toast && (
        <Toast
          show={true}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
