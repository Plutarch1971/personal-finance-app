import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { createCategory, getCategories } from '../controllers/category.controller';

const router = Router();

// Category routes will go here
router.post('/', authenticateToken, createCategory);
router.get('/', authenticateToken, getCategories);

export default router;
