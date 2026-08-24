import type { Request, Response, NextFunction } from 'express';

import { ListCategoryController } from '../../services/category/ListCategoryService.js';

class DetailCategoryController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const listCategory = new ListCategoryController();
    const categories = await listCategory.execute();

    return res.status(200).json(categories);
  }
}

export { DetailCategoryController };
