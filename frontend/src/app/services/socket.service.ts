import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  urlSocket:string = "";
  public connectionError$ = new BehaviorSubject<string | null>(null);

  constructor() {
    this.urlSocket = environment.urlSocket;
    this.socket = io(this.urlSocket);

    this.socket.on('connect', () => {
      //console.log('Connected to server');
      this.connectionError$.next(null);
    });

    this.socket.on('connect_error', (error) => {
      //console.error('Connection error:', error);
      this.connectionError$.next('Error en Conexion');
    });

    this.socket.on('disconnect', () => {
      //console.log('Disconnected from server');
    });
  }
  
  // Método para emitir eventos al servidor
  emit(event: string, data: any) {
    data["token"] = "1";
    data["dispositivo"] = "1";
    data["ip"] = "1";
    this.socket.emit(event, data);
}

  // Método para escuchar eventos del servidor
  on(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });
    });
  }

  // Método para desconectar el socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }  
}
