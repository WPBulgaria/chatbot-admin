import { z } from 'zod';

export const ConfigsSchema = z.object({
  apiKey: z.string().min(1, { message: 'API Key is required' }),
  totalChats: z.number().min(0, { message: 'Total chats is required' }),
  totalQuestions: z.number().min(0, { message: 'Total questions is required' }),
  adminsOnly: z.boolean().default(true),
  publicPlan: z.optional(z.string()),
  defaultPlan: z.string().min(1, { message: 'Default plan is required' }),
});

export type Configs = z.infer<typeof ConfigsSchema>;