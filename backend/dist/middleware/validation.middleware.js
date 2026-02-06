import { validationResult } from 'express-validator';
import { AppError } from '../types/common.types.js';
export const validate = (req, _res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const message = errors.array().map(err => err.msg).join(', ');
        throw new AppError(message, 400);
    }
    next();
};
//# sourceMappingURL=validation.middleware.js.map