import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
    getMonthlySummary,
    getExpenseByCategory,
    getAccountBalances,
} from '../controllers/report.controller';

const router = Router();

router.get('/summary', authenticateToken, getMonthlySummary);
router.get('/expenses-by-category', authenticateToken, getExpenseByCategory);
router.get('/account-balance', authenticateToken, getAccountBalances);

export default router;
