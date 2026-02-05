import app from '../app.js';
import { initDatabase } from '../config/database.js';
import { createServer } from 'http';

// Vercel serverless function handler
// We need to ensure DB is initialized before handling requests.
// In serverless, variables outside the handler are cached between invocations (warm starts).
let dbInitialized = false;

// Create HTTP server from Express app
const server = createServer(app);

export default async function handler(req: any, res: any) {
    if (!dbInitialized) {
        await initDatabase();
        dbInitialized = true;
    }

    // Use the server's request handler
    server.emit('request', req, res);
}
