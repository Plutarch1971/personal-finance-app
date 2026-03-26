import { Op, fn, literal, col } from 'sequelize';
import { Transaction, Category, Account } from '../models';

import sequelize from '../config/connection';
import { QueryTypes } from 'sequelize';

/** Monthly income / expense summary
 */

export async function getExpensesByCategory(
    userId: string,
    startDate: string,
    endDate: string
) {
    const results = await sequelize.query (
        `
        SELECT
            COALESCE(parent.name, child.name) AS name,
            SUM(ABS(t.amount)) AS value
        FROM "Transactions" t
        JOIN "Categories" child
            ON t."categoryId" = child.id
        LEFT JOIN "Categories" parent
            ON child."parentId" = parent.id
        WHERE t.type = 'expense'
            AND t."userId" = :userId
            AND t."transactionDate" BETWEEN :startDate AND :endDate
        GROUP BY COALESCE(parent.name, child.name)
        ORDER BY value DESC
        `,
        {
            replacements: { userId, startDate, endDate },
            type: QueryTypes.SELECT
        }
    );
    return results;
}

export async function getMonthlyExpensesByCategory(
    userId: string,
    startDate: string,
    endDate: string
) {
    const results = await sequelize.query (
        `
        SELECT
        COALESCE(parent.name, child.name) AS name,
        SUM(ABS(t.amount)) AS value
        FROM "Transactions" t
        JOIN "Categories" child
            ON t."categoryId" = child.id
        LEFT JOIN "Categories" parent
            ON child."parentId" = parent.id
        WHERE t.type = 'expense'
            AND t."userId" = :userId
            AND t.amount < 0 
            AND t."transactionDate" BETWEEN :startDate AND :endDate
        GROUP BY COALESCE(parent.name, child.name)
        ORDER BY value DESC
        `,
        {
            replacements: { userId, startDate, endDate },
            type: QueryTypes.SELECT,
        }
    );

    return results;
}

export async function getMonthlySummary(
    userId: string,
    startDate?: string,
    endDate?: string
) {
    const hasRange = Boolean(startDate && endDate);
    const result = await sequelize.query(
        `
        SELECT
            SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS income,
            SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) AS expense
        FROM  "Transactions"
        WHERE "userId" = :userId
            AND (
            (:hasRange = true AND "transactionDate" BETWEEN :startDate AND :endDate)
            OR
            (:hasRange = false AND DATE_TRUNC('month', "transactionDate") = 
            DATE_TRUNC('month', CURRENT_DATE))
            )
        `,
        {
            replacements: { userId, startDate, endDate, hasRange },
            type: QueryTypes.SELECT,
        }
    );

    const row = (result[0] as { income?: string | number | null; 
                                expense?: string | number | null }) ?? {};

    return {
        income: Number(row.income || 0),
        expense: Number(row.expense || 0),
        net: Number(row.income || 0) - Number(row.expense || 0),
    };
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

export async function getMonthlyExpenseTrend(userId: string) {
    const results = await sequelize.query(
        `
        SELECT
        TO_CHAR(DATE_TRUNC('month', t."transactionDate"), 'Mon YYYY') AS month,
        SUM(ABS(t.amount)) AS total
        FROM "Transactions" t
        WHERE t."userId" = :userId
            AND t.amount < 0
            AND t."transactionDate" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', t."transactionDate")
        ORDER BY DATE_TRUNC('month', t."transactionDate")
        `,
        {
            replacements: { userId },
            type: QueryTypes.SELECT,
        }
    );
    return results;
}

