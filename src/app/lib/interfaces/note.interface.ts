export interface CreateNotePayload {
    title: string;
    content: string;
    attachments: string[];
    collaborators: any[];
    labels: any[];
    status: string;
    isPinned: boolean;
    user: User;
    createdAt: string;
    id?: string;
}

export interface UserShare {
    username: string;
}

export interface User {
    username: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    avatarUrl: string;
    fullName: string;
    id: string;
}

export interface UserCollab {
    avatarUrl: string;
    userName: string;
}

export interface Collaborators {
    id?: string;
    collaborators: Array<String>;
}

export interface UpdateNote {
    id?: string;
    title: string;
    content: string;
}

export interface PinNote {
    id?: string;
    isPinned: boolean;
}

export interface LabelUpdate {
    noteId: string;
    labelId: string;
}
