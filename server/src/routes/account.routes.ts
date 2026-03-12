import { Router } from 'express';
import { createAccount, getAccounts, getGroupedAccounts } from '../controllers/account.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.post('/', authenticateToken, createAccount);
router.get('/', authenticateToken, getAccounts);
router.get('/grouped', authenticateToken, getGroupedAccounts)

export default router;
