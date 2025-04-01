export interface User {
    id: string;
    email: string;
    fullName: string,
    phoneNumber: string;
    role: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    message: string | null;
}

export type Response = {
    user: null,
    isSuccess: boolean;
    message: string;
}