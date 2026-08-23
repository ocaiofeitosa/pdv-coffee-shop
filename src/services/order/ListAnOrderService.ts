import prismaClient from '../../prisma/index.js';

interface ListAnOrderServiceProps {
  order_id: string;
}

class ListAndOrderService {
  async execute({ order_id }: ListAnOrderServiceProps) {
    const order = await prismaClient.order.findFirst({
      where: {
        id: order_id,
      },
      select: {
        id: true,
        table: true,
        status: true,
        draft: true,
        name: true,
        createdAt: true,
        items: true,
      },
    });
    if (!order) {
      throw new Error('Pedido não encontrado!');
    }
    return order;
  }
}

export { ListAndOrderService };
