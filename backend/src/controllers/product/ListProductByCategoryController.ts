import type { NextFunction, Request, Response } from 'express';
import { ListProductByCategoryService } from '../../services/product/ListProductByCategoryService.js';

class ListProductByCategoryController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const category_id = req.params.category_id as string;
    if (!category_id) {
      return res
        .status(400)
        .json({ error: 'O ID da categoria é obrigatório!' });
    }
    try {
      const listProducts = new ListProductByCategoryService();
      const products = await listProducts.execute({ category_id });
      return res.status(200).json(products);
    } catch (error) {
      return next(Error);
    }
  }
}

export { ListProductByCategoryController };
