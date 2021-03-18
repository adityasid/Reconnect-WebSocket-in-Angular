import { Injectable } from '@angular/core';
import { ChatMessageDto } from '../models/chatMessageDto';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  webSocket: WebSocket;
  chatMessages: ChatMessageDto[] = [];
  testVariable: any = 'initialize';

  /**
   * Notifier service
   */
  private notifier: NotifierService;

  constructor(notifier: NotifierService) {
    this.notifier = notifier;
  }

  public openWebSocket() {
    this.webSocket = new WebSocket('wss://localhost:8000');

    this.webSocket.onopen = (event) => {
      console.log('Open: ', event);
    };

    this.webSocket.onmessage = (event: any) => {
      console.log(event);

      let data = {
        user: 'user',
        message: 'message',
      };

      this.testVariable = 'setData';

      this.notifier.notify('success', 'You are awesome! I mean it!');

      const chatMessageDto = data;
      this.chatMessages.push(chatMessageDto);
    };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
    };
  }

  public sendMessage(chatMessageDto: ChatMessageDto) {
    this.webSocket.send(JSON.stringify(chatMessageDto));
  }

  public closeWebSocket() {
    this.webSocket.close();
  }
}
