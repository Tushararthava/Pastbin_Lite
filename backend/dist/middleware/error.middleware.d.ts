import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/common.types.js';
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map