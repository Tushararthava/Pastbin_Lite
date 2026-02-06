export const successResponse = (res, message, data, statusCode = 200) => {
    const response = {
        success: true,
        message,
        data,
    };
    return res.status(statusCode).json(response);
};
export const errorResponse = (res, message, statusCode = 500) => {
    const response = {
        success: false,
        message,
    };
    return res.status(statusCode).json(response);
};
//# sourceMappingURL=response.util.js.map