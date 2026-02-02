import type { Configs } from './configs';

export interface Chatbot {
  id: number;
  title: string;
  description: string;
  status: 'publish' | 'draft' | 'trash';
  createdAt: string;
  modifiedAt: string;
  config?: Configs;
  models?: {name:string, displayName:string}[];
}

export interface ChatbotPayload {
  title: string;
  description?: string;
  status: 'publish' | 'draft';
}
