const fs = require('fs');
const path = require('path');

// Create dist/views directory
fs.mkdirSync('dist/views', { recursive: true });

// Copy HTML files from src/views to dist/views
const viewFiles = fs.readdirSync('src/views').filter(f => f.endsWith('.html'));
viewFiles.forEach(f => {
    fs.copyFileSync(
        path.join('src/views', f),
        path.join('dist/views', f)
    );
});

// Copy public folder to dist/public
fs.cpSync('public', 'dist/public', { recursive: true });

console.log('Files copied successfully!');
