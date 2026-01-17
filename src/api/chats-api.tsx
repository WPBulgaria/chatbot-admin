import { BaseApi } from './base-api';

export interface Chat {
  id: number;
  title: string;
  userId: number;
  createdAt: string;
  modifiedAt: string;
  trashedAt?: string;
}

export interface ChatMessage {
  id: number;
  chatId: number;
  role: 'user' | 'model';
  content: string;
  createdAt: string;
}

export interface ChatWithMessages extends Chat {
  messages: ChatMessage[];
}

export interface ChatListResponse {
  success: boolean;
  chats: Chat[];
  total: number;
  pages: number;
}

export interface ChatResponse {
  success: boolean;
  chat?: ChatWithMessages;
  message?: string;
}

export interface ChatActionResponse {
  success: boolean;
  message?: string;
}

export class ChatsApi extends BaseApi {
  constructor() {
    super();
  }

  public async list(
    page = 1,
    perPage = 20,
    userId?: number,
  ): Promise<ChatListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (userId) {
      params.append('user_id', userId.toString());
    }

    const response = await fetch(`${this.apiEndpoint}/chats?${params}`);
    return response.json();
  }

  public async get(id: number): Promise<ChatResponse> {
    const response = await fetch(`${this.apiEndpoint}/chats/${id}`);
    return response.json();
  }

  public async chat(
    message: string,
    chatId?: number,
  ): Promise<ChatResponse> {
    const url = chatId
      ? `${this.apiEndpoint}/chats/${chatId}`
      : `${this.apiEndpoint}/chats`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    return response.json();
  }

  public async updateTitle(id: number, title: string): Promise<ChatActionResponse> {
    const response = await fetch(`${this.apiEndpoint}/chats/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    return response.json();
  }

  public async trash(id: number): Promise<ChatActionResponse> {
    const response = await fetch(`${this.apiEndpoint}/chats/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }

  public async remove(id: number): Promise<ChatActionResponse> {
    const response = await fetch(`${this.apiEndpoint}/chats/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }

  public async restore(id: number): Promise<ChatActionResponse> {
    const response = await fetch(`${this.apiEndpoint}/chats/${id}/restore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }
}

export const makeChatsApi = () => {
  return new ChatsApi();
};
