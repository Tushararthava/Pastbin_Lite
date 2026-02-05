import app from './app.js';
import { config } from './config/environment.js';
import { logger } from './utils/logger.js';
import { disconnectDatabase, initDatabase } from './config/database.js';

const startServer = async () => {
    try {
        await initDatabase();

        const server = app.listen(config.port, () => {
            logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
            logger.info(`Base URL: ${config.baseUrl}`);
            console.log('SERVER_STARTED_SUCCESSFULLY');
        });

        // Handle graceful shutdown
        const shutdown = async (signal: string) => {
            logger.info(`${signal} received. Starting graceful shutdown...`);

            server.close(async () => {
                logger.info('HTTP server closed');

                await disconnectDatabase();
                logger.info('Database disconnected');

                process.exit(0);
            });

            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();


process.on('unhandledRejection', (reason: any) => {
    logger.error('Unhandled Rejection:', reason);
    throw reason;
});

process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

