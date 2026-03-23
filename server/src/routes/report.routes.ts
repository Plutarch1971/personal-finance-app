import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import * as controller from '../controllers/report.controller';
// import {
//     getMonthlyExpensesByCategory,
//     getExpensesByCategory,
//     getIncomeByCategory,
//     getAccountBalances,
//     getExpenseThirty
// } from '../controllers/report.controller';

const router = Router();

router.get('/monthly-expenses', authenticateToken,controller.getMonthlyExpensesByCategory);
router.get('/monthly-summary', authenticateToken, controller.getMonthlySummary);
router.get('/expenses-by-category', authenticateToken, controller.getExpensesByCategory);
router.get('/income-by-category', authenticateToken, controller.getIncomeByCategory)
router.get('/account-balance', authenticateToken, controller.getAccountBalances);
router.get('/expense-by-thirty', authenticateToken, controller.getExpenseThirty);

export default router;
