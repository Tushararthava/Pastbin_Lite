import { Router } from 'express';
import { PasteController } from '../controllers/paste.controller.js';
import { validateCreatePaste } from '../validators/paste.validator.js';

const router = Router();
const pasteController = new PasteController();

router.post('/', validateCreatePaste, pasteController.createPaste);
router.get('/:id', pasteController.getPaste);

export default router;
