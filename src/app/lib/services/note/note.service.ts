import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import {} from '@lib/interfaces/label.interface';
import { Collaborators, CreateNotePayload, LabelUpdate, PinNote, UpdateNote } from '@lib/interfaces/note.interface';
import { storage } from '@lib/utils';
import { BehaviorSubject } from 'rxjs';

const apiUrl = environment.apiUrl;

@Injectable({
    providedIn: 'root',
})
export class NoteService {
    constructor(private httpClient: HttpClient) {}
    isAuthenticated$ = new BehaviorSubject<boolean>(!!storage.getItem('tokenInfo'));

    createNote(payload: CreateNotePayload) {
        return this.httpClient.post(apiUrl + 'notes', payload);
    }

    getListNotes() {
        return this.httpClient.get(apiUrl + 'notes?limit=100');
    }

    getNote(id: string) {
        return this.httpClient.get(apiUrl + 'notes/' + id);
    }

    updateNote(payload: UpdateNote) {
        const value = Object.assign({}, payload);
        delete value.id;
        return this.httpClient.patch(apiUrl + 'notes/' + payload.id, value);
    }

    deleteNote(id: string) {
        return this.httpClient.delete(apiUrl + 'notes/' + id);
    }

    getUser(username: string) {
        return this.httpClient.get(`${apiUrl}users?username=${username || ''}`);
    }

    updateCollaborators(collaborators: Collaborators) {
        const value = Object.assign({}, collaborators);
        delete value.id;
        return this.httpClient.patch(apiUrl + 'notes/' + collaborators.id, value);
    }

    updatePinNote(pinNote: PinNote) {
        const value = Object.assign({}, pinNote);
        delete value.id;
        return this.httpClient.patch(apiUrl + 'notes/' + pinNote.id, value);
    }
    addLabel(label: LabelUpdate) {
        return this.httpClient.post(apiUrl + 'notes/' + label.noteId + '/labels/' + label.labelId, null);
    }

    deleteLabel(label: LabelUpdate) {
        return this.httpClient.delete(apiUrl + 'notes/' + label.noteId + '/labels/' + label.labelId);
    }
}
