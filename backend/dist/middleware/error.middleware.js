import { AppError } from '../types/common.types.js';
import { logger } from '../utils/logger.js';
import { errorResponse } from '../utils/response.util.js';
export const errorHandler = (err, req, res, _next) => {
    if (err instanceof AppError) {
        logger.error(`Operational Error: ${err.message}`, {
            statusCode: err.statusCode,
            path: req.path,
            method: req.method,
        });
        errorResponse(res, err.message, err.statusCode);
        return;
    }
    logger.error('Unexpected Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    errorResponse(res, 'Internal server error', 500);
};
//# sourceMappingURL=error.middleware.js.map