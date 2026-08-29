import type { NextFunction, Request, Response } from 'express';
import { AddItemToOrderService } from '../../services/order/AddItemToOrderService.js';

class AddItemToOrderController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount } = req.body;
      const { order_id, product_id } = req.params;
      const item = new AddItemToOrderService();
      const newItem = await item.execute({
        amount,
        order_id,
        product_id,
      });
      res.status(201).json(newItem);
    } catch (error) {
      if (error) {
        next(error);
      }
    }
  }
}

export { AddItemToOrderController };
