import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import { Category } from '../models/category';


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
    if (!req.user) {
        return res.status(401).json({ error: 'Unathorized'});
    }
    const existingCategory = await Category.findOne({
        where: {
           name: req.body.name,
           userId: req.user.id,
           type: req.body.type
       }
     });

    if (existingCategory) {
       return res.status(400).json({error: 'Category already exists'})
   }

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

// export async function createCategoryByUser(req: Request, res: Response) {

//     if (!req.user) {
//         return res.status(401).json({ error: 'Unathorized'});
//     }
//     const existingCategory = await Category.findOne({
//         where: {
//             name: req.body.name,
//             userId: req.user.id,
//             type: req.body.type
//         }
//     });

//     if (existingCategory) {
//         return res.status(400).json({error: 'Category already exists'})
//     }
//     try {
//         const userId = (req.user as any).id;
//         const { name, type, parentId} = req.body;

//         const category = await categoryService.createCategoryByUser({ userId, name, type, parentId});
//         res.status(201).json(category);
//     } catch (err: any) {
//         res.status(400).json(({ error: err.message}));
//     }
// }

export async function deleteCategory(req: Request, res: Response) {
    try {
        const userId = (req.user as any).id;
        const id  = req.params.id as string;

        await categoryService.deleteCategory(id, userId);
            res.json({ message: 'Deleted successfully'});
        } catch (err:any) {
        res.status(400).json({ error: err.message })
    }
}

export async function updateCategory(req: Request, res: Response) {
    try {
      const userId = (req.user as any).id;
      const id  = req.params.id as string;
      if (!id) return res.status(400).json({error: 'Missing category id'});

      const { name, parentId, type } = req.body;

      // Basic validation
      if(!name || !type) {
        return res.status(400).json({ error: 'Name and type are required'});
      }

      // Prevent self-parenting
      if (parentId === id) {
        return res.status(400).json(({ error: 'Category cannot be its own parent'}));
      }

      const existing = await categoryService.getCategoryById(id, userId);

      if (!existing) {
        return res.status(404).json({ error: 'Category not found'});
      }
      if (existing.type !== type) {
        return res.status(400).json ({
            error: 'Cannot change category type (income/expense)',
        });
      }
      // Update category
      const updated = await categoryService.updateCategory(id, userId, {
        name,
        parentId: parentId || null,
      });
        return res.json(updated);
    } catch (error: any) {
        console.error('Update category error:', error);
        return res.status(500).json({
            error: 'Failed to update category',
        });
    }
}
