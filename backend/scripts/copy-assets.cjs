const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

try {
    // Copy Views (HTML)
    const viewsSrc = path.join(__dirname, '../src/views');
    const viewsDest = path.join(__dirname, '../dist/views');
    console.log(`Copying views from ${viewsSrc} to ${viewsDest}`);

    if (fs.existsSync(viewsSrc)) {
        fs.mkdirSync(viewsDest, { recursive: true });
        const viewFiles = fs.readdirSync(viewsSrc).filter(f => f.endsWith('.html'));
        viewFiles.forEach(f => {
            fs.copyFileSync(path.join(viewsSrc, f), path.join(viewsDest, f));
        });
    }

    // Copy Public
    const publicSrc = path.join(__dirname, '../public');
    const publicDest = path.join(__dirname, '../dist/public');
    console.log(`Copying public from ${publicSrc} to ${publicDest}`);

    if (fs.existsSync(publicSrc)) {
        copyDir(publicSrc, publicDest);
    }

    console.log('Assets copied successfully.');
} catch (error) {
    console.error('Error copying assets:', error);
    process.exit(1);
}
