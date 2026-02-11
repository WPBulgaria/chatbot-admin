export interface PeriodStats {
  period: 'day' | 'week' | 'month' | 'year' | 'all';
  total_chats: number;
  total_questions: number;
  unique_users: number;
  avg_questions_per_chat: number;
}

export interface StatsSummary {
  total_chats_all_time: number;
  total_questions_all_time: number;
  unique_users_all_time: number;
  avg_questions_per_chat: number;
  chats_created_today: number;
  questions_asked_today: number;
}

export interface GlobalStatsResponse {
  success: boolean;
  stats: {
    all_time: PeriodStats;
    today: PeriodStats;
    this_week: PeriodStats;
    this_month: PeriodStats;
    this_year: PeriodStats;
    summary: StatsSummary;
  };
}

export interface ComparativeStats {
  success: boolean;
  stats: {
    current: PeriodStats;
    previous: PeriodStats;
    growth: {
      chats_growth_percentage: number;
      questions_growth_percentage: number;
      users_growth_percentage: number;
    };
  };
}

export interface ChartDataPoint {
  date: string;
  chats: number;
  questions: number;
}

export interface ChartStatsResponse {
  success: boolean;
  stats: {
    period: string;
    data: ChartDataPoint[];
  };
}

export interface TopUser {
  user_id: number;
  user_email: string;
  user_name: string;
  chat_count: number;
  question_count: number;
}

export interface TopUsersResponse {
  success: boolean;
  stats: {
    users: TopUser[];
    limit: number;
  };
}
