export interface Plan {
  id: string;
  name: string;
  numberOfChats: number;
  numberOfQuestions: number;
  questionSizeInWords: number;
  historyItemsLimit: number;
  createdAt: Date;
}

export interface CreatePlanInput {
  name: string;
  numberOfChats: string;
  numberOfQuestions: string;
  questionSizeInWords: string;
  historyItemsLimit: string;
}

