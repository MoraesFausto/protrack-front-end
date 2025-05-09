// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { APIService } from './api.service';
import { EmployeeService } from './employee.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private currentUser$ = new BehaviorSubject<string | null>(null);

    constructor(private apiService: APIService) {
        this.initializeAuthState();
    }

    login(username: string, password: string): Observable<{ token: string }> {
        return this.apiService.post<{ token: string }>('auth/login', { username, password }).pipe(
            tap((response) => {
                this.storeToken(response.token);
                this.currentUser$.next(username);
            })
        );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        this.currentUser$.next(null);
    }

    get currentUser(): Observable<string | null> {
        return this.currentUser$.asObservable();
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isLoggedIn(): boolean {
        const token = this.getToken();

        if (!token || this.isTokenExpired(token)) {
            this.logout();
            return false;
        }

        return true;
    }

    private isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiresAt = payload.exp * 1000;
            return Date.now() >= expiresAt;
        } catch (e) {
            return true;
        }
    }

    private storeToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    private initializeAuthState(): void {
        const token = this.getToken();
        if (token) {
            this.currentUser$.next('Usuário Autenticado');
        }
    }
}
