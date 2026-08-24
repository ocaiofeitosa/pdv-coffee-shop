import prismaClient from '../../prisma/index.js';

interface ListProductServiceProps {
  disabled?: string;
}

class ListProductService {
  async execute({ disabled }: ListProductServiceProps) {
    try {
      const products = await prismaClient.product.findMany({
        where: {
          disabled: disabled === 'true' ? true : false,
        },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          category: true,
          banner: true,
          disabled: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return products;
    } catch (error) {
      throw new Error('Produto não encontrado!');
    }
  }
}

export { ListProductService };
