import { Request, Response } from 'express';
import *  as reportService from '../services/report.service';

export async function getMonthlySummary(req: Request, res: Response) {
    try {
        const userId = req.user!.id;
        const { startDate, endDate } = req.query as any;

        if(!startDate || !endDate) {
            return res.status(400).json( { error: 'startDate and endDate required'});
        }

        const summary = await reportService.getMonthlySummary(
            userId,
            startDate,
            endDate
        );
        res.json(summary);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export async function getExpenseByCategory(req: Request, res: Response) {
    try {
        const userId = req.user!.id;
        const { startDate, endDate } = req.query as any;

        const data = await reportService.getExpenseByCategory(
            userId,
            startDate,
            endDate
        );
        res.json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export async function getAccountBalances( req: Request, res: Response) {
    try {
        const userId = req.user!.id;
        const accounts = await reportService.getAccountBalances(userId);
        res.json(accounts);
    } catch (error: any){
        res.status(400).json({ error: error.message });
    }
}
