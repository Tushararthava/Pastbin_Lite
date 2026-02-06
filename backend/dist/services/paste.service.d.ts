import type { CreatePasteDto, PasteResponse, PasteDetailResponse, PasteData } from '../types/paste.types.js';
export declare class PasteService {
    private generateId;
    createPaste(data: CreatePasteDto, userId?: string): Promise<PasteResponse>;
    getPasteById(id: string, currentTime: Date): Promise<PasteData>;
    incrementViewCount(_id: string): Promise<void>;
    formatPasteDetail(paste: PasteData): PasteDetailResponse;
    getUserPastes(userId: string): Promise<PasteData[]>;
}
//# sourceMappingURL=paste.service.d.ts.map