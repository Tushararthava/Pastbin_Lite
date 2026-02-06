export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}
export interface ErrorResponse {
    success: false;
    message: string;
}
export declare class AppError extends Error {
    message: string;
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number, isOperational?: boolean);
}
//# sourceMappingURL=common.types.d.ts.map