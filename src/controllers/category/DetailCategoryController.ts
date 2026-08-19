import type { Request, Response, NextFunction } from 'express';

import { DetailCategoryService } from '../../services/category/DetailCategoryService.js';

class DetailCategoryController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const category_id = req.category_id;
    const detailCategory = new DetailCategoryService();
    const category = detailCategory.execute(category_id);

    return res.json(category);
  }
}

export { DetailCategoryController };
