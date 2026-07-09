import { Router } from 'express';
import { autoGenerateBudget, saveBudget, getBudget, getBudgetTemplate } from '../controllers/budget.controller';
import { authenticateToken } from '../middleware/auth';
import { verifySubscription } from '../middleware/subscription.middleware';

const router = Router();
router.get('/budget', authenticateToken, verifySubscription, getBudget);
router.get('/budget/template', authenticateToken, verifySubscription, getBudgetTemplate);
router.post('/budget/auto', authenticateToken, verifySubscription, autoGenerateBudget);
router.post('/budget', authenticateToken, verifySubscription, saveBudget);

export default router;