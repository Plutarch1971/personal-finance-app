import { Router } from 'express';
import { 
    createTransaction, 
    getTransactions,
    deleteTransaction 
} from '../controllers/transaction.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createTransaction );
router.get('/', authenticateToken,getTransactions);
router.delete('/:id', authenticateToken, deleteTransaction);

export default router;
