// src/routes/reportRoutes.ts

import { Router } from 'express';
import { getUserActivity, getRegistrationTrends } from '../controllers/reportController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/user-activity', authMiddleware, adminMiddleware, getUserActivity);
router.get('/registration-trends', authMiddleware, adminMiddleware, getRegistrationTrends);

export default router;