import { Request, Response, NextFunction } from 'express';
import { checkDatabaseConnection } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.util.js';

export class HealthController {
    async healthCheck(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dbHealthy = await checkDatabaseConnection();

            if (dbHealthy) {
                successResponse(res, 'OK', { ok: true });
            } else {
                errorResponse(res, 'Database connection failed', 503);
            }
        } catch (error) {
            next(error);
        }
    }
}
