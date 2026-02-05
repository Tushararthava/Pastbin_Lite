import { useState } from 'react';
import { copyToClipboard } from '../utils/helpers';
import './PasteResult.css';

interface PasteResultProps {
    id: string;
    url: string;
    onCreateAnother: () => void;
}

export const PasteResult: React.FC<PasteResultProps> = ({ id, url, onCreateAnother }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const success = await copyToClipboard(url);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="paste-result-container">
            <div className="paste-result-card">
                <div className="success-icon">✓</div>
                <h2 className="success-title">Paste Created Successfully!</h2>
                <p className="success-subtitle">Your paste is ready to share</p>

                <div className="result-details">
                    <div className="detail-item">
                        <span className="detail-label">Paste ID:</span>
                        <code className="detail-value">{id}</code>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">Share URL:</span>
                        <div className="url-container">
                            <code className="detail-value url-value">{url}</code>
                            <button onClick={handleCopy} className="copy-button">
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="action-buttons">
                    <a href={`/paste/${id}`} className="view-button">
                        View Paste
                    </a>
                    <button onClick={onCreateAnother} className="create-another-button">
                        Create Another
                    </button>
                </div>
            </div>
        </div>
    );
};
