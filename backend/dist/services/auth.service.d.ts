import type { CreateUserDto, LoginDto, AuthResponse } from '../types/auth.types.js';
export declare class AuthService {
    register(data: CreateUserDto): Promise<AuthResponse>;
    login(data: LoginDto): Promise<AuthResponse>;
    private generateToken;
}
//# sourceMappingURL=auth.service.d.ts.map