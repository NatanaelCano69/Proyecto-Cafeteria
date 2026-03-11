import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private socket: Socket;
    private readonly URL = 'http://localhost:3001';

    constructor() {
        this.socket = io(this.URL, {
            transports: ['websocket', 'polling']
        });
    }

    listen(eventName: string): Observable<any> {
        return new Observable((subscriber) => {
            this.socket.on(eventName, (data) => {
                subscriber.next(data);
            });
        });
    }

    emit(eventName: string, data: any) {
        this.socket.emit(eventName, data);
    }
}
