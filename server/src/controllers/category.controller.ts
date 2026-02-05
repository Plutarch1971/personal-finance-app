import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';

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

export async function getCategories(req: Request, res: Response){
    try {
        const userId = req.user!.id;
        const categories = await categoryService.getCategoriesByUser(userId);
        res.json(categories);
    } catch (error: any){
        res.status(400).json({ error: error.message });
    }
}