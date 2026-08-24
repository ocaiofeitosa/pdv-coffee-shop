import type { NextFunction, Request, Response } from 'express';
import { DeleteItemFromOrderService } from '../../services/order/DeleteItemFromOrderService.js';

class DeleteItemFromOrderController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_id } = req.body;
      if (!item_id) {
        throw new Error('ID do item é obrigatório!');
      }
      const item = new DeleteItemFromOrderService();
      const itemDelete = await item.execute({ item_id });
      return res.status(200).json(itemDelete);
    } catch (error) {
      return next(error);
    }
  }
}

export { DeleteItemFromOrderController };
