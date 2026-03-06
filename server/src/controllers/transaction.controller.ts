import { Request, Response } from 'express';
import * as transactionService from '../services/transaction.service';

export async function createTransaction(req: Request, res: Response){
    try {
        const userId = req.user!.id;
        const {
            type,
            accountId,
            toAccountId,
            categoryId,
            amount,
            description,
            transactionDate,
        } = req.body;

        if (!type) {
                return res.status(400).json({ error: "Transaction type required"});
        }

        const transaction = await transactionService.createTransaction( 
            {
            userId,
            type,
            accountId,
            toAccountId,
            categoryId,
            amount,
            description,
            transactionDate,
            }
        );
        res.status(201).json(transaction);
    }catch (error: any) {
        res.status(400).json( { error: error.message });
    }
}

export async function getTransactions(req: Request, res: Response){
    try {
        const userId = req.user!.id;
        const transactions = await transactionService.getTransactionByUser(userId);
        res.json(transactions);
    }catch (error: any){
        res.status(400).json( { error: error.message });
    }
}

export async function updateTransaction(req: Request, res: Response) {
    try {
        const userId = req.user!.id;
        const id = req.params.id as string;

        if(!id) {
            return res.status(400).json({ error: 'Transaction ID is required'})
        }
        
        const updated = await transactionService.updateTransaction(
                id, 
                userId, 
                {
                    ...req.body,
                    transactionDate: req.body.transactionDate
                    ? new Date(req.body.transactionDate)
                    : undefined
                } 
        )
        res.json(updated);
        } catch (error: any){
            res.status(400).json({ error: 'Transaction update failed.'})
        }
        
}

export async function getTransactionById(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    if (!id) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    const transaction = await transactionService.getTransactionById(id, userId);
    res.json(transaction);
  } catch (error: any) {
    res.status(404).json({ error: error.message || 'Transaction not found' });
  }
}

export async function deleteTransaction(req: Request, res: Response) {
       try {
        const userId = req.user!.id;
        const id = req.params.id as string;

        if(!id) {
            return res.status(400).json({ error: 'Transaction ID is required'})
        }

        await transactionService.deleteTransaction(id, userId);
        res.json({ message: 'Transaction deleted successfully'});
        } catch (error: any) {
            res.status(400).json({ error: error.message});
        }
    
}