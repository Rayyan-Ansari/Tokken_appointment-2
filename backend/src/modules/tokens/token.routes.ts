import express from 'express';
import { tokenController } from './token.controller';
import { authMiddleware, requirePatient } from '@/lib/auth';

const router = express.Router();

// All token routes require authentication
router.use(authMiddleware);

// Patient-specific routes
router.post('/book', requirePatient, tokenController.bookToken);
router.get('/my', requirePatient, tokenController.getMyTokens);

// Session tokens (for doctors to view their queue)
router.get('/session/:sessionId', tokenController.getSessionTokens);

export { router as tokenRoutes };