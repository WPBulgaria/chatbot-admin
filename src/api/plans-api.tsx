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

  public async get() {
    const response = await fetch(`${this.apiEndpoint}/plans`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  public async post(data: Plan) {
    const response = await fetch(`${this.apiEndpoint}/plans`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: this.getHeaders(),
    });
    return response.json();
  }

  public async update(data: Plan) {
    const response = await fetch(`${this.apiEndpoint}/plans/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: this.getHeaders(),
    });
    return response.json();
  }

  public async delete(id: string) { 
    const response = await fetch(`${this.apiEndpoint}/plans/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  public async view(id: string) {
    const response = await fetch(`${this.apiEndpoint}/plans/${id}`, {
      headers: this.getHeaders(),
    });
    return response.json() as Promise<Plan>;
  }
}

export const makePlansApi = () => {
  return new PlansApi();
}