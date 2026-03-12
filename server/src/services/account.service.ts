// account.service.ts
import { Account } from '../models';

interface CreateAccountInput{
userId: string;
name: string;
type: 'checking' | 'savings' | 'credit' | 'investment';
currency?: string;
initialBalance?: number;
}

export async function createAccount(data: CreateAccountInput){
    const account = await Account.create({
        userId: data.userId,
        name: data.name,
        type: data.type,
        currency: data.currency ?? 'CAD',
        initialBalance: data.initialBalance ?? 0,
        balance: data.initialBalance ?? 0,
    });
    return account;
}

export async function getAccountsByUser(userId: string){
    return Account.findAll({
        where: { userId },
        order: [[ 'createdAt', 'ASC']],
    });
}

export async function getGroupedAccounts(userId: string) {
    const accounts = await Account.findAll({
        where: { userId },
        order: [['createdAt', 'ASC']]
    });
    
    const grouped = {
        bank: [] as any[],
        credit: [] as any[],
        investment: [] as any[]
    };

    for (const acc of accounts) {
       if(acc.type === 'checking' || acc.type === 'savings') {
        grouped.bank.push(acc);
       }
       if(acc.type === 'credit') {
        grouped.credit.push(acc);
       }
       if(acc.type === 'investment') {
        grouped.investment.push(acc);
       }
    }
    return grouped;
}