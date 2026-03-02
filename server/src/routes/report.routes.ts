import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
    getMonthlySummary,
    getExpenseByCategory,
    getIncomeByCategory,
    getAccountBalances,
    getExpenseThirty
} from '../controllers/report.controller';

const router = Router();

router.get('/summary', authenticateToken, getMonthlySummary);
router.get('/expenses-by-category', authenticateToken, getExpenseByCategory);
router.get('/income-by-category', authenticateToken, getIncomeByCategory)
router.get('/account-balance', authenticateToken, getAccountBalances);
router.get('/expense-by-thirty', authenticateToken, getExpenseThirty);

export default router;
