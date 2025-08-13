import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {

  constructor(private socketService: SocketService) {}

  agregarPreguntadosPartida(parametros:any) {
    this.socketService.emit('agregarPreguntadosPartida', parametros);
  }

  getAgregarPreguntadosPartida(): Observable<any[]> {
    return this.socketService.on('agregarPreguntadosPartida');
  }

  unirsePreguntadosPartida(parametros:any) {
    this.socketService.emit('unirsePreguntadosPartida', parametros);
  }

  getUnirsePreguntadosPartida(): Observable<any[]> {
    return this.socketService.on('unirsePreguntadosPartida');
  }

  confirmaPreguntadosPartida(parametros:any) {
    this.socketService.emit('confirmaPreguntadosPartida', parametros);
  }

  getConfirmaPreguntadosPartida(): Observable<any[]> {
    return this.socketService.on('confirmaPreguntadosPartida');
  }

  iniciaPreguntadosPartida(parametros:any) {
    this.socketService.emit('iniciaPreguntadosPartida', parametros);
  }

  getIniciaPreguntadosPartida(): Observable<any[]> {
    return this.socketService.on('iniciaPreguntadosPartida');
  }

  cancelarPreguntadosPartida(parametros:any) {
    this.socketService.emit('cancelarPreguntadosPartida', parametros);
  }

  getCancelarPreguntadosPartida(): Observable<any[]> {
    return this.socketService.on('cancelarPreguntadosPartida');
  }

  preguntaPreguntadosPartida(parametros:any) {
    this.socketService.emit('preguntaPreguntadosPartida', parametros);
  }

  getPreguntaPreguntadosPartida(): Observable<any[]> {
    return this.socketService.on('preguntaPreguntadosPartida');
  }

  respuestaPreguntadosPartida(parametros:any) {
    this.socketService.emit('respuestaPreguntadosPartida', parametros);
  }

  getRespuestaPreguntadosPartida(): Observable<any[]> {
    return this.socketService.on('respuestaPreguntadosPartida');
  }

  finalizaPreguntadosPartida(parametros:any) {
    this.socketService.emit('finalizaPreguntadosPartida', parametros);
  }

  getFinalizaPreguntadosPartida(): Observable<any[]> {
    return this.socketService.on('finalizaPreguntadosPartida');
  }

  listaPreguntadosPartidaByEstadoJuego(parametros:any) {
    this.socketService.emit('listaPreguntadosPartidaByEstadoJuego', parametros);
  }

  getListaPreguntadosPartidaByEstadoJuego(): Observable<any[]> {
    return this.socketService.on('listaPreguntadosPartidaByEstadoJuego');
  }

  verificaPreguntadosPartidaByLogin(parametros:any) {
    this.socketService.emit('verificaPreguntadosPartidaByLogin', parametros);
  }

  getVerificaPreguntadosPartidaByLogin(): Observable<any[]> {
    return this.socketService.on('verificaPreguntadosPartidaByLogin');
  }

  verificaJugadorPreguntadosPartidaByLogin(parametros:any) {
    this.socketService.emit('verificaJugadorPreguntadosPartidaByLogin', parametros);
  }

  getVerificaJugadorPreguntadosPartidaByLogin(): Observable<any[]> {
    return this.socketService.on('verificaJugadorPreguntadosPartidaByLogin');
  }
  
  verificaTodosJugadorPreguntadosPartidaByLogin(parametros:any) {
    this.socketService.emit('verificaTodosJugadorPreguntadosPartidaByLogin', parametros);
  }

  getVerificaTodosJugadorPreguntadosPartidaByLogin(): Observable<any[]> {
    return this.socketService.on('verificaTodosJugadorPreguntadosPartidaByLogin');
  }


  // ------------------***********------------------------------
  getPreguntadosPartidaSolicitaUnirse(): Observable<any[]> {
    return this.socketService.on('preguntadosPartidaSolicitaUnirse');
  }

  getPreguntadosPartidaIniciar(): Observable<any[]> {
    return this.socketService.on('preguntadosPartidaIniciar');
  }

  getRespuestaValidandoPreguntadosPartida(): Observable<any[]> {
    return this.socketService.on('respuestaValidandoPreguntadosPartida');
  }
}
