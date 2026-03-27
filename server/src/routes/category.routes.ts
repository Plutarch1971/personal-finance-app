import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import * as controller from '../controllers/category.controller';

const router = Router();

// Category routes will go here
router.post('/', authenticateToken, controller.createCategory);
router.get('/', authenticateToken, controller.getCategories);
router.post('categories', authenticateToken, controller.createCategoryByUser);
router.delete('/categories/:id', controller.deleteCategory);
router.put('/categories/:id', controller.updateCategory)

export default router;
