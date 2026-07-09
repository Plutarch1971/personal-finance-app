import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import * as controller from '../controllers/report.controller';
import { verifySubscription } from '../middleware/subscription.middleware';

const router = Router();

router.get('/monthly-expenses', authenticateToken, verifySubscription, controller.getMonthlyExpensesByCategory);
router.get('/monthly-summary', authenticateToken, verifySubscription, controller.getMonthlySummary);
router.get('/expenses-by-category', authenticateToken, verifySubscription, controller.getExpensesByCategory);
router.get('/income-by-category', authenticateToken, verifySubscription, controller.getIncomeByCategory)
router.get('/account-balance', authenticateToken, verifySubscription, controller.getAccountBalances);
router.get('/expense-by-thirty', authenticateToken, verifySubscription, controller.getExpenseThirty);
router.get('/expense-trend', authenticateToken, verifySubscription, controller.getMonthlyExpenseTrend);

export default router;
