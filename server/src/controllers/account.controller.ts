import { Request, Response } from 'express';
import * as accountService from '../services/account.service';

export async function createAccount(req: Request, res: Response){
  try {
    const userId = (req.user as any).id;
    const { name, type, currency, initialBalance } = req.body;
    const account = await accountService.createAccount({
    userId,
    name,
    type,
    currency,
    initialBalance,
  });
  res.status(201).json(account);
  } catch(error: any){
    res.status(400).json({ error: error.message});
  }
}
export async function getAccounts(req: Request, res: Response) {
  try {
    const userId = (req.user as any).id;

    const accounts = await accountService.getAccountsByUser(userId);
    res.json(accounts);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
