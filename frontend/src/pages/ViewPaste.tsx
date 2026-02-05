import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pasteApi } from '../services/api';
import { formatDate, copyToClipboard } from '../utils/helpers';
import './ViewPaste.css';

export const ViewPaste = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [remainingViews, setRemainingViews] = useState<number | null>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchPaste = async () => {
            if (!id) {
                setError('Invalid paste ID');
                setLoading(false);
                return;
            }

            try {
                const response = await pasteApi.getPaste(id);
                if (response.success) {
                    setContent(response.data.content);
                    setRemainingViews(response.data.remaining_views);
                    setExpiresAt(response.data.expires_at);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Paste not found');
            } finally {
                setLoading(false);
            }
        };

        fetchPaste();
    }, [id]);

    const handleCopy = async () => {
        const success = await copyToClipboard(content);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="view-paste-container">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="view-paste-container">
                <div className="error-card">
                    <div className="error-icon">✕</div>
                    <h2 className="error-title">Paste Not Found</h2>
                    <p className="error-message">{error}</p>
                    <button onClick={() => navigate('/')} className="home-button">
                        Create New Paste
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="view-paste-container">
            <div className="view-paste-card">
                <div className="paste-header">
                    <h1 className="paste-title">Paste Content</h1>
                    <button onClick={handleCopy} className="copy-btn">
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>

                <div className="paste-meta">
                    {remainingViews !== null && (
                        <div className="meta-item">
                            <span className="meta-label">Remaining Views:</span>
                            <span className="meta-value">{remainingViews}</span>
                        </div>
                    )}
                    {expiresAt && (
                        <div className="meta-item">
                            <span className="meta-label">Expires:</span>
                            <span className="meta-value">{formatDate(expiresAt)}</span>
                        </div>
                    )}
                </div>

                <div className="paste-content">
                    <pre><code>{content}</code></pre>
                </div>

                <div className="paste-actions">
                    <button onClick={() => navigate('/')} className="new-paste-button">
                        Create New Paste
                    </button>
                </div>
            </div>
        </div>
    );
};
