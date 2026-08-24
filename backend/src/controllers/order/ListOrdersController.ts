import type { NextFunction, Request, Response } from 'express';
import { ListOrderService } from '../../services/order/ListOrderService.js';

class ListOrdersController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { draft } = req.query as { draft: string };

      const order = new ListOrderService();
      const listOrder = await order.execute({ draft });

      return res.status(200).json(listOrder);
    } catch (error) {
      return next(error);
    }
  }
}

export { ListOrdersController };
