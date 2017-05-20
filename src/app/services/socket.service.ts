import {Injectable} from '@angular/core';
import * as sio from 'socket.io-client';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SocketService {
  socket: SocketIOClient.Socket;

  constructor() {
    this.socket = sio({
      path: '/socket.io'
    });
  }

  getMessages() {
    let observable = new Observable(observer => {

      this.socket.on('getNewPost', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  connect() {
    let observable = new Observable(observer => {

      this.socket.on('connect', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  socketFunction(receiver: string) {
    let observable = new Observable<any>(observer => {

      this.socket.on(receiver, (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

}
