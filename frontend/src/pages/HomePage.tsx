import { useState } from 'react';
import { CreatePaste } from '../components/CreatePaste';
import { PasteResult } from '../components/PasteResult';

export const HomePage = () => {
    const [pasteId, setPasteId] = useState<string | null>(null);
    const [pasteUrl, setPasteUrl] = useState<string | null>(null);

    const handlePasteCreated = (id: string, url: string) => {
        setPasteId(id);
        setPasteUrl(url);
    };

    const handleCreateAnother = () => {
        setPasteId(null);
        setPasteUrl(null);
    };

    if (pasteId && pasteUrl) {
        return (
            <PasteResult
                id={pasteId}
                url={pasteUrl}
                onCreateAnother={handleCreateAnother}
            />
        );
    }

    return <CreatePaste onPasteCreated={handlePasteCreated} />;
};
