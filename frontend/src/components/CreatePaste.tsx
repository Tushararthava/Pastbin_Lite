import { useState } from 'react';
import { pasteApi } from '../services/api';
import type { CreatePasteRequest } from '../types/api';
import './CreatePaste.css';

interface CreatePasteProps {
    onPasteCreated: (id: string, url: string) => void;
}

export const CreatePaste: React.FC<CreatePasteProps> = ({ onPasteCreated }) => {
    const [content, setContent] = useState('');
    const [ttlSeconds, setTtlSeconds] = useState('');
    const [maxViews, setMaxViews] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!content.trim()) {
            setError('Please enter some content');
            return;
        }

        setLoading(true);

        try {
            const data: CreatePasteRequest = {
                content: content.trim(),
            };

            if (ttlSeconds) {
                data.ttl_seconds = parseInt(ttlSeconds);
            }

            if (maxViews) {
                data.max_views = parseInt(maxViews);
            }

            const response = await pasteApi.createPaste(data);

            if (response.success) {
                onPasteCreated(response.data.id, response.data.url);
                setContent('');
                setTtlSeconds('');
                setMaxViews('');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create paste');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-paste-container">
            <div className="create-paste-card">
                <h1 className="title">Create New Paste</h1>
                <p className="subtitle">Share your code, text, or notes securely</p>

                <form onSubmit={handleSubmit} className="paste-form">
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste your content here..."
                            rows={12}
                            className="content-textarea"
                        />
                    </div>

                    <div className="options-grid">
                        <div className="form-group">
                            <label htmlFor="ttl">Expiry Time (seconds)</label>
                            <input
                                id="ttl"
                                type="number"
                                value={ttlSeconds}
                                onChange={(e) => setTtlSeconds(e.target.value)}
                                placeholder="Optional (e.g., 3600)"
                                min="1"
                                className="input-field"
                            />
                            <span className="hint">Leave empty for no expiry</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="maxViews">Max Views</label>
                            <input
                                id="maxViews"
                                type="number"
                                value={maxViews}
                                onChange={(e) => setMaxViews(e.target.value)}
                                placeholder="Optional (e.g., 10)"
                                min="1"
                                className="input-field"
                            />
                            <span className="hint">Leave empty for unlimited</span>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? 'Creating...' : 'Create Paste'}
                    </button>
                </form>
            </div>
        </div>
    );
};
