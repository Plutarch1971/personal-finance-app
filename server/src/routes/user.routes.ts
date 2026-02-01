import { Router } from 'express';
import { register, login } from '../controllers/user.controller';

const router = Router();

// CREATE a new user
router.post('/register', register);
// Login a user
router.post('/login', login);
  
export default router;

