import { errorResponse } from '../utils/response.util.js';
export const notFoundHandler = (req, res) => {
    errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};
//# sourceMappingURL=notFound.middleware.js.map