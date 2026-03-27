//category.service.ts
import { Category, Transaction } from '../models';

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
// For user creates categories
export async function createCategoryByUser( data: {
    userId: string;
    name: string;
    type: 'income' | 'expense';
    parentId?: string | null;

}) {
    return Category.create(data);
}

// For user to delete category
export async function deleteCategory(categoryId: string, userId: string){
    // 1. Check if used in transactins
    const count = await Transaction.count({
        where: { categoryId }
    });
    if (count > 0){
        throw new Error('Cannot delete category used in transaction');
    }

    // 2. Delete children first
    await Category.destroy({
        where: { parentId: categoryId, userId}
    });

    // 3. Delete parent
    return Category.destroy({
        where: { id: categoryId, userId }
    });
}

export async function getCategoryById(id: string, userId: string) {
    return Category.findOne({
        where: { id, userId },
    });
}
    // 4. Update category
export async function updateCategory(
    id: string, 
    userId: string, 
    data: { name: string; parentId: string | null}
    ) {
      await Category.update(data,  {
        where: { id, userId}, 
    });
}
