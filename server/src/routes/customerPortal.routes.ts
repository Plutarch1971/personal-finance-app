//customerPortal.routes.ts
import { Router } from 'express';
import { createCustomerPortalSession } from '../controllers/customerPortal.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post(
    '/create-customer-portal-session',
    authenticateToken,
    createCustomerPortalSession
)

export default router;