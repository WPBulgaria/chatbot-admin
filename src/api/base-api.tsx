export class BaseApi {
  protected apiEndpoint: string;

  constructor() {
    this.apiEndpoint = process.env.NODE_ENV === 'development' ? 'http://wpstudio.local/wp-json/wpb-chatbot/v1' : 'https://wpbulgaria.com/wp-json/wpb-chatbot/v1';
  }
}