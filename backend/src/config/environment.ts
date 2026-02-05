import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    databaseUrl: string;
    baseUrl: string;
    testMode: boolean;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

export const config: Config = {
    port: parseInt(getEnvVar('PORT', '3000'), 10),
    nodeEnv: getEnvVar('NODE_ENV', 'development'),
    databaseUrl: getEnvVar('DATABASE_URL'),
    baseUrl: getEnvVar('BASE_URL', 'http://localhost:3000'),
    testMode: getEnvVar('TEST_MODE', '0') === '1',
};
