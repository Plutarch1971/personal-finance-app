import { Router } from 'express';
import { 
    createTransaction, 
    getTransactions,
    updateTransaction,
    deleteTransaction 
} from '../controllers/transaction.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createTransaction );
router.get('/', authenticateToken,getTransactions);
router.delete('/:id', authenticateToken, deleteTransaction);
router.put('/:id', authenticateToken, updateTransaction);

export default router;
