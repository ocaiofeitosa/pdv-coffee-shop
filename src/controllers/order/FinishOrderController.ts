import type { Request, Response, NextFunction } from 'express';
import { FinishOrderService } from '../../services/order/FinishOrderService.js';

interface FinishOrderControllerType {
  order_id: string;
}

class FinishOrderController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id } = req.params as unknown as FinishOrderControllerType;
      const order = new FinishOrderService();
      const finishedhOrder = await order.execute({ order_id });
      res.status(200).json(finishedhOrder);
    } catch (error) {
      next(error);
    }
  }
}

export { FinishOrderController };
