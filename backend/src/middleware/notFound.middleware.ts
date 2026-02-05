import { Request, Response } from 'express';
import { errorResponse } from '../utils/response.util.js';

export const notFoundHandler = (req: Request, res: Response): void => {
    errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};
