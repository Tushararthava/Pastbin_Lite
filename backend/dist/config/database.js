import { logger } from '../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const transformSqlForPostgres = (sql) => {
    let paramIndex = 1;
    return sql.replace(/\?/g, () => `$${paramIndex++}`);
};
class SQLiteAdapter {
    db;
    constructor(dbInstance) {
        this.db = dbInstance;
    }
    async query(sql, params = []) {
        const stmt = this.db.prepare(sql);
        return stmt.all(params);
    }
    async get(sql, params = []) {
        const stmt = this.db.prepare(sql);
        return stmt.get(params);
    }
    async run(sql, params = []) {
        const stmt = this.db.prepare(sql);
        const result = stmt.run(params);
        return {
            changes: result.changes,
            lastInsertRowid: result.lastInsertRowid
        };
    }
    async exec(sql) {
        this.db.exec(sql);
    }
    async close() {
        this.db.close();
        logger.info('SQLite database closed');
    }
}
class PostgresAdapter {
    pool;
    constructor(poolInstance) {
        this.pool = poolInstance;
    }
    async query(sql, params = []) {
        const transformedSql = transformSqlForPostgres(sql);
        const result = await this.pool.query(transformedSql, params);
        return result.rows;
    }
    async get(sql, params = []) {
        const transformedSql = transformSqlForPostgres(sql);
        const result = await this.pool.query(transformedSql, params);
        return result.rows[0];
    }
    async run(sql, params = []) {
        const transformedSql = transformSqlForPostgres(sql);
        const result = await this.pool.query(transformedSql, params);
        return {
            changes: result.rowCount || 0,
            lastInsertRowid: result.rows[0]?.id
        };
    }
    async exec(sql) {
        await this.pool.query(sql);
    }
    async close() {
        await this.pool.end();
        logger.info('PostgreSQL pool ended');
    }
}
let dbInstance;
export const initDatabase = async () => {
    let databaseUrl = process.env.DATABASE_URL;
    const isVercel = process.env.VERCEL === '1';
    if (isVercel && databaseUrl && (databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1'))) {
        logger.warn('Ignored localhost DATABASE_URL in production env.');
        databaseUrl = undefined;
    }
    if (databaseUrl) {
        logger.info('Initializing PostgreSQL connection...');
        const { Pool } = await import('pg');
        const pool = new Pool({
            connectionString: databaseUrl,
            ssl: isVercel ? { rejectUnauthorized: false } : false
        });
        await pool.query('SELECT 1');
        logger.info('PostgreSQL connected successfully');
        dbInstance = new PostgresAdapter(pool);
    }
    else {
    }
    {
        const isProduction = process.env.NODE_ENV === 'production';
        if (isProduction) {
            logger.warn('DATABASE_URL is not set in production. Database features will be unavailable.');
            return;
        }
        logger.info('Initializing SQLite connection...');
        const Database = require('better-sqlite3');
        const dbPath = path.join(__dirname, '../../../prisma/dev.db');
        logger.info(`Database path: ${dbPath}`);
        const sqlite = new Database(dbPath);
        sqlite.pragma('journal_mode = WAL');
        dbInstance = new SQLiteAdapter(sqlite);
    }
};
await createTables();
;
const createTables = async () => {
    const isPostgres = !!process.env.DATABASE_URL;
    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at ${isPostgres ? 'TIMESTAMP' : 'DATETIME'} DEFAULT CURRENT_TIMESTAMP
        );
    `);
    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS pastes (
            id TEXT PRIMARY KEY,
            title TEXT,
            content TEXT NOT NULL,
            language TEXT DEFAULT 'plaintext',
            created_at ${isPostgres ? 'TIMESTAMP' : 'DATETIME'} DEFAULT CURRENT_TIMESTAMP,
            expires_at ${isPostgres ? 'TIMESTAMP' : 'DATETIME'},
            max_views INTEGER,
            current_views INTEGER DEFAULT 0,
            view_count INTEGER DEFAULT 0,
            user_id TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
    `);
    try {
        await dbInstance.exec('CREATE INDEX IF NOT EXISTS idx_expires_at ON pastes(expires_at)');
        await dbInstance.exec('CREATE INDEX IF NOT EXISTS idx_composite ON pastes(id, expires_at, max_views, current_views)');
    }
    catch (e) {
        logger.warn('Index creation warning (might already exist): ' + e);
    }
    logger.info('Database tables initialized');
    const { migrateDatabase } = await import('./migration.js');
    await migrateDatabase();
};
export const db = new Proxy({}, {
    get: (_target, prop) => {
        if (!dbInstance) {
            throw new Error('Database accessed before initialization!');
        }
        return dbInstance[prop];
    }
});
export const disconnectDatabase = async () => {
    if (dbInstance) {
        await dbInstance.close();
    }
};
export const checkDatabaseConnection = async () => {
    try {
        if (!dbInstance)
            return false;
        await dbInstance.query('SELECT 1');
        return true;
    }
    catch (error) {
        logger.error('Database connection failed:', error);
        return false;
    }
};
//# sourceMappingURL=database.js.map