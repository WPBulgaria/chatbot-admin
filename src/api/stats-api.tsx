import { BaseApi } from './base-api';
import type {
  GlobalStatsResponse,
  ComparativeStats,
  ChartStatsResponse,
  TopUsersResponse,
  PeriodStats,
} from '../types/stats';

export class StatsApi extends BaseApi {
  async getGlobalStats(signal?: AbortSignal): Promise<GlobalStatsResponse> {
    const response = await fetch(`${this.apiEndpoint}/stats/global`, {
      method: 'GET',
      headers: this.getHeaders(),
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch global stats');
    }

    return response.json();
  }

  async getStatsByPeriod(period: 'day' | 'week' | 'month' | 'year' | 'all', signal?: AbortSignal): Promise<{ success: boolean; stats: PeriodStats }> {
    const params = new URLSearchParams({ period });
    const response = await fetch(`${this.apiEndpoint}/stats?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return response.json();
  }

  async getComparativeStats(period: 'day' | 'week' | 'month' | 'year', signal?: AbortSignal): Promise<ComparativeStats> {
    const params = new URLSearchParams({ period });
    const response = await fetch(`${this.apiEndpoint}/stats/comparative?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comparative stats');
    }

    return response.json();
  }

  async getChartStats(period: 'day' | 'week' | 'month' | 'year', signal?: AbortSignal): Promise<ChartStatsResponse> {
    const params = new URLSearchParams({ period });
    const response = await fetch(`${this.apiEndpoint}/stats/chart?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chart stats');
    }

    return response.json();
  }

  async getTopUsers(limit: number = 10, signal?: AbortSignal): Promise<TopUsersResponse> {
    const params = new URLSearchParams({ limit: limit.toString() });
    const response = await fetch(`${this.apiEndpoint}/stats/top-users?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch top users');
    }

    return response.json();
  }

  // Chatbot-specific stats
  async getChatbotGlobalStats(chatbotId: number, signal?: AbortSignal): Promise<GlobalStatsResponse> {
    const response = await fetch(`${this.apiEndpoint}/chatbots/${chatbotId}/stats/global`, {
      method: 'GET',
      headers: this.getHeaders(),
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chatbot global stats');
    }

    return response.json();
  }

  async getChatbotStatsByPeriod(chatbotId: number, period: 'day' | 'week' | 'month' | 'year' | 'all', signal?: AbortSignal): Promise<{ success: boolean; stats: PeriodStats }> {
    const params = new URLSearchParams({ period });
    const response = await fetch(`${this.apiEndpoint}/chatbots/${chatbotId}/stats?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chatbot stats');
    }

    return response.json();
  }

  async getChatbotComparativeStats(chatbotId: number, period: 'day' | 'week' | 'month' | 'year', signal?: AbortSignal): Promise<ComparativeStats> {
    const params = new URLSearchParams({ period });
    const response = await fetch(`${this.apiEndpoint}/chatbots/${chatbotId}/stats/comparative?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chatbot comparative stats');
    }

    return response.json();
  }

  async getChatbotChartStats(chatbotId: number, period: 'day' | 'week' | 'month' | 'year', signal?: AbortSignal): Promise<ChartStatsResponse> {
    const params = new URLSearchParams({ period });
    const response = await fetch(`${this.apiEndpoint}/chatbots/${chatbotId}/stats/chart?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chatbot chart stats');
    }

    return response.json();
  }

  async getChatbotTopUsers(chatbotId: number, limit: number = 10, signal?: AbortSignal): Promise<TopUsersResponse> {
    const params = new URLSearchParams({ limit: limit.toString() });
    const response = await fetch(`${this.apiEndpoint}/chatbots/${chatbotId}/stats/top-users?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chatbot top users');
    }

    return response.json();
  }
}

export const statsApi = new StatsApi();
