import prismaClient from '../../prisma/index.js';

interface FinishOrderProps {
  order_id: string;
}

class FinishOrderService {
  async execute({ order_id }: FinishOrderProps) {
    if (!order_id) {
      throw new Error('É necessário informar um pedido!');
    }
    const order = await prismaClient.order.findFirst({
      where: {
        id: order_id,
        draft: false,
        status: false,
      },
    });
    if (!order) {
      throw new Error(
        'Esse pedido já foi finalizado ou ainda não foi enviado para a produção!',
      );
    }
    const orderExists = await prismaClient.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: true,
      },
    });
    return orderExists;
  }
}

export { FinishOrderService };
