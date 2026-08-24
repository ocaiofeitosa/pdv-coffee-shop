import prismaClient from '../../prisma/index.js';

interface ListOrdersServiceProps {
  draft?: string;
}

class ListOrderService {
  async execute({ draft }: ListOrdersServiceProps) {
    const isDraft = draft !== undefined ? draft === 'true' : false;
    const listOrders = await prismaClient.order.findMany({
      where: {
        draft: isDraft,
        status: false,
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
