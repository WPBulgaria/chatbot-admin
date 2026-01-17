export class BaseApi {
  protected apiEndpoint: string;
  protected nonce: string;

  constructor() {
    this.nonce = (window as any)?.wpbChatbotConfig?.nonce || '';

    if ((window as any)?.wpbChatbotConfig?.root) {
      this.apiEndpoint = (window as any)?.wpbChatbotConfig?.root + 'wpb-chatbot/v1';
    } else {
      this.apiEndpoint = 'http://wpstudio.local/wp-json/wpb-chatbot/v1';
    }
  }

  public getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-WP-Nonce': this.nonce,
    };
  }
}