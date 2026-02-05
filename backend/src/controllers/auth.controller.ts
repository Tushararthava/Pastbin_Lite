import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { successResponse } from '../utils/response.util.js';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.authService.register(req.body);
            successResponse(res, 'User registered successfully', result, 201);
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.authService.login(req.body);
            successResponse(res, 'Login successful', result);
        } catch (error) {
            next(error);
        }
    };

    me = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        // @ts-ignore - user is attached by auth middleware
        const user = req.user;
        successResponse(res, 'User info retrieved', { user });
    };
}
