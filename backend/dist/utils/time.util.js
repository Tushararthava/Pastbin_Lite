import { config } from '../config/environment.js';
export const getCurrentTime = (req) => {
    if (config.testMode) {
        const testNowMs = req.headers['x-test-now-ms'];
        if (testNowMs && typeof testNowMs === 'string') {
            const timestamp = parseInt(testNowMs, 10);
            if (!isNaN(timestamp)) {
                return new Date(timestamp);
            }
        }
    }
    return new Date();
};
export const isExpired = (expiresAt, currentTime) => {
    if (!expiresAt)
        return false;
    return currentTime >= expiresAt;
};
export const calculateExpiryDate = (ttlSeconds) => {
    const now = new Date();
    return new Date(now.getTime() + ttlSeconds * 1000);
};
//# sourceMappingURL=time.util.js.map