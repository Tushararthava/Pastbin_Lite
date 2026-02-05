import { Router } from 'express';
import { PasteController } from '../controllers/paste.controller.js';
import { validateCreatePaste } from '../validators/paste.validator.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();
const pasteController = new PasteController();

router.get('/my', authenticate, pasteController.getMyPastes);
router.post('/', optionalAuth, validateCreatePaste, pasteController.createPaste);
router.get('/:id', optionalAuth, pasteController.getPaste);

export default router;
