import { Request, Response, NextFunction } from 'express';
import { PasteService } from '../services/paste.service.js';
import type { CreatePasteDto } from '../types/paste.types.js';
import { successResponse } from '../utils/response.util.js';
import { getCurrentTime } from '../utils/time.util.js';
import { generatePasteHtml, generate404Html } from '../utils/paste.view.js';
import { AppError } from '../types/common.types.js';

export class PasteController {
    private pasteService: PasteService;

    constructor() {
        this.pasteService = new PasteService();
    }

    createPaste = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data: CreatePasteDto = req.body;
            // @ts-ignore - user attached by optionalAuth middleware
            const userId = req.user?.id;

            const result = await this.pasteService.createPaste(data, userId);
            // Assignment Spec requires direct JSON response: { "id": "...", "url": "..." }
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    getPaste = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const currentTime = getCurrentTime(req);

            // getPasteById now atomically increments view count
            const paste = await this.pasteService.getPasteById(id as string, currentTime);

            const response = this.pasteService.formatPasteDetail(paste);
            // Assignment Spec requires direct JSON: { "content": "...", "remaining_views": ..., "expires_at": ... }
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    viewPaste = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const currentTime = getCurrentTime(req);

            const paste = await this.pasteService.getPasteById(id as string, currentTime);

            // Prepare data for HTML template
            const pasteData = {
                id: paste.id,
                title: paste.title,
                content: paste.content,
                language: paste.language,
                createdAt: paste.created_at.toISOString(),
                expiresAt: paste.expires_at ? paste.expires_at.toISOString() : null,
                views: paste.view_count
            };

            const html = generatePasteHtml(pasteData);

            res.status(200).send(html);
        } catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                const html = generate404Html('Paste not found');
                res.status(404).send(html);
                return;
            }
            next(error);
        }
    };
    getMyPastes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // @ts-ignore - user is attached by auth middleware
            const userId = req.user?.id;

            if (!userId) {
                // Should be caught by middleware, but safe guard
                throw new AppError('User not authenticated', 401);
            }

            const pastes = await this.pasteService.getUserPastes(userId);
            successResponse(res, 'User pastes retrieved', pastes);
        } catch (error) {
            next(error);
        }
    };
}
