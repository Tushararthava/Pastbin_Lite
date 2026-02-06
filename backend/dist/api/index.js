import app from '../app.js';
import { initDatabase } from '../config/database.js';
import { createServer } from 'http';
let dbInitialized = false;
const server = createServer(app);
export default async function handler(req, res) {
    if (!dbInitialized) {
        await initDatabase();
        dbInitialized = true;
    }
    server.emit('request', req, res);
}
//# sourceMappingURL=index.js.map