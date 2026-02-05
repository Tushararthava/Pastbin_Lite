import { Router } from 'express';
import healthRoutes from './health.routes.js';
import pasteRoutes from './paste.routes.js';
import viewRoutes from './view.routes.js';

const router = Router();

router.use('/api/healthz', healthRoutes);
router.use('/api/pastes', pasteRoutes);

router.use('/', viewRoutes);

export default router;
