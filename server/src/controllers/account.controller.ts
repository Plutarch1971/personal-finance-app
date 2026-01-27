import { Request, Response } from 'express';

export async function getAccounts(req: Request, res: Response) {
  try {
    res.json({ message: 'Get accounts endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
}
