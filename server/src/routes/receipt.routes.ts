import { Router } from 'express';
import multer from 'multer';
import {
    extractReceipt,
    confirmReceiptToTransaction,
} from '../controllers/receipt-ai.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const ok = 
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/webp';
     if (!ok) {
        return cb(new Error('Only JPEG, PNG, WEBP allowed'));
     }
     cb(null, true);
    }
})

router.post('/extract', authenticateToken, upload.single('receipt'), extractReceipt);
router.post('/confirm', authenticateToken, confirmReceiptToTransaction);

export default router;