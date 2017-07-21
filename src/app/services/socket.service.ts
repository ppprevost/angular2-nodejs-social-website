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

  /**
   * Manage all socket function of the client app.
   * @param receiver {String} sync with the backend
   * @returns {Observable<any>|"../../Observable".Observable<any>|"../../../Observable".Observable<any>}
   */
  socketFunction(receiver: string) {
    const observable = new Observable<any>(observer => {

      this.socket.on(receiver, (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

}
