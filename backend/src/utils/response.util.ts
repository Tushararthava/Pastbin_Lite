import { Response } from 'express';

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export const successResponse = <T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200
): Response => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data,
    };
    return res.status(statusCode).json(response);
};

export const errorResponse = (
    res: Response,
    message: string,
    statusCode: number = 500
): Response => {
    const response: ApiResponse = {
        success: false,
        message,
    };
    return res.status(statusCode).json(response);
};
