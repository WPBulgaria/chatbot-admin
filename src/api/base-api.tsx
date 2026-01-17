export class BaseApi {
  protected apiEndpoint: string;

  constructor() {
    if ((window as any).appHost) {
      this.apiEndpoint = (window as any).appHost + '/wp-json/wpb-chatbot/v1';
    } else {
      this.apiEndpoint = 'http://wpstudio.local/wp-json/wpb-chatbot/v1';
    }
  }
}