import { Router } from 'express';
import { 
    createTransaction, 
    getTransactions 
} from '../controllers/transaction.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createTransaction );
router.get('/', authenticateToken,getTransactions);

export default router;
