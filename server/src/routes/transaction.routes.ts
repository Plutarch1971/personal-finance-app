import { Router } from 'express';
import { 
    createTransaction, 
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getTransactionById 
} from '../controllers/transaction.controller';
import { authenticateToken } from '../middleware/auth';
import { verifySubscription } from '../middleware/subscription.middleware';

const router = Router();

router.post('/', authenticateToken, verifySubscription, createTransaction );
router.get('/', authenticateToken,verifySubscription, getTransactions);
router.get('/:id', authenticateToken, verifySubscription, getTransactionById);
router.delete('/:id', authenticateToken, verifySubscription, deleteTransaction);
router.put('/:id', authenticateToken, verifySubscription, updateTransaction)

export default router;
