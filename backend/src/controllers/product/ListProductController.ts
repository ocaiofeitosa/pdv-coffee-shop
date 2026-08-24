import type { Request, Response, NextFunction } from 'express';

import { ListProductService } from '../../services/product/ListProductService.js';

class ListProductController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const disabled = req.query.disabled as string;
    console.log(disabled);
    const listProducts = new ListProductService();
    const products = await listProducts.execute({
      disabled,
    });

    return res.status(200).json(products);
  }
}

export { ListProductController };
