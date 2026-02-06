import { db } from '../config/database.js';
import { logger } from '../utils/logger.js';
export async function migrateDatabase() {
    try {
        const isPostgres = !!process.env.DATABASE_URL;
        let columnNames = [];
        if (isPostgres) {
            const rows = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'pastes'");
            columnNames = rows.map(r => r.column_name);
        }
        else {
            const rows = await db.query("PRAGMA table_info(pastes)");
            columnNames = rows.map(r => r.name);
        }
        logger.info(`Existing columns: ${columnNames.join(', ')}`);
        if (!columnNames.includes('title')) {
            await db.exec('ALTER TABLE pastes ADD COLUMN title TEXT');
            logger.info('Added title column to pastes table');
        }
        if (!columnNames.includes('language')) {
            await db.exec("ALTER TABLE pastes ADD COLUMN language TEXT DEFAULT 'plaintext'");
            logger.info('Added language column to pastes table');
        }
        if (!columnNames.includes('view_count')) {
            await db.exec('ALTER TABLE pastes ADD COLUMN view_count INTEGER DEFAULT 0');
            logger.info('Added view_count column to pastes table');
        }
        if (!columnNames.includes('user_id')) {
            await db.exec('ALTER TABLE pastes ADD COLUMN user_id TEXT');
            await db.exec('CREATE INDEX IF NOT EXISTS idx_user_id ON pastes(user_id)');
            logger.info('Added user_id column to pastes table');
        }
        logger.info('Database migration completed successfully');
    }
    catch (error) {
        logger.error('Error during database migration:', error);
    }
}
//# sourceMappingURL=migration.js.map