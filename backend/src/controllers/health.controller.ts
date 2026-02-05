import { Request, Response, NextFunction } from 'express';
import { checkDatabaseConnection } from '../config/database.js';
import { errorResponse } from '../utils/response.util.js';

export class HealthController {
    async healthCheck(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dbHealthy = await checkDatabaseConnection();

            if (dbHealthy) {
                // Assignment Spec requires: { "ok": true }
                res.status(200).json({ ok: true });
            } else {
                errorResponse(res, 'Database connection failed', 503);
            }
        } catch (error) {
            next(error);
        }
    }
}
