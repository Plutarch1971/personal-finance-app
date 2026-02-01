import { Account } from '../models';

interface CreateAccountInput{
userId: string;
name: string;
type: 'checking' | 'savings' | 'credit' | 'cash' | 'investment' | 'wallet';
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