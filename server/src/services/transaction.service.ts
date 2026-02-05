import sequelize from '../config/connection';
import { Transaction, Account, Category } from '../models';

interface CreateTransactioinInput {
    userId: string;
    accountId: string;
    categoryId?: string;
    amount: number;
    description?: string;
    transactionDate: Date;
}
export async function createTransaction(data: CreateTransactioinInput) {
    return sequelize.transaction(async (t) => {
        const account = await Account.findByPk(data.accountId,{ transaction: t});
        if(!account) throw new Error('Account not found');

        let signedAmount = data.amount;
        if(data.categoryId) {
            const category = await Category.findByPk(data.categoryId, {
                transaction: t,
            });
            if(!category) throw new Error('Category not found');

            if(category.type === 'expense') {
                signedAmount = -Math.abs(data.amount);
            }
        }
        const transaction = await Transaction.create( 
            {
                userId: data.userId,
                accountId: data.accountId,
                categoryId: data.categoryId,
                amount: signedAmount,
                description: data.description,
                transactionDate: data.transactionDate,
            },
            { transaction: t }
        );
        await account.update(
            { balance: Number(account.balance)+ signedAmount },
            { transaction : t }
        );
        return transaction;
    }
  
)};
 export async function getTransactionByUser(userId: string){
    return Transaction.findAll( {
        where: { userId },
        order: [[ 'transactionDate', 'DESC']],
    });
 }