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

// export async function seedDefaultAccounts(userId: string) {

//     await Account.bulkCreate([
//         {
//             userId,
//             name: "Checking",
//             type: "checking",
//             currency: "CAD",
//             balance: 0
//         },
//         {
//             userId,
//             name: "Savings",
//             type: "savings",
//             currency: "CAD",
//             balance: 0
//         },
//         {
//             userId,
//             name: "Credit",
//             type: "credit",
//             currency: "CAD",
//             balance: 0
//         },
//         {
//             userId,
//             name: "Investment",
//             type: "investment",
//             currency: "CAD",
//             balance: 0
//         }

//     ]);

// }