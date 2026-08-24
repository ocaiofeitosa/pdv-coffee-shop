import type { NextFunction, Request, Response } from 'express';
import { DeleteProductService } from '../../services/product/DeleteProductService.js';

class DeleteProductController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      if (!id) {
        throw new Error('ID do produto é obrigatório!');
      }
      const deleteProductService = new DeleteProductService();
      const product = await deleteProductService.execute({ id });
      return res.status(200).json(product);
    } catch (error) {
      return next(error);
    }
  }
}

export { DeleteProductController };
