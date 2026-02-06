import { logger } from '../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface DatabaseResult {
  changes: number;
  lastInsertRowid?: number | bigint | string; // Normalized to string or number
}

export interface DatabaseAdapter {
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  get<T = any>(sql: string, params?: any[]): Promise<T | undefined>;
  run(sql: string, params?: any[]): Promise<DatabaseResult>;
  exec(sql: string): Promise<void>;
  close(): Promise<void>;
}

// SQL Parameter transformation helper
// SQLite uses '?' for all parameters.
// Postgres uses '$1', '$2', etc.
// formatting: Replace '?' with '$n' incrementally.
const transformSqlForPostgres = (sql: string): string => {
  let paramIndex = 1;
  return sql.replace(/\?/g, () => `$${paramIndex++}`);
};

class SQLiteAdapter implements DatabaseAdapter {
  private db: any;

  constructor(dbInstance: any) {
    this.db = dbInstance;
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const stmt = this.db.prepare(sql);
    return stmt.all(params) as T[];
  }

  async get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    const stmt = this.db.prepare(sql);
    return stmt.get(params) as T | undefined;
  }

  async run(sql: string, params: any[] = []): Promise<DatabaseResult> {
    const stmt = this.db.prepare(sql);
    const result = stmt.run(params);
    return {
      changes: result.changes,
      lastInsertRowid: result.lastInsertRowid
    };
  }

  async exec(sql: string): Promise<void> {
    this.db.exec(sql);
  }

  async close(): Promise<void> {
    this.db.close();
    logger.info('SQLite database closed');
  }
}

class PostgresAdapter implements DatabaseAdapter {
  private pool: any;

  constructor(poolInstance: any) {
    this.pool = poolInstance;
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const transformedSql = transformSqlForPostgres(sql);
    const result = await this.pool.query(transformedSql, params);
    return result.rows;
  }

  async get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    const transformedSql = transformSqlForPostgres(sql);
    const result = await this.pool.query(transformedSql, params);
    return result.rows[0];
  }

  async run(sql: string, params: any[] = []): Promise<DatabaseResult> {
    const transformedSql = transformSqlForPostgres(sql);
    const result = await this.pool.query(transformedSql, params);
    // Postgres `pg` returns rowCount. ID returning requires 'RETURNING id' in SQL usually.
    // For generic 'run', we mainly care about execution.
    return {
      changes: result.rowCount || 0,
      // lastInsertRowid is not automatically available in PG without RETURNING.
      // Consumers should use RETURNING clause in SQL if they need ID.
      lastInsertRowid: (result.rows[0] as any)?.id // Attempt to capture if RETURNING was used
    };
  }

  async exec(sql: string): Promise<void> {
    // PG client doesn't support multiple statements in one query() call easily unless configured,
    // but 'pg' pool.query does support simple statements. 
    // For schema creation, we might need to split or just run it.
    // transformSqlForPostgres is risky here if exec contains multiple statements? 
    // Usually exec strings don't have params anyway.
    await this.pool.query(sql);
  }

  async close(): Promise<void> {
    await this.pool.end();
    logger.info('PostgreSQL pool ended');
  }
}

let dbInstance: DatabaseAdapter;

export const initDatabase = async (): Promise<void> => {
  // Determine which DB to use
  // Priority: DATABASE_URL (PG) -> SQLite local
  const databaseUrl = process.env.DATABASE_URL;
  const isVercel = process.env.VERCEL === '1';

  if (databaseUrl) {
    // ... (PG init code unchanged)
  } else {
    // Initialize SQLite
    logger.info('Initializing SQLite connection...');
    let sqlite;
    let dbPath;
    const isProduction = process.env.NODE_ENV === 'production';

    if (!isProduction) {
      // @ts-ignore
      const Database = require('better-sqlite3');
      dbPath = path.join(__dirname, '../../../prisma/dev.db');
      logger.info(`Database path: ${dbPath}`);
      sqlite = new Database(dbPath);
    } else {
      // For production, use the original path or handle differently if needed
      const { default: Database } = await import('better-sqlite3');
      dbPath = path.join(__dirname, '../../data/pastebin.db');
      logger.info(`Database path: ${dbPath}`);
      sqlite = new Database(dbPath);
    }

    sqlite.pragma('journal_mode = WAL');

    dbInstance = new SQLiteAdapter(sqlite);
  }

  // Initialize Schema
  await createTables();
};

const createTables = async () => {
  // Note: SQLite and Postgres have slightly different syntax for some things (like DATETIME vs TIMESTAMP, AUTOINCREMENT etc).
  // We try to use compatible SQL or conditional logic.

  // SQLite: TEXT PRIMARY KEY is fine.
  // PG: TEXT PRIMARY KEY is fine.
  // DATETIME: PG calls it TIMESTAMP. SQLite is loose.
  // CURRENT_TIMESTAMP works in both.

  const isPostgres = !!process.env.DATABASE_URL;

  // Users Table
  // SQLite: id TEXT PRIMARY KEY
  // PG: id TEXT PRIMARY KEY
  await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at ${isPostgres ? 'TIMESTAMP' : 'DATETIME'} DEFAULT CURRENT_TIMESTAMP
        );
    `);

  // Pastes Table
  // SQLite can use weak types. PG needs specific types.
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

  // Indexes
  // CREATE INDEX syntax is generally compatible.
  try {
    await dbInstance.exec('CREATE INDEX IF NOT EXISTS idx_expires_at ON pastes(expires_at)');
    // Composite index might fail if created multiple times simultaneously or syntax diff, but usually fine.
    await dbInstance.exec('CREATE INDEX IF NOT EXISTS idx_composite ON pastes(id, expires_at, max_views, current_views)');
  } catch (e) {
    logger.warn('Index creation warning (might already exist): ' + e);
  }

  logger.info('Database tables initialized');

  // Run Migrations
  // Import dynamically to avoid circular issues or early execution
  const { migrateDatabase } = await import('./migration.js');
  await migrateDatabase();
};

// Export a proxy object so we can import 'db' immediately but it throws if used before init
export const db = new Proxy({} as DatabaseAdapter, {
  get: (_target, prop) => {
    if (!dbInstance) {
      throw new Error('Database accessed before initialization!');
    }
    return (dbInstance as any)[prop];
  }
});

export const disconnectDatabase = async (): Promise<void> => {
  if (dbInstance) {
    await dbInstance.close();
  }
};

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    if (!dbInstance) return false;
    await dbInstance.query('SELECT 1');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    return false;
  }
};
