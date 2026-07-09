import { Router } from 'express';
import { createAccount, getAccounts, getGroupedAccounts } from '../controllers/account.controller';
import { authenticateToken } from '../middleware/auth';
import { verifySubscription } from '../middleware/subscription.middleware';

const router = Router();
router.post('/', authenticateToken,verifySubscription, createAccount);
router.get('/', authenticateToken,verifySubscription, getAccounts);
router.get('/grouped', authenticateToken,verifySubscription, getGroupedAccounts)

export default router;
