import { Op, fn, literal, col } from 'sequelize';
import { Transaction, Category, Account } from '../models';

/** Monthly income / expense summary
 */
interface MonthlySummaryRow{
    income: string | number;
    expense: string | number;
}
export async function getMonthlySummary(
    userId: string,
    startDate: string,
    endDate: string

) {
    const rows = await Transaction.findAll({
        where: {
            userId,
            type: { [Op.in]: ['income', 'expense']}, // exclude transfer
            transactionDate: {
                [Op.between]: [startDate,endDate],
            },
        },
        attributes: [
            [
                fn(
                    'SUM',
                    literal(`
                        CASE
                        WHEN amount > 0 THEN amount
                        ELSE 0
                        END`
                    ),
                ),
                'income',
            ],
            [
                fn(
                    'SUM',
                    literal(`
                        CASE
                        WHEN amount < 0 THEN ABS(amount)
                        ELSE 0
                        END
                    `),
                ),
                'expense',
            ],
        ],
        raw: true,
    }) as unknown as MonthlySummaryRow[];
    
    const income = Number(rows[0].income || 0 );
    const expense = Number(rows[0].expense || 0);

    return {
        income,
        expense,
        net: income - expense,
    };
}

export async function getExpenseByCategory(
    userId: string,
    startDate: string,
    endDate: string
) {
    return Transaction.findAll({
        where: {
            userId,
            amount: { [Op.lt]: 0 },
            transactionDate: {
                [Op.between]: [ startDate, endDate],
            },
        },
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['name'],
            },
        ],
        attributes: [
            [ fn('SUM', fn('ABS', col('amount'))), 'total'],
        ],
        group: ['category.id', 'category.name'],
        raw: true,
    });
}

export async function getIncomeByCategory( userId: string) {
    const end = new Date(); //today
    const start = new Date(end);
    start.setDate(end.getDate() -30);

    const startDate= start.toISOString().slice(0, 10);  //YYYY-MM-DD
    const endDate = end.toISOString().slice(0, 10);

    return Transaction.findAll({
        where: {
            userId,
            type: 'income',
            amount: { [Op.gt] : 0 }, // income only
            transactionDate: {
                [Op.between]: [startDate, endDate],
            },
        },
         include: [
            {
                model: Category,
                as: 'category',
                attributes: ['name'],
            },
         ],
         attributes: [[fn('SUM', col('amount')), 'total']],
         group: ['category.id', 'category.name'],
         raw: true,
    });
}


export async function getAccountBalances(userId: string) {
    return Account.findAll({
        where: { userId },
        attributes: [ 'id', 'name', 'type', 'balance'],
        order: [[ 'name', 'ASC']],
    });
}

export async function getExpenseThirty(userId: string){
    const end = new Date();
     const start = new Date(end);
    start.setDate(end.getDate() -30);

    const startDate = start.toISOString().slice(0,10);
    const endDate = end.toISOString().slice(0,10);

    const result = await Transaction.findAll({
        where: {
            userId,
            amount: { [Op.lt]: 0},
            transactionDate: {
                [Op.between]: [startDate, endDate]
            },

        },
        include:[
            {
            model: Category,
            as: 'category',
            attributes:['id', 'name'],
            },
        ],
        attributes: [
           [fn('SUM', fn('ABS', col('amount'))), 'total'],
        ],
        group: ['category.id', 'category.name'],
        order: [[fn('SUM', fn('ABS', col('amount'))), 'DESC']],
            
    });
    return result;
}

