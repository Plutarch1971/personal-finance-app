import { Budget, Category } from '../models';
import sequelize from '../config/connection';
import { QueryTypes, Op } from 'sequelize';
import { DEFAULT_CATEGORIES } from '../constants/categories';

export async function getBudgetTemplate(userId: string) {
    try {
        const parentCategories = await Category.findAll({
            where: {
                userId: { [Op.or]: [userId, null] } as any,
                type: 'expense',
                parentId: { [Op.is]: null }
            },
            order: [['name', 'ASC'], ['userId', 'DESC']]
        });

        // Only include categories that are designated as parents in our design for expenses
        const designatedParentNames = new Set(
            DEFAULT_CATEGORIES
                .filter(cat => cat.type === 'expense' && cat.parent === null)
                .map(cat => cat.name)
        );

        const template: any[] = [];
        const seenNames = new Set();

        for (const c of parentCategories) {
            if (!seenNames.has(c.name) && designatedParentNames.has(c.name)) {
                template.push({
                    categoryId: String(c.id),
                    name: c.name,
                    amount: 0
                });
                seenNames.add(c.name);
            }
        }

        return template;
    } catch (error) {
        console.error('Error in getBudgetTemplate:', error);
        throw error;
    }
}

export async function generateAutoBudget(userId: string) {
    try {
        const template = await getBudgetTemplate(userId);

        let results = await sequelize.query (
            `
            SELECT
                COALESCE(parent.name, child.name) AS "name",
                SUM(ABS(t.amount)) AS total
            FROM "Transactions" t
            JOIN "Categories" child ON t."categoryId" = child.id
            LEFT JOIN "Categories" parent ON child."parentId" = parent.id
            WHERE t."userId" = :userId
                AND t."type" = 'expense'
                AND DATE_TRUNC('month', t."transactionDate") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
            GROUP BY COALESCE(parent.name, child.name)
            `,
            {
                replacements: { userId },
                type: QueryTypes.SELECT
            }
        );

        // Fallback: If no history from last month, try current month
        if (!results || results.length === 0) {
            results = await sequelize.query (
                `
                SELECT
                    COALESCE(parent.name, child.name) AS "name",
                    SUM(ABS(t.amount)) AS total
                FROM "Transactions" t
                JOIN "Categories" child ON t."categoryId" = child.id
                LEFT JOIN "Categories" parent ON child."parentId" = parent.id
                WHERE t."userId" = :userId
                    AND t."type" = 'expense'
                    AND DATE_TRUNC('month', t."transactionDate") = DATE_TRUNC('month', CURRENT_DATE)
                GROUP BY COALESCE(parent.name, child.name)
                `,
                {
                    replacements: { userId },
                    type: QueryTypes.SELECT
                }
            );
        }

        // Re-group results if any are actually children (resilient against messy DB data)
        const parentMap = new Map<string, string>(); // child name -> parent name
        DEFAULT_CATEGORIES.forEach(cat => {
            if (cat.parent) {
                parentMap.set(cat.name, cat.parent);
            }
        });

        const regroupedResults = new Map<string, number>();
        for (const r of results as any[]) {
            const name = r.name;
            const parentName = parentMap.get(name) || name;
            regroupedResults.set(parentName, (regroupedResults.get(parentName) || 0) + Number(r.total));
        }

        // Merge results into template
        const budgets = template.map(t => {
            const total = regroupedResults.get(t.name) || 0;
            return {
                ...t,
                amount: total * 0.9
            };
        });

        return budgets;
    } catch (error) {
        console.error('Error in generateAutoBudget:', error);
        throw error;
    }
}

export async function saveBudget(userId: string, budgets: any[]) {
    const month = new Date().toISOString().slice(0,7) + '-01';

    // Clear existing budget for the month to ensure only the new set is saved
    await Budget.destroy({
        where: { userId, month }
    });

    await Promise.all (
        budgets.map(b => 
            Budget.create({
                userId,
                categoryId: b.categoryId,
                amount: b.amount,
                month
            })
        )
    );
}

export async function getBudget(userId: string) {
    return Budget.scope('currentMonth').findAll({
        where: { userId },
        include: [ { model: Category, as: 'category', attributes: [ 'name']}]
    });
}


