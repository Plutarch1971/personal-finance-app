//category.service.ts
import { Category } from '../models';

interface CreateCategoryInput{
    userId: string;
    name: string;
    type: 'income' | 'expense';
    parentId?: string;
}

export async function createCategory(data: CreateCategoryInput) {
    return Category.create({
        userId: data.userId,
        name: data.name,
        type: data.type,
        parentId: data.parentId ?? null,
    });
}
export async function getCategoriesByUser(
    userId: string,
    type?: 'income' | 'expense'
){
    const where: any = { userId };
    
    if(type) {
        where.type = type;
    }
    
    return Category.findAll({
        where,
        order: [[ 'name', 'ASC']],
    });
}

export async function seedDefaultCategories(userId: string) {

    const categories: Array<{ name: string; type: 'income' | 'expense'}> = [
        { name: 'Salary', type: 'income'},
        { name: 'Bonus', type: 'income' },
        { name: 'Frelance', type: 'income'},
        { name: 'Interest', type: 'income'},
        { name: 'Other Income', type: 'income'},

        { name: 'Food', type: 'expense' },
        { name: 'Transportation', type: 'expense' },
        { name: 'Entertainment', type: 'expense' },
        { name: 'Healthcare', type: 'expense'},
        { name: 'Education', type: 'expense'},
        { name: 'Housing', type: 'expense'},
        { name: 'Other Expense', type: 'expense'}
    ];

    const rows = categories.map((c) => ({
        ...c,
        userId
    }));

    await Category.bulkCreate(rows);
}