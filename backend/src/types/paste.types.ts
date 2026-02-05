export interface CreatePasteDto {
    title?: string;
    content: string;
    language?: string;
    ttl_seconds?: number;
    max_views?: number;
    expiration?: string;
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
    title: string | null;
    content: string;
    language: string;
    created_at: Date;
    expires_at: Date | null;
    max_views: number | null;
    current_views: number;
    view_count: number;
}
