import dotenv from 'dotenv';
dotenv.config();
const getEnvVar = (key, defaultValue) => {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};
export const config = {
    port: parseInt(getEnvVar('PORT', '3000'), 10),
    nodeEnv: getEnvVar('NODE_ENV', 'development'),
    databaseUrl: process.env.DATABASE_URL || '',
    baseUrl: getEnvVar('BASE_URL', 'http://localhost:3000'),
    testMode: getEnvVar('TEST_MODE', '0') === '1',
};
//# sourceMappingURL=environment.js.map