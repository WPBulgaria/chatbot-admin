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
    chatbotId: number,
    userId?: number,
  ): Promise<ChatListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (userId) {
      params.append('user_id', userId.toString());
    }

    const endpoint = `${this.apiEndpoint}/chatbots/${chatbotId}/chats?${params}`
  

    const response = await fetch(endpoint, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  public async get(id: number, chatbotId: number): Promise<ChatResponse> {
    const endpoint = `${this.apiEndpoint}/chatbots/${chatbotId}/chats/${id}`;
    
    const response = await fetch(endpoint, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  public async chat(
    message: string,
    chatbotId: number,
    chatId?: number,

  ): Promise<ChatResponse> {
   
    
    const endpoint = `${this.apiEndpoint}/chatbots/${chatbotId}/chats/${chatId}`
    

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ message }),
    });

    return response.json();
  }

  public async updateTitle(id: number, title: string, chatbotId: number): Promise<ChatActionResponse> {
    const endpoint = `${this.apiEndpoint}/chatbots/${chatbotId}/chats/${id}`;
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ title }),
    });

    return response.json();
  }

  public async trash(id: number, chatbotId: number): Promise<ChatActionResponse> {
    const endpoint = `${this.apiEndpoint}/chatbots/${chatbotId}/chats/${id}`;
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: this.getHeaders(),
    }); 

    return response.json();
  }

  public async remove(id: number, chatbotId: number): Promise<ChatActionResponse> {
    const endpoint = `${this.apiEndpoint}/chatbots/${chatbotId}/chats/${id}`;
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: this.getHeaders(),
    }); 

    return response.json();
  }

  public async restore(id: number, chatbotId: number): Promise<ChatActionResponse> {
    const endpoint = `${this.apiEndpoint}/chatbots/${chatbotId}/chats/${id}/restore`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    return response.json();
  }
}

export const makeChatsApi = () => {
  return new ChatsApi();
};
