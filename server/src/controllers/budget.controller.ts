import { Request, Response } from 'express';
import * as budgetService from '../services/budget.service';

export async function autoGenerateBudget(req: Request, res: Response) {
    try {
        const userId = (req as any).user?.id;
        if(!userId) return res.status(401).json({ error: 'Unauthenticated'});
        const data = await budgetService.generateAutoBudget(userId);
        res.json(data);

    } catch (err: any) {
        console.error('Auto generate budget error:', err);
        res.status(500).json({ error: 'Failed to generate budget: ' + (err.message || 'Unknown error')})
    }
}

export async function saveBudget(req: Request, res: Response) {
    try {
        const userId = (req as any).user?.id;
        if(!userId) return res.status(401).json({ error: 'Unauthenticated'});
        const { budgets } = req.body;

        await budgetService.saveBudget(userId, budgets);
        res.json({ message: 'Budget saved'});   

    } catch (err: any) {
        console.error('Save budget error:', err);
        res.status(500).json({ error: 'Failed to save budget: ' + (err.message || 'Unknown error')});
    }
}

export async function getBudgetTemplate(req: Request, res: Response) {
    try {
        const userId = (req as any).user?.id;
        if(!userId) return res.status(401).json({ error: 'Unauthenticated'});

        const data = await budgetService.getBudgetTemplate(userId);
        res.json(data);
    } catch (err: any) {
        console.error('Get budget template error:', err);
        res.status(500).json({ error: 'Failed to get budget template: ' + (err.message || 'Unknown error')})
    }
}

export async function getBudget(req: Request, res: Response) {
    try {
        const userId = (req as any).user?.id;
        if(!userId) return res.status(401).json({ error: 'Unauthenticated'});

        const data = await budgetService.getBudget(userId);
        res.json(data);
    } catch (err: any) {
        console.error('Get budget error:', err);
        res.status(500).json({ error: 'Failed to get budget: ' + (err.message || 'Unknown error')})
    }
}