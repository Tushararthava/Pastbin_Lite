export interface CreatePasteDto {
    content: string;
    ttl_seconds?: number;
    max_views?: number;
}

export interface PasteResponse {
    id: string;
    url: string;
}

export interface PasteDetailResponse {
    content: string;
    remaining_views: number | null;
    expires_at: string | null;
}

export interface PasteData {
    id: string;
    content: string;
    createdAt: Date;
    expiresAt: Date | null;
    maxViews: number | null;
    currentViews: number;
}
