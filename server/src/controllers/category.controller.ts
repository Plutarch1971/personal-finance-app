import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';


export async function getCategories(req: Request, res: Response){
    try {
        const userId = req.user!.id;
        const { type } = req.query;

        //Validate type if present
        if (type && type !== 'income' && type !== 'expense'){
            return res.status(400).json({ error: 'Invalid category type'});
        }

        const categories = await categoryService.getCategoriesByUser(
            userId,
            type as 'income' | 'expense' | undefined
        );
        res.json(categories);
    } catch (error: any){
        console.error("Failed to fetch categories", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
}
export async function createCategory(req: Request, res: Response){
    try{
        const userId = req.user!.id;
    const { name, type, parentId} = req.body;
    const category = await categoryService.createCategory({
    userId,
    name,
    type,
    parentId,
    });
    res.status(201).json(category);
    } catch (error: any){
      res.status(400).json({error: error.message});
    }
}

