import { SendOrderToProduction } from '../../services/order/SendOrderToProductionService.js';
import type { Request, Response, NextFunction } from 'express';

interface SendOrderParams {
  order_id: string;
}

class SendOrderToProductionController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id } = req.params as unknown as SendOrderParams;
      const order = new SendOrderToProduction();
      const sendOrder = await order.execute({
        order_id,
      });
      res.status(200).json(sendOrder);
    } catch (error) {
      next(error);
    }
  }
}

export { SendOrderToProductionController };
