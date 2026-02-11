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