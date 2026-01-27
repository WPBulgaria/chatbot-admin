import { BaseApi } from './base-api';
import type { KnowledgeBaseFile } from '../types/knowledge-base';

export class FilesApi extends BaseApi {
  constructor() {
    super();
  }

  public async list(page = 1, limit = 10, chatbotId?: number): Promise<{ files: KnowledgeBaseFile[], total: number, pages: number }> {
    const endpoint = chatbotId
      ? `${this.apiEndpoint}/chatbots/${chatbotId}/files?page=${page}&per_page=${limit}`
      : `${this.apiEndpoint}/files?page=${page}&per_page=${limit}`;
    
    const response = await fetch(endpoint, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  public async upload(file: File, chatbotId?: number): Promise<{ success: boolean; file?: KnowledgeBaseFile; message?: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};

    if (this.nonce) {
      headers['X-WP-Nonce'] = this.nonce;
    }

    const endpoint = chatbotId
      ? `${this.apiEndpoint}/chatbots/${chatbotId}/files`
      : `${this.apiEndpoint}/files`;

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: headers,
    });
    return response.json();
  }

  public async remove(id: string, chatbotId?: number): Promise<{ success: boolean; message?: string }> {
    const endpoint = chatbotId
      ? `${this.apiEndpoint}/chatbots/${chatbotId}/files/${id}`
      : `${this.apiEndpoint}/files/${id}`;
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  public async use(id: string, chatbotId?: number): Promise<{ success: boolean; message?: string }> {
    const endpoint = chatbotId
      ? `${this.apiEndpoint}/chatbots/${chatbotId}/files/${id}/use`
      : `${this.apiEndpoint}/files/${id}/use`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    return response.json();
  }
}

export const makeFilesApi = () => {
  return new FilesApi();
};
