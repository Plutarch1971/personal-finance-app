import { Request, Response } from 'express';
import { extractReceiptFromImage } from '../services/receipt-ai.service';
import * as transactionService from '../services/transaction.service';

type ReceiptUploadRequest = Request & {
    file?: {
        buffer: Buffer;
        mimetype: string;
    };
};

export async function extractReceipt(req: ReceiptUploadRequest, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Receipt image is required'});
        }

        const draft = await extractReceiptFromImage(
            req.file.buffer,
            req.file.mimetype
        );

        return res.json({ draft });
    } catch (error: any) {
        return res.status(400).json({
            error: error.message || 'Failed to extract receipt',
        });
    }
}

export async function confirmReceiptToTransaction(req: Request, res: Response) {
    try {
        const userId = req.user!.id;
        const { accountId, categoryId, draft } = req.body;

        if (!accountId) {
            return res.status(400).json({ error: 'accountId is required'});
        }

        if (!draft || typeof draft != 'object') {
            return res.status(400).json({ error: 'draft payload is required'});
        }

        const amount = Number(draft.total);
        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({ error: 'draft.total mush be a positive number'});
        }

        const description = 
            draft.merchantName
            ? 'Receipt:' + draft.merchantName
            : 'Receipt purchase';

        const tx = await transactionService.createTransaction({
            userId,
            type: 'expense',
            accountId,
            categoryId,
            amount,
            description,
            transactionDate: draft.receiptDate ? new Date(draft.receiptDate) : new Date(),
        });
        return res.status(201).json({ transaction: tx});
    } catch (error: any ) {
        return res.status(400).json({
            error: error.message || 'Failed to confirm receipt',
        });
    }
}