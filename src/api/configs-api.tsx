import { BaseApi } from "./base-api";
import { Configs } from "../types/configs";

export class ConfigsApi extends BaseApi {
  constructor() {
    super();
  }

  public async get() {
    const response = await fetch(`${this.apiEndpoint}/configs`);
    return response.json() as Promise<Configs>;
  }

  public async store(data: Configs) {
    const response = await fetch(`${this.apiEndpoint}/configs`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }

  public async testConnection(data: Configs) {
    const response = await fetch(`${this.apiEndpoint}/configs/test-connection`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }
}

export const makeConfigsApi = () => {
  return new ConfigsApi();
}