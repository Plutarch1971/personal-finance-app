import { Router } from 'express';
import { createAccount, getAccounts } from '../controllers/account.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.post('/', authenticateToken, createAccount);
router.get('/', authenticateToken, getAccounts);

export default router;
