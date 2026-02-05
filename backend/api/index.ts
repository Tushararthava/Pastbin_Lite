import app from '../src/app.js';
import { initDatabase } from '../src/config/database.js';

// Vercel serverless function handler
// We need to ensure DB is initialized before handling requests.
// In serverless, variables outside the handler are cached between invocations (warm starts).
let dbInitialized = false;

export default async function handler(req: any, res: any) {
    if (!dbInitialized) {
        await initDatabase();
        dbInitialized = true;
    }

    // Forward to Express app
    app(req, res);
}
