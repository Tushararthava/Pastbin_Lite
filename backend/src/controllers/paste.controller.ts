import { Request, Response, NextFunction } from 'express';
import { PasteService } from '../services/paste.service.js';
import { CreatePasteDto } from '../types/paste.types.js';
import { successResponse } from '../utils/response.util.js';
import { getCurrentTime } from '../utils/time.util.js';
import { generatePasteHtml, generate404Html } from '../views/paste.view.js';
import { AppError } from '../types/common.types.js';

export class PasteController {
    private pasteService: PasteService;

    constructor() {
        this.pasteService = new PasteService();
    }

    createPaste = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data: CreatePasteDto = req.body;
            const result = await this.pasteService.createPaste(data);
            successResponse(res, 'Paste created successfully', result, 201);
        } catch (error) {
            next(error);
        }
    };

    getPaste = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const currentTime = getCurrentTime(req);

            const paste = await this.pasteService.getPasteById(id as string, currentTime);

            await this.pasteService.incrementViewCount(id as string);

            const response = this.pasteService.formatPasteDetail(paste);
            successResponse(res, 'Paste retrieved successfully', response);
        } catch (error) {
            next(error);
        }
    };

    viewPaste = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const currentTime = getCurrentTime(req);

            const paste = await this.pasteService.getPasteById(id as string, currentTime);

            await this.pasteService.incrementViewCount(id as string);

            const detail = this.pasteService.formatPasteDetail(paste);
            const html = generatePasteHtml(detail.content, detail.remaining_views, detail.expires_at);

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
}
