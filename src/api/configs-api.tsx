import { BaseApi } from "./base-api";
import { Configs } from "../types/configs";

export class ConfigsApi extends BaseApi {
  constructor() {
    super();
  }

  public async get(chatbotId: number): Promise<{ configs: Configs, success: boolean, message?: string }> {
    const endpoint = `${this.apiEndpoint}/chatbots/${chatbotId}/config`
    
    const response = await fetch(endpoint, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  public async store(data: Configs, chatbotId: number) {
    const endpoint = `${this.apiEndpoint}/chatbots/${chatbotId}/config`
    
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: this.getHeaders(),
    });
    return response.json();
  }

  public async testConnection(data: Configs, chatbotId: number) {
    const endpoint = `${this.apiEndpoint}/chatbots/${chatbotId}/config/test-connection`
    
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data), 
      headers: this.getHeaders(),
    });
    return response.json();
  }
}

export const makeConfigsApi = () => {
  return new ConfigsApi();
}