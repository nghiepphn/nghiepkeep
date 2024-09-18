import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    HostListener,
    inject,
    Injectable,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
    Collaborators,
    CreateNotePayload,
    LabelUpdate,
    PinNote,
    UpdateNote,
    User,
} from '@lib/interfaces/note.interface';
import { NoteService } from '@lib/services/note/note.service';
import { AppTheme, ThemeService } from '@lib/services/theme';
import { Socket } from 'ngx-socket-io';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject, Subscription } from 'rxjs';

import { CreateLabel, Label } from '@lib/interfaces/label.interface';
import { LabelService } from '@lib/services/label/label.service';
import { SocketIoConfigService } from '@lib/services/websocket.service';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { TruncatePipe } from '../../lib/utils/truncate/truncate.pipe';
@Component({
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, TruncatePipe, AutocompleteLibModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [
        {
            provide: Socket,
            useFactory: (configService: SocketIoConfigService) => {
                const config = configService.getConfig();
                return new Socket(config);
            },
            deps: [SocketIoConfigService],
        },
    ],
})
@Injectable()
export class HomeComponent implements OnInit, OnDestroy {
    private socket = inject(Socket);

    noteFormUpdate: FormGroup<{
        id: FormControl<string | null>;
        title: FormControl<string | null>;
        content: FormControl<string | null>;
    }>;

    formShare: FormGroup<{
        userName: FormControl<string | null>;
    }>;

    noteFormUpdateCollab: FormGroup<{
        id: FormControl<string | null>;
        collaborators: FormControl<string | null>;
    }>;

    noteFormUpdatePin: FormGroup<{
        id: FormControl<string | null>;
        isPinned: any;
    }>;

    constructor(
        private formBuilder: FormBuilder,
        private noteService: NoteService,
        private toastr: ToastrService, // private socket: Socket, // private authService: AuthService,
        private cdr: ChangeDetectorRef,
        private labelService: LabelService,
    ) {
        this.noteFormUpdate = this.formBuilder.group({
            id: [''],
            title: [''],
            content: [''],
        });

        this.formShare = this.formBuilder.group({
            userName: [''],
        });
        this.noteFormUpdateCollab = this.formBuilder.group({
            id: [''],
            collaborators: [''],
        });

        this.noteFormUpdatePin = this.formBuilder.group({
            id: [''],
            isPinned: Boolean,
        });
    }
    currentTheme!: AppTheme | null;

    private readonly _themeService = inject(ThemeService);

    private readonly _destroy$ = new Subject();

    private modelChanged: Subject<string> = new Subject<string>();

    private subscription!: Subscription;

    // private topicSubscription!: Subscription;

    debounceTime = 500;

    noteForm: any;

    labelForm: any;

    listNote: CreateNotePayload[] = [];

    listPinNote: CreateNotePayload[] = [];

    listLabels: Label[] = [];

    listUser: User[] = [];

    isLoading = false;

    isLoadingUpdate = false;

    isLoadingCollabUpdate = false;

    hiddenNote = '';

    listCollab: Collaborators = {
        id: '',
        collaborators: [],
    };

    receivedMessages: string[] = [];

    connectionStatus!: string;

    listUserCollab: User[] = [];

    listUserCollabOfNote: User[] = [];

    listUserCollabOfNoteDefault: User[] = [];

    listLabel: LabelUpdate = {
        noteId: '',
        labelId: '',
    };

    // isPresent = this.listPinNote.some(function(el){ return el.id === 2});

    ngOnInit(): void {
        this.noteForm = this.formBuilder.group({
            title: [''],
            content: [''],
        });

        this.labelForm = this.formBuilder.group({
            name: [''],
        });

        this.loadAllNote();

        this.subscription = this.modelChanged.pipe(debounceTime(this.debounceTime)).subscribe((res) => {
            this.loadUser(res);
        });

        this.loadAllLabels();

        // this.socket.on('notification', (data: any) => {
        //     console.log('Received:', data);
        // });

        // this.socket.emit('notification', { msg: 'Hello Server!' });

        // this.socket.fromEvent('notification').subscribe((data: any) => {});
        this.socket.on('notification', (message: any) => {
            console.log('Message from server:', message);
        });
    }

    // getMessage() {
    //     console.log('123');
    //     return this.socket.fromEvent('notification').pipe(map((data: any) => data.msg));
    // }

    // this.socket.ioSocket['auth'] = { token: this.authService.getToken()?.accessToken };

    functionToBeCalled() {
        throw new Error('Method not implemented.');
    }

    autoResizeTextarea(textarea: any) {
        if (textarea.value.trim() === '') {
            textarea.style.height = '20px';
        }
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    loadAllNote() {
        this.noteService.getListNotes().subscribe({
            next: (res: any) => {
                this.listPinNote = [];
                this.listNote = [];
                for (const element of res.results) {
                    if (element.isPinned) {
                        this.listPinNote.push(element);
                    } else {
                        this.listNote.push(element);
                    }
                }
                this.sortNote(this.listNote);
                this.sortNote(this.listPinNote);
            },
        });
    }

    ngOnDestroy(): void {
        this._destroy$.complete();
        this._destroy$.unsubscribe();
        // this.subscription.unsubscribe();
        // this.topicSubscription.unsubscribe();
    }

    handleThemeChange(theme: AppTheme): void {
        this._themeService.setTheme(theme);
    }

    hiddenTitle = '';

    hiddenForm = 'display: none';
    showForm() {
        this.hiddenForm = '';
        this.hiddenTitle = 'display: none';
    }

    onSave() {
        this.isLoading = true;

        const value = this.noteForm.value as Required<CreateNotePayload>;

        if (value.title == '' && value.content == '') {
            this.hiddenForm = 'display: none';
            this.hiddenTitle = '';
            this.isLoading = false;
            return;
        }
        this.noteService.createNote(value).subscribe({
            next: (res: any) => {
                this.loadAllNote();
                this.noteForm.reset();
                this.hiddenForm = 'display: none';
                this.hiddenTitle = '';
                this.isLoading = false;
            },
        });
    }

    onSaveUpdate() {
        this.isLoadingUpdate = true;
        const value = this.noteFormUpdate.value as Required<UpdateNote>;
        console.log(value);
        this.noteService.updateNote(value).subscribe({
            next: (res: any) => {
                console.log(value);
                this.noteFormUpdate.reset();
                document?.getElementById('btnCLick')?.click();
                this.hiddenTitle = '';
                this.isLoadingUpdate = false;
                this.loadAllNote();
            },
        });
    }

    isHiddeNote = 'note';

    editNote(index: number) {
        {
            this.mouseHoverIndex = index;
        }
    }

    mouseHoverIndex: number | null = null;

    mouseHoverIndexPinNote: number | null = null;

    mouseEnter(index: number) {
        this.mouseHoverIndex = index;
    }

    mouseLeave() {
        this.mouseHoverIndex = null;
    }

    mouseEnterPinNote(index: number) {
        this.mouseHoverIndexPinNote = index;
    }

    mouseLeavePinNote() {
        this.mouseHoverIndexPinNote = null;
    }

    @ViewChild('popupEditNote') popupEditNote: any;

    showModal(note: CreateNotePayload) {
        if (note.id) {
            this.noteFormUpdate.controls.id.setValue(note.id);
            this.noteFormUpdate.controls.title.setValue(note.title);
            this.noteFormUpdate.controls.content.setValue(note.content);
            this.popupEditNote.nativeElement.showModal();
        }
    }

    @ViewChild('popupShare') popupShare: any;

    showModalShare(note: CreateNotePayload) {
        this.popupShare.nativeElement.showModal();
        this.listCollab.id = note.id;
        if (note.id != undefined) {
            this.noteService.getNote(note.id).subscribe({
                next: (res: any) => {
                    this.listUserCollabOfNote = res.collaborators;
                    this.listUserCollabOfNoteDefault = this.listUserCollabOfNote;
                },
            });
        }
    }

    clickMoreIndex: number | null = null;

    moreOption(index: number) {
        this.clickMoreIndex = index;
    }

    delete(id: any) {
        this.noteService.deleteNote(id).subscribe({
            next: () => {
                this.loadAllNote();
            },
        });
    }

    onShare() {
        let user1;
        for (let user of this.listUserCollab) {
            user1 = user;
        }
        this.listCollab.collaborators = [];
        if (user1?.id != undefined || this.listUserCollabOfNoteDefault !== this.listUserCollabOfNote) {
            for (const user of this.listUserCollab) {
                this.listCollab.collaborators.push(user.id);
            }

            for (const user of this.listUserCollabOfNote) {
                this.listCollab.collaborators.push(user.id);
            }

            this.noteService.updateCollaborators(this.listCollab).subscribe({
                next: (res: any) => {
                    this.isLoadingCollabUpdate = false;
                    document?.getElementById('btnCloseCollabCLick')?.click();
                    this.listUserCollab = [];
                    this.toastr.success('Success');
                    this.autocomplete.clear();
                    this.listUserCollabOfNote = [];
                },
                error: (err) => {},
            });
        } else {
            this.isLoadingCollabUpdate = false;
            document?.getElementById('btnCloseCollabCLick')?.click();
            this.toastr.error('User not found');
            this.autocomplete.clear();
        }
    }

    cancelCollab() {
        this.isLoadingCollabUpdate = false;
        this.listUserCollab = [];
        document?.getElementById('btnCloseCollabCLick')?.click();
        this.autocomplete.clear();
    }

    loadUser(value: any) {
        this.noteService.getUser(value).subscribe({
            next: (res: any) => {
                this.listUser = res.results;
                this.cdr.detectChanges();
            },
        });
    }

    changed(event: any) {
        this.modelChanged.next(event);
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.formShare.reset();
    }

    chooseUser() {
        console.log('123');
    }

    sortNote(listNote: CreateNotePayload[]): any {
        if (listNote) {
            return listNote.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    }

    pinNote(note: CreateNotePayload) {
        if (note.id) {
            this.noteFormUpdatePin.controls.id.setValue(note.id);
            this.noteFormUpdatePin.controls.isPinned.setValue(!note.isPinned);
            const value = this.noteFormUpdatePin.value as Required<PinNote>;
            console.log(value);
            this.noteService.updatePinNote(value).subscribe({
                next: (res: any) => {
                    this.loadAllNote();
                },
            });
        }
    }

    keyword = 'name';
    data = [];

    selectEvent(item: any) {
        const validUserCollab = this.listUserCollabOfNote.find((user) => user.username == item.username);

        if (validUserCollab == null) {
            const validUser = this.listUserCollab.find((user) => user.username == item.username);

            if (validUser == null) {
                this.listUserCollab?.push(item);
                this.autocomplete.clear();
            } else {
                this.autocomplete.clear();
            }
        } else {
            this.autocomplete.clear();
        }
    }

    onChangeSearch(val: string) {
        this.modelChanged.next(val);
    }

    onFocused(e: any) {
        // do something when input is focused
    }

    @ViewChild('autocomplete') autocomplete: any;

    deleteUser(id: String) {
        this.listUserCollab = this.listUserCollab.filter((user) => user.id !== id);
    }

    deleteUserCooperated(id: string) {
        this.listUserCollabOfNote = this.listUserCollabOfNote.filter((user) => user.id !== id);
    }

    myFunction(event: any) {
        debugger;
        var input, filter, ul, li, la, i, txtValue;

        input = document.getElementById('myInput') as HTMLInputElement;
        filter = input.value.toUpperCase();
        ul = document.getElementById('myUL');
        if (ul != null) {
            li = ul.getElementsByTagName('li');

            for (i = 0; i < li.length; i++) {
                la = li[i].getElementsByTagName('label')[0];
                txtValue = la.textContent || la.innerText;

                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = '';
                } else {
                    li[i].style.display = 'none';
                }
            }
        }
    }

    createLabel() {
        const label = this.labelForm.value as Required<CreateLabel>;
        this.labelService.createLabel(label).subscribe({
            next: (res: any) => {
                console.log(res);
            },
        });
        this.loadAllLabels();
    }

    loadAllLabels() {
        this.labelService.getListLabels().subscribe({
            next: (res: any) => {
                this.listLabels = res.results;
            },
        });
    }

    addLabel(label: Label, id: string | undefined) {
        if (id) {
            this.listLabel.noteId = id;
            this.listLabel.labelId = label.id;
            this.noteService.addLabel(this.listLabel).subscribe({
                next: (res: any) => {
                    console.log(res);
                },
            });
        }
    }
}
