import { Request, Response, NextFunction } from 'express';
export declare class PasteController {
    private pasteService;
    constructor();
    createPaste: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPaste: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    viewPaste: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMyPastes: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=paste.controller.d.ts.map