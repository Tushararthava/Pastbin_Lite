import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response.util.js';

export const validateCreatePaste = [
    body('title')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Title must be less than 100 characters'),

    body('language')
        .optional()
        .trim(),

    body('expiration')
        .optional()
        .isIn(['never', '10m', '1h', '1d', '1w', '1M'])
        .withMessage('Invalid expiration format'),

    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required and must be a non-empty string'),

    body('max_views')
        .optional()
        .isInt({ min: 1 })
        .withMessage('max_views must be an integer >= 1'),

    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg).join(', ');
            errorResponse(res, errorMessages, 400);
            return;
        }
        next();
    },
];
