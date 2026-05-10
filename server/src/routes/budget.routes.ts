import { Router } from 'express';
import { autoGenerateBudget, saveBudget, getBudget, getBudgetTemplate } from '../controllers/budget.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.get('/budget', authenticateToken, getBudget);
router.get('/budget/template', authenticateToken, getBudgetTemplate);
router.post('/budget/auto', authenticateToken, autoGenerateBudget);
router.post('/budget', authenticateToken, saveBudget);

export default router;