import jwt from 'jsonwebtoken';
import { AppError } from '../types/common.types.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-env';
export const authenticate = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('No token provided', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return next(new AppError('Invalid or expired token', 401));
    }
};
export const optionalAuth = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        }
        catch (error) {
        }
    }
    next();
};
//# sourceMappingURL=auth.middleware.js.map