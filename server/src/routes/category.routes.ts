import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import * as controller from '../controllers/category.controller';
import { verifySubscription } from '../middleware/subscription.middleware';

const router = Router();

// Category routes will go here
router.post('/', authenticateToken, verifySubscription, controller.createCategory);
router.get('/', authenticateToken, controller.getCategories);
router.delete('/:id', authenticateToken, verifySubscription, controller.deleteCategory);
router.put('/:id', authenticateToken, verifySubscription, controller.updateCategory)

export default router;
