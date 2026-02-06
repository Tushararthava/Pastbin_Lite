export interface DatabaseResult {
    changes: number;
    lastInsertRowid?: number | bigint | string;
}
export interface DatabaseAdapter {
    query<T = any>(sql: string, params?: any[]): Promise<T[]>;
    get<T = any>(sql: string, params?: any[]): Promise<T | undefined>;
    run(sql: string, params?: any[]): Promise<DatabaseResult>;
    exec(sql: string): Promise<void>;
    close(): Promise<void>;
}
export declare const initDatabase: () => Promise<void>;
export declare const db: DatabaseAdapter;
export declare const disconnectDatabase: () => Promise<void>;
export declare const checkDatabaseConnection: () => Promise<boolean>;
//# sourceMappingURL=database.d.ts.map