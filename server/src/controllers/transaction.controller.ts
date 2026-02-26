import { Request, Response } from 'express';
import * as transactionService from '../services/transaction.service';

export async function createTransaction(req: Request, res: Response){
    try {
        const userId = req.user!.id;
        const {
            accountId,
            categoryId,
            amount,
            description,
            transactionDate,
        } = req.body;

        const transaction = await transactionService.createTransaction( 
            {
            userId,
            accountId,
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
                req.body 
        )
        res.json(updated);
        } catch (error: any){
            res.status(400).json({ error: 'Transaction update failed.'})
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