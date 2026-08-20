import type { Request, Response, NextFunction } from 'express';
import { CreateOrderService } from '../../services/order/CreateOrderService.js';

class CreateOrderController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { table, name } = req.body;
      const parsedTable = Number(table);
      const order = new CreateOrderService();
      const newOrder = await order.execute({
        table: parsedTable,
        name,
      });

      res.status(201).json(newOrder);
    } catch (error) {
      next(error);
    }
  }
}
export { CreateOrderController };
