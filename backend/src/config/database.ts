import Database from 'better-sqlite3';
import { logger } from '../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../data/pastebin.db');

const db: Database.Database = new Database(dbPath);
db.pragma('journal_mode = WAL');

const createTables = () => {
    const createTableSQL = `
    CREATE TABLE IF NOT EXISTS pastes (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      max_views INTEGER,
      current_views INTEGER DEFAULT 0
    )
  `;

    const createIndexes = `
    CREATE INDEX IF NOT EXISTS idx_expires_at ON pastes(expires_at);
    CREATE INDEX IF NOT EXISTS idx_composite ON pastes(id, expires_at, max_views, current_views);
  `;

    try {
        db.exec(createTableSQL);
        db.exec(createIndexes);
        logger.info('Database tables created successfully');
    } catch (error) {
        logger.error('Error creating tables:', error);
        throw error;
    }
};

createTables();

export const checkDatabaseConnection = async (): Promise<boolean> => {
    try {
        const result = db.prepare('SELECT 1 as test').get();
        logger.debug('Database query successful:', result);
        return true;
    } catch (error: any) {
        logger.error('Database connection failed:', {
            message: error.message,
        });
        return false;
    }
};

export const disconnectDatabase = async (): Promise<void> => {
    db.close();
    logger.info('Database connection closed');
};

export { db };
