import { db } from '../config/database.js';
import { logger } from '../utils/logger.js';

/**
 * Migration script to add title, language, and view_count columns to existing pastes table
 */
export function migrateDatabase(): void {
    try {
        // Check if columns exist
        const tableInfo = db.prepare("PRAGMA table_info(pastes)").all() as any[];
        const columnNames = tableInfo.map((col: any) => col.name);

        // Add title column if it doesn't exist
        if (!columnNames.includes('title')) {
            db.exec('ALTER TABLE pastes ADD COLUMN title TEXT');
            logger.info('Added title column to pastes table');
        }

        // Add language column if it doesn't exist
        if (!columnNames.includes('language')) {
            db.exec("ALTER TABLE pastes ADD COLUMN language TEXT DEFAULT 'plaintext'");
            logger.info('Added language column to pastes table');
        }

        // Add view_count column if it doesn't exist
        if (!columnNames.includes('view_count')) {
            db.exec('ALTER TABLE pastes ADD COLUMN view_count INTEGER DEFAULT 0');
            logger.info('Added view_count column to pastes table');
        }


        // Add user_id column if it doesn't exist
        if (!columnNames.includes('user_id')) {
            db.exec('ALTER TABLE pastes ADD COLUMN user_id TEXT');
            db.exec('CREATE INDEX IF NOT EXISTS idx_user_id ON pastes(user_id)');
            logger.info('Added user_id column to pastes table');
        }

        logger.info('Database migration completed successfully');
    } catch (error) {
        logger.error('Error during database migration:', error);
        throw error;
    }
}
