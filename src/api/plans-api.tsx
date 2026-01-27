import { PlanPeriod } from "../types/plan";
import { BaseApi } from "./base-api";
import { Plan } from "../types/plan";

export interface PlanInput {
  name: string;
  numberOfChats: number;
  numberOfQuestions: number;
  questionSizeInWords: number;
  historyItemsLimit: number;
  planPeriod: PlanPeriod;
}

export class PlansApi extends BaseApi {
  constructor() {
    super();
  }

  public async get(chatbotId: number): Promise<{ plans: Plan[], success: boolean, message?: string }> {
    const endpoint =  `${this.apiEndpoint}/chatbots/${chatbotId}/plans`
 
    const response = await fetch(endpoint, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  public async post(data: Plan, chatbotId: number) {
    const endpoint = `${this.apiEndpoint}/chatbots/${chatbotId}/plans`
    
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: this.getHeaders(),
    });
    return response.json();
  }

  public async update(data: Plan, chatbotId: number) {
    const endpoint = `${this.apiEndpoint}/chatbots/${chatbotId}/plans/${data.id}`
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: this.getHeaders(),
    });
    return response.json();
  }

  public async delete(id: string, chatbotId: number) { 
    const endpoint = `${this.apiEndpoint}/chatbots/${chatbotId}/plans/${id}`
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  public async view(id: string, chatbotId: number) {
    const endpoint = `${this.apiEndpoint}/chatbots/${chatbotId}/plans/${id}`
    
    const response = await fetch(endpoint, {
      headers: this.getHeaders(),
    });
    return response.json() as Promise<Plan>;
  }
}

export const makePlansApi = () => {
  return new PlansApi();
}