import type { Request, Response, NextFunction } from 'express';
import { ListAndOrderService } from '../../services/order/ListAnOrderService.js';

class ListAndOrderController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id } = req.params;
      if (!order_id) {
        throw new Error('O número do pedido é obrigatório!');
      }
      const order = new ListAndOrderService();
      const listOrder = await order.execute({ order_id: order_id as string });
      res.status(200).json(listOrder);
    } catch (error) {
      next(error);
    }
  }
}
export { ListAndOrderController };
