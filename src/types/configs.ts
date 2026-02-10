import { z } from 'zod';
import type { ChatTheme } from './chat-theme';

export const ConfigsSchema = z.object({
  apiKey: z.string().min(1, { message: 'API Key is required' }),
  totalChats: z.number().min(0, { message: 'Total chats is required' }),
  totalQuestions: z.number().min(0, { message: 'Total questions is required' }),
  adminsOnly: z.boolean().default(true),
  publicPlan: z.optional(z.string()),
  defaultPlan: z.string().min(1, { message: 'Default plan is required' }),
  fileSearchStore: z.string().min(1, { message: 'File search store is required' }).regex(/^[-a-z0-9]+$/, { message: 'File search store contain only letters and numbers' }),
  systemInstructions: z.optional(z.string()),
  temperature: z.number().min(0).max(2),
  topP: z.number().min(0).max(1),
  topK: z.number().min(1).max(100),
  maxOutputTokens: z.number().min(1).max(65000),
  chatTheme: z.optional(z.any()), // ChatTheme object - validated separately
  model: z.string().min(1, { message: 'Model is required' }).regex(/^[a-z0-9\/\._-]+$/, { message: 'Model contain only letters, numbers, and hyphens' }),
  // Consultant Model Configuration

  consultant: z.object({
    enabled: z.boolean().default(false),
    model: z.string(),
    systemInstructions: z.optional(z.string()),
    temperature: z.number().min(0).max(2),
    topP: z.number().min(0).max(1),
    topK: z.number().min(0).max(100),
    maxOutputTokens: z.number().min(0).max(65000),
    description: z.string(),
  }).superRefine((data, ctx) => {
    if (data.enabled) {
      if (!data.model || data.model.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Consultant model is required when enabled',
          path: ['model'],
        });
      } else if (!/^[a-z0-9\/\._-]+$/.test(data.model)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Consultant model contain only letters, numbers, and hyphens',
          path: ['model'],
        });
      }
      if (!data.description || data.description.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Consultant description is required when enabled',
          path: ['description'],
        });
      }
      if (data.topK < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Top K must be at least 1 when consultant is enabled',
          path: ['topK'],
        });
      }
      if (data.maxOutputTokens < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Max output tokens must be at least 1 when consultant is enabled',
          path: ['maxOutputTokens'],
        });
      }
    }
  }),
});

export type Configs = z.infer<typeof ConfigsSchema> & {
  chatTheme?: ChatTheme;
};