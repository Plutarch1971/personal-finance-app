import { Router } from 'express';
import userRoutes from './user.routes';
import accountRoutes from './account.routes';
import categoryRoutes from './category.routes';
import transactionRoutes from './transaction.routes';
import reportRoutes from './report.routes';
import authRoutes from './auth.routes';

const router = Router();
// Add routes here
router.use('/users', userRoutes);
router.use('/accounts', accountRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/reports', reportRoutes);
router.use('/auth', authRoutes);

export default router;