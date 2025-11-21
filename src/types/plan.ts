import { z } from 'zod';

export const PlanSchema = z.object({
  id: z.optional(z.string()),
  name: z.string().min(1, { message: 'Plan name is required' }),
  totalChats: z.number().min(-1, { message: 'Total chats is required' }),
  totalQuestions: z.number().min(-1, { message: 'Total questions is required' }),
  questionSize: z.number().min(-1, { message: 'Question size is required' }),
  historySize: z.number().min(-1, { message: 'History size is required' }),
  period: z.enum(['year', 'month', 'week', 'day', 'lifetime'], { message: 'Plan period is required' }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Plan = z.infer<typeof PlanSchema>;

export const PlanInputSchema = z.object({
  name: z.string(),
  totalChats: z.string(),
  totalQuestions: z.string(),
  questionSize: z.string(),
  historySize: z.string(),
  period: z.enum(['year', 'month', 'week', 'day', 'lifetime'], { message: 'Plan period is required' }),
});

export type PlanInput = z.infer<typeof PlanInputSchema>;

export type PlanPeriod = 'year' | 'month' | 'week' | 'day' | 'lifetime';