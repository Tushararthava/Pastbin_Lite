export interface User {
    id: string;
    username: string;
    password?: string;
    created_at?: Date;
}

export interface CreateUserDto {
    username: string;
    password: string;
}

export interface LoginDto {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        username: string;
    };
}
