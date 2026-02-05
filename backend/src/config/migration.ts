import { db } from '../config/database.js';
import { logger } from '../utils/logger.js';

/**
 * Migration script to add title, language, and view_count columns to existing pastes table
 */
export async function migrateDatabase(): Promise<void> {
    try {
        const isPostgres = !!process.env.DATABASE_URL;
        let columnNames: string[] = [];

        if (isPostgres) {
            // Postgres - check information_schema
            // Note: table_name in PG is usually lowercase
            const rows = await db.query<{ column_name: string }>(
                "SELECT column_name FROM information_schema.columns WHERE table_name = 'pastes'"
            );
            columnNames = rows.map(r => r.column_name);
        } else {
            // SQLite - use PRAGMA
            // Adapter might not support run('PRAGMA...') via query well depending on implementation, 
            // but our SQLiteAdapter uses .all() which works for PRAGMA.
            const rows = await db.query<{ name: string }>("PRAGMA table_info(pastes)");
            columnNames = rows.map(r => r.name);
        }

        logger.info(`Existing columns: ${columnNames.join(', ')}`);

        // Add title column if it doesn't exist
        if (!columnNames.includes('title')) {
            await db.exec('ALTER TABLE pastes ADD COLUMN title TEXT');
            logger.info('Added title column to pastes table');
        }

        // Add language column if it doesn't exist
        if (!columnNames.includes('language')) {
            // PG allows DEFAULT 'plaintext'.
            await db.exec("ALTER TABLE pastes ADD COLUMN language TEXT DEFAULT 'plaintext'");
            logger.info('Added language column to pastes table');
        }

        // Add view_count column if it doesn't exist
        if (!columnNames.includes('view_count')) {
            await db.exec('ALTER TABLE pastes ADD COLUMN view_count INTEGER DEFAULT 0');
            logger.info('Added view_count column to pastes table');
        }

        // Add user_id column if it doesn't exist
        if (!columnNames.includes('user_id')) {
            await db.exec('ALTER TABLE pastes ADD COLUMN user_id TEXT');
            await db.exec('CREATE INDEX IF NOT EXISTS idx_user_id ON pastes(user_id)');
            logger.info('Added user_id column to pastes table');
        }

        logger.info('Database migration completed successfully');
    } catch (error) {
        logger.error('Error during database migration:', error);
        // Don't throw, just log. Migration failure shouldn't always crash app if it's already migrated.
        // But for new deployments it might be critical.
        // throw error; 
    }
}
