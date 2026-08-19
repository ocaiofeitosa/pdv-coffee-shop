import type { Request, Response } from 'express';
import { CreateCategoryService } from '../../services/category/CreateCategoryService.js';

class CreateCategoryController {
  async handle(req: Request, res: Response) {
    const { name } = req.body;

    const createCategoryService = new CreateCategoryService();

    const category = await createCategoryService.execute({
      name,
    });
    res.status(201).json(category);
  }
}

export { CreateCategoryController };
