import { Injectable } from '@angular/core';
import { ChatMessageDto } from '../models/chatMessageDto';
import { NotifierService } from 'angular-notifier';
import { Subject } from 'rxjs';
import { switchMap, retryWhen, delay } from 'rxjs/operators';
import makeWebSocketObservable from 'rxjs-websockets';

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

  input$ = new Subject<string>();

  socket$ = makeWebSocketObservable(
    'wss://localhost:8000'
  );

  MessageSource = new Subject<string>();
  Message$ = this.MessageSource.asObservable();

  messages$ = this.socket$.pipe(
    switchMap((getResponses) => getResponses(this.input$)),
    retryWhen((errors) => errors.pipe(delay(2000)))
  );

  onWebSocket() {
    this.messages$.subscribe((res) => {
      console.log(res);

      let data: string = res as string;
      data = JSON.parse(data);

      let resTestID = data[0]['payload']?.test_id;
      this.notifier.notify('success', 'You are awesome! I mean it!');

      console.log(JSON.stringify(resTestID, null, 2));

      this.MessageSource.next(resTestID);
    });
  }

  public openWebSocket() {
    this.webSocket = new WebSocket(
      'wss://predaid.blockappsai.com/ws/stream/cervic'
    );
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
