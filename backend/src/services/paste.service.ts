import { db } from '../config/database.js';
import { CreatePasteDto, PasteResponse, PasteDetailResponse, PasteData } from '../types/paste.types.js';
import { AppError } from '../types/common.types.js';
import { calculateExpiryDate, isExpired } from '../utils/time.util.js';
import { config } from '../config/environment.js';
import { logger } from '../utils/logger.js';
import { randomBytes } from 'crypto';

export class PasteService {
    private generateId(): string {
        return randomBytes(12).toString('base64url');
    }

    async createPaste(data: CreatePasteDto): Promise<PasteResponse> {
        const { content, ttl_seconds, max_views } = data;

        const id = this.generateId();
        const expiresAt = ttl_seconds ? calculateExpiryDate(ttl_seconds).toISOString() : null;

        const stmt = db.prepare(`
      INSERT INTO pastes (id, content, expires_at, max_views, current_views)
      VALUES (?, ?, ?, ?, 0)
    `);

        try {
            stmt.run(id, content, expiresAt, max_views ?? null);
            logger.info(`Paste created: ${id}`);

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
        const stmt = db.prepare(`
      SELECT id, content, created_at, expires_at, max_views, current_views
      FROM pastes
      WHERE id = ?
    `);

        try {
            const row = stmt.get(id) as any;

            if (!row) {
                throw new AppError('Paste not found', 404);
            }

            const paste: PasteData = {
                id: row.id,
                content: row.content,
                createdAt: new Date(row.created_at),
                expiresAt: row.expires_at ? new Date(row.expires_at) : null,
                maxViews: row.max_views,
                currentViews: row.current_views,
            };

            if (isExpired(paste.expiresAt, currentTime)) {
                throw new AppError('Paste not found', 404);
            }

            if (paste.maxViews !== null && paste.currentViews >= paste.maxViews) {
                throw new AppError('Paste not found', 404);
            }

            return paste;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Error fetching paste:', error);
            throw new AppError('Failed to fetch paste', 500);
        }
    }

    async incrementViewCount(id: string): Promise<void> {
        const stmt = db.prepare(`
      UPDATE pastes
      SET current_views = current_views + 1
      WHERE id = ?
    `);

        try {
            stmt.run(id);
        } catch (error) {
            logger.error('Error incrementing view count:', error);
        }
    }

    formatPasteDetail(paste: PasteData): PasteDetailResponse {
        const remaining_views = paste.maxViews !== null
            ? Math.max(0, paste.maxViews - paste.currentViews - 1)
            : null;

        const expires_at = paste.expiresAt ? paste.expiresAt.toISOString() : null;

        return {
            content: paste.content,
            remaining_views,
            expires_at,
        };
    }
}
