import { Router } from 'express';
import healthRoutes from './health.routes.js';
import pasteRoutes from './paste.routes.js';
import viewRoutes from './view.routes.js';
import authRoutes from './auth.routes.js';

console.log('Loading routes/index.ts...');
const router = Router();

router.use('/api/healthz', healthRoutes);
router.use('/api/pastes', pasteRoutes);
router.use('/api/auth', authRoutes);

router.use('/', viewRoutes);

export default router;
