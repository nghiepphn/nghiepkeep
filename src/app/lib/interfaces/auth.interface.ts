export interface LoginPayload {
    username: string;
    password: string;
}
export interface RegisterPayload {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string;
}
export interface TokenValue {
    user: UserInfo;
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    expiresDate: string;
    refreshToken: string;
    refreshExpiresIn: number;
    refreshExpiresDate: string;
}
export interface UserInfo {
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
