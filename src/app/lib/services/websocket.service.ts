// socket-io-config.service.ts
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { storage } from '@lib/utils';
import { SocketIoConfig } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root',
})
export class SocketIoConfigService {
    constructor() {}

    public getConfig(): SocketIoConfig {
        const token = storage.getItem('tokenInfo');
        return {
            url: environment.apiUrl, // Replace with your server URL
            options: {
                // transports: ['polling', 'websocket'],
                extraHeaders: {
                    Authorization: `Bearer ${token?.accessToken}`, // Set headers for authentication
                },
            },
        };
    }
}
