interface PasteData {
    id: string;
    title?: string | null;
    content: string;
    language: string;
    createdAt: string;
    expiresAt: string | null;
    views: number;
}
export declare function generatePasteHtml(data: PasteData): string;
export declare function generate404Html(message?: string): string;
export {};
//# sourceMappingURL=paste.view.d.ts.map