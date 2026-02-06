import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.join(__dirname, '..', 'views', 'paste.html');
const pasteTemplate = fs.readFileSync(templatePath, 'utf-8');
const languageDisplayNames = {
    plaintext: 'Plain Text',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
    java: 'Java',
    cpp: 'C++',
    csharp: 'C#',
    php: 'PHP',
    ruby: 'Ruby',
    go: 'Go',
    rust: 'Rust',
    swift: 'Swift',
    kotlin: 'Kotlin',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    json: 'JSON',
    xml: 'XML',
    yaml: 'YAML',
    markdown: 'Markdown',
    sql: 'SQL',
    bash: 'Bash',
    powershell: 'PowerShell'
};
const languageClassMapping = {
    plaintext: 'plaintext',
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    java: 'java',
    cpp: 'cpp',
    csharp: 'csharp',
    php: 'php',
    ruby: 'ruby',
    go: 'go',
    rust: 'rust',
    swift: 'swift',
    kotlin: 'kotlin',
    html: 'markup',
    css: 'css',
    scss: 'scss',
    json: 'json',
    xml: 'xml',
    yaml: 'yaml',
    markdown: 'markdown',
    sql: 'sql',
    bash: 'bash',
    powershell: 'powershell'
};
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
function formatExpiration(expiresAt) {
    if (!expiresAt)
        return 'Never';
    const date = new Date(expiresAt);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    if (diffMs < 0)
        return 'Expired';
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60)
        return `${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24)
        return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 30)
        return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
function formatSize(bytes) {
    if (bytes < 1024)
        return `${bytes} B`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
export function generatePasteHtml(data) {
    const title = data.title || 'Untitled Paste';
    const languageDisplay = languageDisplayNames[data.language] || data.language;
    const languageClass = languageClassMapping[data.language] || 'plaintext';
    const createdAt = formatDate(data.createdAt);
    const expiration = formatExpiration(data.expiresAt);
    const views = data.views.toLocaleString();
    const lines = data.content.split('\n').length.toLocaleString();
    const size = formatSize(new TextEncoder().encode(data.content).length);
    const escapedContent = escapeHtml(data.content);
    const rawContent = data.content;
    return pasteTemplate
        .replace(/\{\{TITLE\}\}/g, () => escapeHtml(title))
        .replace(/\{\{LANGUAGE\}\}/g, () => escapeHtml(data.language))
        .replace(/\{\{LANGUAGE_DISPLAY\}\}/g, () => escapeHtml(languageDisplay))
        .replace(/\{\{LANGUAGE_CLASS\}\}/g, () => languageClass)
        .replace(/\{\{CREATED_AT\}\}/g, () => createdAt)
        .replace(/\{\{EXPIRATION\}\}/g, () => expiration)
        .replace(/\{\{VIEWS\}\}/g, () => views)
        .replace(/\{\{LINES\}\}/g, () => lines)
        .replace(/\{\{SIZE\}\}/g, () => size)
        .replace(/\{\{CONTENT\}\}/g, () => escapedContent)
        .replace(/\{\{RAW_CONTENT\}\}/g, () => escapeHtml(rawContent));
}
export function generate404Html(message = 'Paste not found') {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Pastebin Lite</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <nav class="nav">
                <a href="/" class="logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                    Pastebin Lite
                </a>
            </nav>
        </div>
    </header>
    
    <section class="section">
        <div class="container" style="text-align: center; padding: 4rem 0;">
            <div class="card" style="max-width: 600px; margin: 0 auto; border-color: var(--color-border);">
                <h1 style="font-size: 6rem; margin: 0; color: var(--color-text-muted);">404</h1>
                <h2 style="margin: 1rem 0;">${escapeHtml(message)}</h2>
                <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
                    The paste you're looking for doesn't exist or has expired.
                </p>
                <a href="/" class="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>Go Home</span>
                </a>
            </div>
        </div>
    </section>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2026 Pastebin Lite</p>
        </div>
    </footer>
</body>
</html>
    `.trim();
}
//# sourceMappingURL=paste.view.js.map