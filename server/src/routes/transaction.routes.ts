import { Router } from 'express';
import { 
    createTransaction, 
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getTransactionById 
} from '../controllers/transaction.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createTransaction );
router.get('/', authenticateToken,getTransactions);
router.get('/:id', authenticateToken, getTransactionById);
router.delete('/:id', authenticateToken, deleteTransaction);
router.put('/:id', authenticateToken, updateTransaction)
export default router;
