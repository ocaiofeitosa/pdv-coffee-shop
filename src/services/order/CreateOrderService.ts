import prismaClient from '../../prisma/index.js';

interface CreateOrderServiceProps {
  table: number;
  name: string;
}

class CreateOrderService {
  async execute({ table, name }: CreateOrderServiceProps) {
    const order = await prismaClient.order.create({
      data: {
        table,
        name,
      },
    });
    return order;
  }
}

export { CreateOrderService };
