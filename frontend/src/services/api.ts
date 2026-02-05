import axios from 'axios';
import type { CreatePasteRequest, CreatePasteResponse, PasteDetail } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const pasteApi = {
    createPaste: async (data: CreatePasteRequest): Promise<CreatePasteResponse> => {
        const response = await api.post<CreatePasteResponse>('/api/pastes', data);
        return response.data;
    },

    getPaste: async (id: string): Promise<PasteDetail> => {
        const response = await api.get<PasteDetail>(`/api/pastes/${id}`);
        return response.data;
    },
};
