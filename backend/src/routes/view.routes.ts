import { Router } from 'express';
import { PasteController } from '../controllers/paste.controller.js';

const router = Router();
const pasteController = new PasteController();

router.get('/p/:id', pasteController.viewPaste);

export default router;
