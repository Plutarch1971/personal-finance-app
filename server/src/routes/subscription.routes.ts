//subscription.routes.ts
import { Router } from 'express';

import { authenticateToken } from '../middleware/auth';
import { createCheckoutSession } 
    from '../controllers/subscription.controller';

const router = Router();

router.post(
    '/create-checkout-session', 
    authenticateToken,
     createCheckoutSession);

export default router;