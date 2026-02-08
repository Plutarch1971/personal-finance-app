import sequelize from '../config/connection';
import { Transaction, Account, Category } from '../models';

interface CreateTransactionInput {
    userId: string;
    accountId: string;
    categoryId?: string;
    amount: number;
    description?: string;
    transactionDate: Date;
}
export async function createTransaction(data: CreateTransactionInput) {
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

 export async function deleteTransaction (id: string, userId: string) {
    return sequelize.transaction(async (t) => {
        //Find the transaction first to get its details
        const transaction = await Transaction.findOne({
            where: { id, userId},
            transaction: t,
        });

        if(!transaction) {
            throw new Error('Transaction not found');
        }
        //Get the account to update balance
        const account = await Account.findByPk(transaction.accountId, {
            transaction: t,
        });

        if(!account){
            throw new Error('Account not found');
        }

        //Reverse the balance change (subtract the amount that was added)
        await account.update(
            { balance: Number(account.balance) - Number(transaction.amount)},
            { transaction: t}
        );

        //Delete the transaction
        await transaction.destroy({ transaction: t});

        return { message: 'Transaction deletd successfully'};
    });
    
 }