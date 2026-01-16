import { BaseApi } from './base-api';
import type { KnowledgeBaseFile } from '../types/knowledge-base';

export class FilesApi extends BaseApi {
  constructor() {
    super();
  }

  public async list(page = 1, limit = 10): Promise<{ files: KnowledgeBaseFile[], total: number, pages: number }> {
    const response = await fetch(`${this.apiEndpoint}/files?page=${page}&per_page=${limit}`);
    return response.json();
  }

  public async upload(file: File): Promise<{ success: boolean; file?: KnowledgeBaseFile; message?: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.apiEndpoint}/files`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  }

  public async remove(id: string): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${this.apiEndpoint}/files/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }
}

export const makeFilesApi = () => {
  return new FilesApi();
};
