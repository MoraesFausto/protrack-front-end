import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class APIService {
    private readonly baseUrl: string = 'http://localhost:8080';

    constructor(private http: HttpClient) {}

    get<T>(endpoint: string, params?: any): Observable<T> {
        const url = this.getApiUrl(endpoint);
        return this.http.get<T>(url, { params: this.createParams(params) }).pipe(catchError(this.handleError));
    }

    post<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<T> {
        const url = this.getApiUrl(endpoint);
        return this.http.post<T>(url, body, options).pipe(catchError(this.handleError));
    }

    put<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<T> {
        const url = this.getApiUrl(endpoint);
        return this.http.put<T>(url, body, options).pipe(catchError(this.handleError));
    }

    delete<T>(endpoint: string, options?: { headers?: HttpHeaders }): Observable<T> {
        const url = this.getApiUrl(endpoint);
        return this.http.delete<T>(url, options).pipe(catchError(this.handleError));
    }

    private getApiUrl(endpoint: string): string {
        return `${this.baseUrl}/${endpoint}`;
    }

    private createParams(params?: any): HttpParams {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach((key) => {
                httpParams = httpParams.append(key, params[key]);
            });
        }
        return httpParams;
    }

    private handleError(error: HttpResponse<any> | any) {
        let errorMessage = 'Ocorreu um erro';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else if (error.status) {
            errorMessage = `Erro: ${error.status}\nMensagem: ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
