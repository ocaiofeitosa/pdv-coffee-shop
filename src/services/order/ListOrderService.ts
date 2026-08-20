import prismaClient from '../../prisma/index.js';

interface ListOrdersServiceProps {
  draft?: string;
}

class ListOrderService {
  async execute({ draft }: ListOrdersServiceProps) {
    const listOrders = await prismaClient.order.findMany({
      where: {
        draft: draft === 'true' ? true : false,
      },
      select: {
        id: true,
        name: true,
        table: true,
        createdAt: true,
        draft: true,
        status: true,
        items: {
          select: {
            id: true,
            amount: true,
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                banner: true,
              },
            },
          },
        },
      },
    });
    return listOrders;
  }
}
export { ListOrderService };
