import type { NextFunction, Request, Response } from 'express';
import { DeleteOrderSerivce } from '../../services/order/DeleteOrderService.js';

interface DeleteOrderControllerType {
  order_id: string;
}

class DeleteOrderController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id } = req.params as unknown as DeleteOrderControllerType;
      const order = new DeleteOrderSerivce();
      const deleteOrder = await order.execute({ order_id });
      return res.status(200).json(deleteOrder);
    } catch (error) {
      return next(error);
    }
  }
}

export { DeleteOrderController };
