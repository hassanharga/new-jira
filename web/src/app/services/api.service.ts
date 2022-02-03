import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, last, map, Observable, tap, throwError } from 'rxjs';
import { ServiceData, ServiceKeys, services } from '../constants/end-points';
import { LocalizationService } from './localization.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private localization: LocalizationService) {}

  private get(service: ServiceData) {
    return { url: environment.url + service.url, type: service.type };
  }

  public send<T>(serviceName: ServiceKeys, payload: Record<string, unknown> = {}): Observable<T> {
    if (!services[serviceName]) return EMPTY;
    const service: ServiceData = { ...services[serviceName] };
    let afterReplace: string;
    let v: any;
    afterReplace = '';
    for (const option of Object.keys(payload)) {
      v = payload[option];
      afterReplace = service.url.replace(new RegExp(`{${option}}`, 'm'), v);
      if (service.url !== afterReplace) {
        delete payload[option];
        service.url = afterReplace;
      }
    }
    const options = this.get(service);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
    };

    const lang = this.localization.getLanguageFromStorage();

    const token = localStorage.getItem('token');

    if (token) {
      headers['authorization'] = `Bearer ${token}`;
    }

    return this.http
      .request<T>(
        new HttpRequest(options.type, options.url, options.type !== 'GET' ? payload : {}, {
          headers: new HttpHeaders({
            ...headers,
          }),
          params: new HttpParams({
            fromObject: options.type === 'GET' ? { ...payload, lang } : { lang },
          }),
        }),
      )
      .pipe(
        map(this.getResponseData),
        last(), // return last (completed) message to caller
        tap((data) => console.log(`api[${serviceName}]`, data)), // TODO remove logs,
        catchError((err) => throwError(() => err.error)),
      );
  }

  /** Return distinct message for sent, upload progress, & response events */
  private getResponseData(e: HttpEvent<any>) {
    switch (e.type) {
      case HttpEventType.Response:
        return e.body;
      default:
        return e;
    }
  }

  // private handleError(error: HttpErrorResponse) {
  //   if (error.status === 0) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong.
  //     console.error(`Backend returned code ${error.status}, body was: `, error.error);
  //   }
  //   // Return an observable with a user-facing error message.
  //   return throwError(() => 'Something bad happened; please try again later.');
  // }
}
