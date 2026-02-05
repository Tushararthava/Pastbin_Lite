import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../types/common.types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-env';

export interface AuthUser {
    id: string;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Only throw if route requires auth. For optional auth, middleware might be different.
        // Assuming this middleware is for PROTECTED routes.
        return next(new AppError('No token provided', 401));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
        req.user = decoded;
        next();
    } catch (error) {
        return next(new AppError('Invalid or expired token', 401));
    }
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
            req.user = decoded;
        } catch (error) {
            // Ignore invalid token for optional auth
        }
    }
    next();
};
