import { Router } from 'express';
import { PasteController } from '../controllers/paste.controller.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
const pasteController = new PasteController();
router.get('/', (_req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../../public') });
});
router.get('/login', (_req, res) => {
    res.sendFile('login.html', { root: path.join(__dirname, '../../public') });
});
router.get('/register', (_req, res) => {
    res.sendFile('register.html', { root: path.join(__dirname, '../../public') });
});
router.get('/p/:id', pasteController.viewPaste);
export default router;
//# sourceMappingURL=view.routes.js.map