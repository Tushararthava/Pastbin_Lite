import { AuthService } from '../services/auth.service.js';
import { successResponse } from '../utils/response.util.js';
export class AuthController {
    authService;
    constructor() {
        this.authService = new AuthService();
    }
    register = async (req, res, next) => {
        try {
            const result = await this.authService.register(req.body);
            successResponse(res, 'User registered successfully', result, 201);
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const result = await this.authService.login(req.body);
            successResponse(res, 'Login successful', result);
        }
        catch (error) {
            next(error);
        }
    };
    me = async (req, res, _next) => {
        const user = req.user;
        successResponse(res, 'User info retrieved', { user });
    };
}
//# sourceMappingURL=auth.controller.js.map