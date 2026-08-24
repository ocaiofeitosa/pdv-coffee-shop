import prismaClient from '../../prisma/index.js';

interface AddItemsToOrderProps {
  amount: number;
  order_id: string;
  product_id: string;
}

class AddItemToOrderService {
  async execute({ amount, order_id, product_id }: AddItemsToOrderProps) {
    const orderExists = await prismaClient.order.findFirst({
      where: {
        id: order_id,
      },
    });

    if (!orderExists) {
      throw new Error('Pedido não encontrado!');
    }

    const productExists = await prismaClient.product.findFirst({
      where: {
        id: product_id,
      },
    });

    if (!productExists) {
      throw new Error('Produto não encontrado!');
    }

    const createItem = await prismaClient.item.create({
      data: {
        amount,
        price: productExists.price,
        order_id,
        product_id,
      },
      select: {
        id: true,
        amount: true,
        createdAt: true,
        product: true,
        order: true,
      },
    });

    return createItem;
  }
}

export { AddItemToOrderService };
