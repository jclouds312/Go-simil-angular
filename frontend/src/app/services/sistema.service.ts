import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SistemaService {

  constructor(private socketService: SocketService) {}

  version(parametros:any) {
    this.socketService.emit('version', parametros);
  }

  getVersion(): Observable<any[]> {
    return this.socketService.on('version');
  }
}
