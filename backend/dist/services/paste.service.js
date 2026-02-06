import { db } from '../config/database.js';
import { AppError } from '../types/common.types.js';
import { calculateExpiryDate } from '../utils/time.util.js';
import { config } from '../config/environment.js';
import { logger } from '../utils/logger.js';
import { randomBytes } from 'crypto';
export class PasteService {
    generateId() {
        return randomBytes(12).toString('base64url');
    }
    async createPaste(data, userId) {
        const { title, content, language, ttl_seconds, max_views, expiration } = data;
        const id = this.generateId();
        let expiresAt = null;
        if (ttl_seconds) {
            expiresAt = calculateExpiryDate(ttl_seconds).toISOString();
        }
        else if (expiration && expiration !== 'never') {
            const expirationMap = {
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
        try {
            await db.run(`
                INSERT INTO pastes (id, title, content, language, expires_at, max_views, current_views, view_count, user_id)
                VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?)
            `, [id, title ?? null, content, language ?? 'plaintext', expiresAt, max_views ?? null, userId ?? null]);
            logger.info(`Paste created: ${id} (User: ${userId || 'Anonymous'})`);
            const url = `${config.baseUrl}/p/${id}`;
            return {
                id,
                url,
            };
        }
        catch (error) {
            logger.error('Error creating paste:', error);
            throw new AppError('Failed to create paste', 500);
        }
    }
    async getPasteById(id, currentTime) {
        const sql = `
            UPDATE pastes
            SET view_count = view_count + 1
            WHERE id = ?
              AND (max_views IS NULL OR view_count < max_views)
              AND (expires_at IS NULL OR expires_at > ?)
            RETURNING id, title, content, language, created_at, expires_at, max_views, current_views, view_count
        `;
        try {
            const row = await db.get(sql, [id, currentTime.toISOString()]);
            if (!row) {
                throw new AppError('Paste not found', 404);
            }
            const paste = {
                id: row.id,
                title: row.title,
                content: row.content,
                language: row.language || 'plaintext',
                created_at: new Date(row.created_at),
                expires_at: row.expires_at ? new Date(row.expires_at) : null,
                max_views: row.max_views,
                current_views: row.current_views,
                view_count: row.view_count || 0,
            };
            return paste;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Error fetching paste:', error);
            throw new AppError('Failed to fetch paste', 500);
        }
    }
    async incrementViewCount(_id) {
    }
    formatPasteDetail(paste) {
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
    async getUserPastes(userId) {
        const sql = `
            SELECT id, title, content, language, created_at, expires_at, max_views, current_views, view_count
            FROM pastes
            WHERE user_id = ?
            ORDER BY created_at DESC
        `;
        try {
            const rows = await db.query(sql, [userId]);
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
        }
        catch (error) {
            logger.error('Error fetching user pastes:', error);
            throw new AppError('Failed to fetch user pastes', 500);
        }
    }
}
//# sourceMappingURL=paste.service.js.map