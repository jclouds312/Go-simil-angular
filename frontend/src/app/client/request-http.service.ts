import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestHttpService {

  private url:string = "";
  
  constructor(private httpClient: HttpClient) {
    this.url = environment.url;
  }

  public postRequest(endpoint: string, body: any): Observable<any> {
    const fullUrl = `${this.url}${endpoint}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.httpClient.post(fullUrl, body, {
      headers,
      observe: 'response' as 'response'
    }).pipe(
      map((response: HttpResponse<any>) => ({
        ok: true,
        status: response.status,
        body: response.body
      })),
      catchError((error: HttpErrorResponse) => of({
        ok: false,
        status: error.status,
        message: error.message,
        error: error.error
      }))
    );
  }
}
