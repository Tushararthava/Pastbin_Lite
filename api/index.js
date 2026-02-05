// Import the compiled Express app
module.exports = async function handler(req, res) {
    try {
        // Dynamically import the ES module
        const { default: app } = await import('../backend/dist/app.js');
        const { initDatabase } = await import('../backend/dist/config/database.js');
        const http = await import('http');

        // Initialize database once
        if (!global.dbInitialized) {
            console.log('Initializing database...');
            await initDatabase();
            global.dbInitialized = true;
            console.log('Database initialized');
        }

        // Create server and handle request
        const server = http.createServer(app);
        server.emit('request', req, res);
    } catch (error) {
        console.error('Handler error:', error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
};
