import { db } from '../config/database.js';
import type { CreatePasteDto, PasteResponse, PasteDetailResponse, PasteData } from '../types/paste.types.js';
import { AppError } from '../types/common.types.js';
import { calculateExpiryDate, isExpired } from '../utils/time.util.js';
import { config } from '../config/environment.js';
import { logger } from '../utils/logger.js';
import { randomBytes } from 'crypto';

export class PasteService {
    private generateId(): string {
        return randomBytes(12).toString('base64url');
    }

    async createPaste(data: CreatePasteDto, userId?: string): Promise<PasteResponse> {
        const { title, content, language, ttl_seconds, max_views, expiration } = data;

        const id = this.generateId();

        // Handle expiration from either ttl_seconds or expiration string
        let expiresAt: string | null = null;
        if (ttl_seconds) {
            expiresAt = calculateExpiryDate(ttl_seconds).toISOString();
        } else if (expiration && expiration !== 'never') {
            // Convert expiration string to seconds
            const expirationMap: Record<string, number> = {
                '10m': 600,
                '1h': 3600,
                '1d': 86400,
                '1w': 604800,
                '1M': 2592000
            };
            const seconds = expirationMap[expiration];
            if (seconds) {
                expiresAt = calculateExpiryDate(seconds).toISOString();
            }
        }

        const stmt = db.prepare(`
      INSERT INTO pastes (id, title, content, language, expires_at, max_views, current_views, view_count, user_id)
      VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?)
    `);

        try {
            stmt.run(id, title ?? null, content, language ?? 'plaintext', expiresAt, max_views ?? null, userId ?? null);
            logger.info(`Paste created: ${id} (User: ${userId || 'Anonymous'})`);

            const url = `${config.baseUrl}/p/${id}`;

            return {
                id,
                url,
            };
        } catch (error) {
            logger.error('Error creating paste:', error);
            throw new AppError('Failed to create paste', 500);
        }
    }

    async getPasteById(id: string, currentTime: Date): Promise<PasteData> {
        // Atomic update and fetch:
        // Increment view_count only if:
        // 1. Paste exists
        // 2. View limit not reached (max_views IS NULL OR view_count < max_views)
        // 3. Not expired (expires_at IS NULL OR expires_at > now)
        const stmt = db.prepare(`
            UPDATE pastes
            SET view_count = view_count + 1
            WHERE id = ?
              AND (max_views IS NULL OR view_count < max_views)
              AND (expires_at IS NULL OR expires_at > ?)
            RETURNING id, title, content, language, created_at, expires_at, max_views, current_views, view_count
        `);

        try {
            const row = stmt.get(id, currentTime.toISOString()) as any;

            if (!row) {
                // If update returned nothing, it's either missing, expired, or limit reached.
                // In all these cases, we return 404 as per requirements.
                throw new AppError('Paste not found', 404);
            }

            const paste: PasteData = {
                id: row.id,
                title: row.title,
                content: row.content,
                language: row.language || 'plaintext',
                created_at: new Date(row.created_at),
                expires_at: row.expires_at ? new Date(row.expires_at) : null,
                max_views: row.max_views,
                current_views: row.current_views, // This database column is unused/deprecated in favor of view_count
                view_count: row.view_count || 0,
            };

            return paste;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Error fetching paste:', error);
            throw new AppError('Failed to fetch paste', 500);
        }
    }

    async incrementViewCount(_id: string): Promise<void> {
        // No-op: View count is now incremented atomically in getPasteById
    }

    formatPasteDetail(paste: PasteData): PasteDetailResponse {
        const remaining_views = paste.max_views !== null
            ? Math.max(0, paste.max_views - paste.current_views - 1)
            : null;

        const expires_at = paste.expires_at ? paste.expires_at.toISOString() : null;

        return {
            content: paste.content,
            remaining_views,
            expires_at,
        };
    }
    async getUserPastes(userId: string): Promise<PasteData[]> {
        const stmt = db.prepare(`
            SELECT id, title, content, language, created_at, expires_at, max_views, current_views, view_count
            FROM pastes
            WHERE user_id = ?
            ORDER BY created_at DESC
        `);

        try {
            const rows = stmt.all(userId) as any[];

            return rows.map(row => ({
                id: row.id,
                title: row.title,
                content: row.content,
                language: row.language || 'plaintext',
                created_at: new Date(row.created_at),
                expires_at: row.expires_at ? new Date(row.expires_at) : null,
                max_views: row.max_views,
                current_views: row.current_views,
                view_count: row.view_count || 0
            }));
        } catch (error) {
            logger.error('Error fetching user pastes:', error);
            throw new AppError('Failed to fetch user pastes', 500);
        }
    }
}
