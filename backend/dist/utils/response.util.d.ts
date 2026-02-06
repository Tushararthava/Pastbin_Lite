import { Response } from 'express';
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}
export declare const successResponse: <T>(res: Response, message: string, data?: T, statusCode?: number) => Response;
export declare const errorResponse: (res: Response, message: string, statusCode?: number) => Response;
//# sourceMappingURL=response.util.d.ts.map