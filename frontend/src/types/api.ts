export interface CreatePasteRequest {
    content: string;
    ttl_seconds?: number;
    max_views?: number;
}

export interface CreatePasteResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        url: string;
    };
}

export interface PasteDetail {
    success: boolean;
    message: string;
    data: {
        content: string;
        remaining_views: number | null;
        expires_at: string | null;
    };
}

export interface ApiError {
    success: false;
    message: string;
}
