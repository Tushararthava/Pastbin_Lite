import app from '../app.js';
import { initDatabase } from '../config/database.js';
import { createServer } from 'http';

// Vercel serverless function handler
let dbInitialized = false;
const server = createServer(app);

export default async function handler(req: any, res: any) {
    if (!dbInitialized) {
        await initDatabase();
        dbInitialized = true;
    }

    server.emit('request', req, res);
}
