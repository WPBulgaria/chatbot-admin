import { BaseApi } from './base-api';
import type { Chatbot, ChatbotPayload } from '../types/chatbot';

export class ChatbotsApi extends BaseApi {
  async list(page = 1, perPage = 20,): Promise<{ chatbots: Chatbot[], success: boolean, message?: string, total: number, pages: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(`${this.apiEndpoint}/chatbots?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chatbots');
    }

    return response.json();
  }

  async get(id: number): Promise<{ chatbot: Chatbot, success: boolean, message?: string }> {
    const response = await fetch(`${this.apiEndpoint}/chatbots/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chatbot');
    }

    return response.json();
  }

  async create(payload: ChatbotPayload): Promise<Chatbot> {
    const response = await fetch(`${this.apiEndpoint}/chatbots`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to create chatbot');
    }

    return response.json();
  }

  async update(id: number, payload: ChatbotPayload): Promise<Chatbot> {
    const response = await fetch(`${this.apiEndpoint}/chatbots/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to update chatbot');
    }

    return response.json();
  }

  async updateConfig(id: number, config: Record<string, any>): Promise<Chatbot> {
    const response = await fetch(`${this.apiEndpoint}/chatbots/${id}/config`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error('Failed to update chatbot config');
    }

    return response.json();
  }

  async trash(id: number): Promise<void> {
    const response = await fetch(`${this.apiEndpoint}/chatbots/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to trash chatbot');
    }
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.apiEndpoint}/chatbots/${id}/force`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete chatbot');
    }
  }

  async restore(id: number): Promise<Chatbot> {
    const response = await fetch(`${this.apiEndpoint}/chatbots/${id}/restore`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to restore chatbot');
    }

    return response.json();
  }
}

export const chatbotsApi = new ChatbotsApi();
