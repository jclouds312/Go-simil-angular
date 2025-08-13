import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VariableGlobalService {
  private globalIdLogin: BehaviorSubject<any> = new BehaviorSubject<any>("");
  private globalUsuario: BehaviorSubject<any> = new BehaviorSubject<any>("");

  constructor() { }

  getIdLogin(): Observable<any> {
    return this.globalIdLogin.asObservable();
  }
  setIdLogin(value: any): void {
    this.globalIdLogin.next(value);
  }
  getIdLoginValor(): any {
    return this.globalIdLogin.value;
  }

  setUsuario(value: any): void {
    this.globalUsuario.next(value);
  }
  getUsuario(): any {
    return this.globalUsuario.asObservable();
  }
  getUsuarioValor(): any {
    return this.globalUsuario.value;
  }
}
