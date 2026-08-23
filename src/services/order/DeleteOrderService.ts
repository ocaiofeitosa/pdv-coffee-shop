import prismaClient from '../../prisma/index.js';

interface DeleteOrderTypes {
  order_id: string;
}

class DeleteOrderSerivce {
  async execute({ order_id }: DeleteOrderTypes) {
    if (!order_id) {
      throw new Error('É necessário informar o número de um pedido!');
    }
    const orderExists = await prismaClient.order.findFirst({
      where: {
        id: order_id,
      },
    });
    if (!orderExists) {
      throw new Error('Esse pedido não existe ou já foi excluído!');
    }
    const deleteOrder = await prismaClient.order.delete({
      where: {
        id: order_id,
      },
    });
    return deleteOrder;
  }
}

export { DeleteOrderSerivce };
