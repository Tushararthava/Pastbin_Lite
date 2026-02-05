export const escapeHtml = (unsafe: string): string => {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

export const generatePasteHtml = (content: string, remainingViews: number | null, expiresAt: string | null): string => {
    const escapedContent = escapeHtml(content);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pastebin - View Paste</title>
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
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 900px;
      width: 100%;
      padding: 30px;
    }
    h1 {
      color: #333;
      margin-bottom: 20px;
      font-size: 28px;
    }
    .info {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      flex-wrap: wrap;
    }
    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .info-label {
      font-weight: 600;
      color: #555;
    }
    .info-value {
      color: #667eea;
      font-weight: 500;
    }
    .content {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 20px;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.6;
      max-height: 600px;
      overflow-y: auto;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      color: #6c757d;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📋 Paste Content</h1>
    <div class="info">
      ${remainingViews !== null ? `
      <div class="info-item">
        <span class="info-label">Remaining Views:</span>
        <span class="info-value">${remainingViews}</span>
      </div>
      ` : ''}
      ${expiresAt ? `
      <div class="info-item">
        <span class="info-label">Expires At:</span>
        <span class="info-value">${new Date(expiresAt).toLocaleString()}</span>
      </div>
      ` : ''}
      ${!remainingViews && !expiresAt ? '<div class="info-item"><span class="info-value">No expiry or view limits</span></div>' : ''}
    </div>
    <div class="content">${escapedContent}</div>
    <div class="footer">
      Pastebin-Lite © 2026
    </div>
  </div>
</body>
</html>
  `.trim();
};

export const generate404Html = (message: string = 'Paste not found'): string => {
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
