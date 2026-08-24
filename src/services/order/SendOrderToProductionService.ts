import prismaClient from '../../prisma/index.js';

interface OrderToProductionTypes {
  order_id: string;
}

class SendOrderToProduction {
  async execute({ order_id }: OrderToProductionTypes) {
    if (!order_id) {
      throw new Error(
        'É necessário haver um pedido para enviar para a produção!',
      );
    }
    const order = await prismaClient.order.findFirst({
      where: {
        id: order_id,
        draft: true,
      },
    });
    if (!order) {
      throw new Error(
        'Pedido não encontrado ou já foi enviado para a produção!',
      );
    }
    const orderExists = await prismaClient.order.update({
      where: {
        id: order_id,
      },
      data: {
        draft: false,
      },
    });
    return orderExists;
  }
}

export { SendOrderToProduction };
