import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { CreateLabel } from '@lib/interfaces/label.interface';
import { Collaborators, PinNote, UpdateNote } from '@lib/interfaces/note.interface';
import { storage } from '@lib/utils';
import { BehaviorSubject } from 'rxjs';

const apiUrl = environment.apiUrl;

@Injectable({
    providedIn: 'root',
})
export class LabelService {
    constructor(private httpClient: HttpClient) {}
    isAuthenticated$ = new BehaviorSubject<boolean>(!!storage.getItem('tokenInfo'));

    createLabel(label: CreateLabel) {
        return this.httpClient.post(apiUrl + 'labels', label);
    }

    getListLabels() {
        return this.httpClient.get(apiUrl + 'labels?limit=100');
    }

    getLabel(id: string) {
        return this.httpClient.get(apiUrl + 'labels/' + id);
    }

    updateLabel(payload: UpdateNote) {
        const value = Object.assign({}, payload);
        delete value.id;
        return this.httpClient.patch(apiUrl + 'labels/' + payload.id, value);
    }

    deleteLabel(id: string) {
        return this.httpClient.delete(apiUrl + 'labels/' + id);
    }

    getUser(username: string) {
        return this.httpClient.get(`${apiUrl}users?username=${username || ''}`);
    }

    updateCollaborators(collaborators: Collaborators) {
        const value = Object.assign({}, collaborators);
        delete value.id;
        return this.httpClient.patch(apiUrl + 'labels/' + collaborators.id, value);
    }

    updatePinLabel(pinLabel: PinNote) {
        const value = Object.assign({}, pinLabel);
        delete value.id;
        return this.httpClient.patch(apiUrl + 'labels/' + pinLabel.id, value);
    }
}
