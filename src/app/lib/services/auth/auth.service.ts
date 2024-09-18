import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { LoginPayload, RegisterPayload, TokenValue } from '@lib/interfaces';
import { storage } from '@lib/utils/storage/storage.utils';
import { BehaviorSubject } from 'rxjs';

const apiUrl = environment.apiUrl;

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private httpClient: HttpClient) {}
    isAuthenticated$ = new BehaviorSubject<boolean>(!!storage.getItem('tokenInfo'));

    get isAuthenticated(): boolean {
        return this.isAuthenticated$.getValue();
    }

    setToken(tokenInfo: any) {
        storage.setItem('tokenInfo', tokenInfo);
        this.isAuthenticated$.next(true);
    }

    getToken() {
        return storage.getItem('tokenInfo');
    }

    login(payload: LoginPayload) {
        return this.httpClient.post<TokenValue>(apiUrl + 'auth/login', payload);
    }

    logout(): void {
        storage.removeItem('tokenInfo');
        this.isAuthenticated$.next(false);
    }

    register(payload: RegisterPayload) {
        return this.httpClient.post(apiUrl + 'auth/register', payload);
    }

    getMe() {
        return this.httpClient.get(apiUrl + 'me');
    }

    getListUsers() {
        return this.httpClient.get(apiUrl + 'users');
    }
}
