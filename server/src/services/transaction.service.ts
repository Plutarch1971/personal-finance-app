import sequelize from '../config/connection';
import { Transaction, Account, Category } from '../models';

interface CreateTransactionInput {
    userId: string;
    type: 'income' |'expense' | 'transfer';

    accountId: string;
    toAccountId?: string;

    categoryId?: string;
    amount: number;
    description?: string;
    transactionDate: Date;
}
export async function createTransaction(data: CreateTransactionInput) {
    return sequelize.transaction(async (t) => {
        const account = await Account.findByPk(data.accountId,{ transaction: t});
        
        if(!account) throw new Error('Account not found');

        if(data.type === 'transfer'){
            if(!data.toAccountId){
                throw new Error('Destination account required for transfer');
            }
            if(data.accountId === data.toAccountId){
                throw new Error('Cannot transfer to same account');
            }
        }

        let signedAmount = data.amount;

        if(data.type === 'expense') {
            signedAmount = -Math.abs(data.amount);
        }
        if(data.type === 'income') {
            signedAmount = Math.abs(data.amount);
        }
        if(data.type === 'transfer') {
            signedAmount = Math.abs(data.amount);
            data.categoryId = undefined;
        }
        const transaction = await Transaction.create( 
            {
                userId: data.userId,
                type: data.type,
                accountId: data.accountId,
                toAccountId: data.toAccountId || null,
                categoryId: data.type === 'transfer' ? undefined : data.categoryId,
                amount: signedAmount,
                description: data.description,
                transactionDate: data.transactionDate,
            },
            { transaction: t }
        );

        // TRANSFER
        if(data.type === 'transfer'){

            const destination = await Account.findByPk(data.toAccountId!,
                { transaction: t}
            );
            if(!destination) {
                throw new Error('Destination account not found');
            }

            // subtract from source
            await account.update(
                { balance: Number(account.balance) -Math.abs(data.amount)},
                { transaction: t}
            );

            // add to destination
            await destination.update(
                { balance: Number(destination.balance) + Math.abs(data.amount)},
                { transaction: t}
            );
        }
        else {
            await account.update(
                { balance: Number(account.balance)+ signedAmount },
                { transaction : t }
            );
        }
        return transaction;
        });
    }
  

 export async function getTransactionByUser(userId: string){
    return Transaction.findAll( {
        where: { userId },
        order: [[ 'transactionDate', 'DESC']],
    });
 }


export async function updateTransaction(
  id: string,
  userId: string,
  data: {
    accountId?: string;
    toAccountId?: string | null;
    type?: 'income' | 'expense' | 'transfer';
    categoryId?: string;
    amount?: number;
    description?: string;
    transactionDate?: Date; 
  }
) {
    
    return sequelize.transaction(async (t) => {

        const transaction = await Transaction.findOne({
        where: { id, userId },
        transaction: t
        })

        if (!transaction) {
        throw new Error("Transaction not found")
        }

        const account = await Account.findByPk(transaction.accountId, { transaction: t })

        if (!account) {
        throw new Error("Account not found")
        }

        // ---------- REVERSE OLD EFFECT ----------

        if (transaction.type === 'transfer') {

        const destination = await Account.findByPk(transaction.toAccountId!, { transaction: t });
        if (!destination) {
            throw new Error('Destination account not found');
        }

        await account.update(
            { balance: Number(account.balance) + Math.abs(Number(transaction.amount)) },
            { transaction: t }
        )

        await destination!.update(
            { balance: Number(destination!.balance) - Math.abs(Number(transaction.amount)) },
            { transaction: t }
        )

        } else {

        await account.update(
            { balance: Number(account.balance) - Number(transaction.amount) },
            { transaction: t }
        )
        }

        // ---------- UPDATE TRANSACTION ----------
        const updatePayload: any = {};

        if (data.accountId !== undefined)
        updatePayload.accountId = data.accountId;

        if (data.toAccountId !== undefined)
        updatePayload.toAccountId = data.toAccountId;

        if (data.type !== undefined)
        updatePayload.type = data.type;

        if (data.categoryId !== undefined)
        updatePayload.categoryId = data.categoryId;

        if (data.amount !== undefined)
        updatePayload.amount = data.amount;

        if (data.description !== undefined)
        updatePayload.description = data.description;

        if (data.transactionDate !== undefined)
            updatePayload.transactionDate = data.transactionDate;
        
        await transaction.update(updatePayload, { transaction: t });

        await transaction.reload({ transaction: t});


        // ---------- APPLY NEW EFFECT ----------

        const newAccount = await Account.findByPk(transaction.accountId, { transaction: t })

        if (transaction.type === 'transfer') {

        const destination = await Account.findByPk(transaction.toAccountId!, { transaction: t });

        if(!destination) {
            throw new Error('Destination account not found.');
        }

        await newAccount!.update(
            { balance: Number(newAccount!.balance) - Math.abs(Number(transaction.amount)) },
            { transaction: t }
        )

        await destination!.update(
            { balance: Number(destination!.balance) + Math.abs(Number(transaction.amount)) },
            { transaction: t }
        )

        } else {

        await newAccount!.update(
            { balance: Number(newAccount!.balance) + Number(transaction.amount) },
            { transaction: t }
        )
        }

        return transaction
    })
    }
    export async function getTransactionById(id: string, userId: string) {
    const transaction = await Transaction.findOne({
        where: { id, userId },
    });

    if (!transaction) {
        throw new Error('Transaction not found');
    }

    return transaction;
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
            if(transaction.type === 'transfer'){

                const destination = await Account.findByPk(transaction.toAccountId!, {
                    transaction: t
                });
                if(!destination) {
                    throw new Error('Destination account not found');
                }
                // restore source account
                await account.update(
                    { balance: Number(account.balance) + Math.abs(Number(transaction.amount))},
                    { transaction: t }
                );

                // remove from destination account
                await destination.update(
                    { balance: Number(destination.balance) - Math.abs(Number(transaction.amount))},
                    { transaction: t}
                );

            } else {
            await account.update(
                { balance: Number(account.balance) - Number(transaction.amount)},
                { transaction: t}
            )};

            //Delete the transaction
            await transaction.destroy({ transaction: t});

            return { message: 'Transaction deletd successfully'};
        });
        
    }