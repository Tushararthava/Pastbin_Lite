import { PasteService } from '../services/paste.service.js';
import { successResponse } from '../utils/response.util.js';
import { getCurrentTime } from '../utils/time.util.js';
import { generatePasteHtml, generate404Html } from '../utils/paste.view.js';
import { AppError } from '../types/common.types.js';
export class PasteController {
    pasteService;
    constructor() {
        this.pasteService = new PasteService();
    }
    createPaste = async (req, res, next) => {
        try {
            const data = req.body;
            const userId = req.user?.id;
            const result = await this.pasteService.createPaste(data, userId);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    getPaste = async (req, res, next) => {
        try {
            const { id } = req.params;
            const currentTime = getCurrentTime(req);
            const paste = await this.pasteService.getPasteById(id, currentTime);
            const response = this.pasteService.formatPasteDetail(paste);
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    };
    viewPaste = async (req, res, next) => {
        try {
            const { id } = req.params;
            const currentTime = getCurrentTime(req);
            const paste = await this.pasteService.getPasteById(id, currentTime);
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
        }
        catch (error) {
            if (error instanceof AppError && error.statusCode === 404) {
                const html = generate404Html('Paste not found');
                res.status(404).send(html);
                return;
            }
            next(error);
        }
    };
    getMyPastes = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError('User not authenticated', 401);
            }
            const pastes = await this.pasteService.getUserPastes(userId);
            successResponse(res, 'User pastes retrieved', pastes);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=paste.controller.js.map