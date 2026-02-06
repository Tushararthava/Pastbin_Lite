export const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};
export const generatePasteHtml = (content, remainingViews, expiresAt) => {
    const escapedContent = escapeHtml(content);
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Paste Content - Pastebin Lite</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      background: #0f172a;
      color: #f8fafc;
      line-height: 1.6;
      min-height: 100vh;
      padding: 2rem 1rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .header {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header h1 {
      color: #0f172a;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    .metadata {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      padding-top: 1rem;
      border-top: 2px solid #e2e8f0;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }
    .meta-label {
      font-weight: 600;
      color: #334155;
    }
    .meta-value {
      color: #0ea5e9;
      font-weight: 600;
    }
    .content-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
    }
    .content-header {
      background: #f1f5f9;
      padding: 1rem 1.5rem;
      border-bottom: 2px solid #e2e8f0;
    }
    .content-header h2 {
      color: #0f172a;
      font-size: 1.125rem;
      font-weight: 600;
    }
    .content-body {
      padding: 1.5rem;
      background: #1e293b;
      max-height: 600px;
      overflow: auto;
    }
    .content-body pre {
      margin: 0;
      color: #e2e8f0;
      font-family: 'Courier New', 'Consolas', monospace;
      font-size: 0.875rem;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      border: none;
    }
    .btn-primary {
      background: #0ea5e9;
      color: white;
    }
    .btn-primary:hover {
      background: #0284c7;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
    }
    .btn-secondary {
      background: white;
      color: #0ea5e9;
      border: 2px solid #0ea5e9;
    }
    .btn-secondary:hover {
      background: #f0f9ff;
      transform: translateY(-2px);
    }
    .footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid #334155;
      color: #94a3b8;
      font-size: 0.875rem;
    }
    @media (max-width: 768px) {
      body {
        padding: 1rem;
      }
      .header h1 {
        font-size: 1.25rem;
      }
      .metadata {
        flex-direction: column;
        gap: 0.75rem;
      }
      .actions {
        flex-direction: column;
      }
      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Paste Content</h1>
      ${remainingViews !== null || expiresAt ? `
      <div class="metadata">
        ${remainingViews !== null ? `
        <div class="meta-item">
          <span class="meta-label">Remaining Views:</span>
          <span class="meta-value">${remainingViews}</span>
        </div>
        ` : ''}
        ${expiresAt ? `
        <div class="meta-item">
          <span class="meta-label">Expires:</span>
          <span class="meta-value">${new Date(expiresAt).toLocaleString()}</span>
        </div>
        ` : ''}
      </div>
      ` : ''}
    </div>

    <div class="content-card">
      <div class="content-header">
        <h2>Content</h2>
      </div>
      <div class="content-body">
        <pre>${escapedContent}</pre>
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-primary" onclick="copyToClipboard()">
        Copy Content
      </button>
      <a href="/" class="btn btn-secondary">
        Create New Paste
      </a>
    </div>

    <div class="footer">
      <p>Pastebin Lite © 2026</p>
    </div>
  </div>

  <script>
    function copyToClipboard() {
      const content = document.querySelector('.content-body pre').textContent;
      navigator.clipboard.writeText(content).then(() => {
        const btn = event.target.closest('button');
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = 'Copy Content';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    }
  </script>
</body>
</html>
  `.trim();
};
export const generate404Html = (message = 'Paste not found') => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Not Found</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 500px;
      width: 100%;
      padding: 40px;
      text-align: center;
    }
    h1 {
      font-size: 72px;
      color: #667eea;
      margin-bottom: 20px;
    }
    p {
      font-size: 18px;
      color: #555;
      margin-bottom: 30px;
    }
    a {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      transition: transform 0.2s;
    }
    a:hover {
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <p>${escapeHtml(message)}</p>
    <p>This paste may have expired or reached its view limit.</p>
    <a href="/">Go Home</a>
  </div>
</body>
</html>
  `.trim();
};
//# sourceMappingURL=paste.view.js.map