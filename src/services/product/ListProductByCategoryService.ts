import prismaClient from '../../prisma/index.js';

interface ListProductByCategoryProps {
  category_id: string;
}

class ListProductByCategoryService {
  async execute({ category_id }: ListProductByCategoryProps) {
    try {
      const category = await prismaClient.category.findUnique({
        where: {
          id: category_id,
        },
      });
      if (!category) {
        throw new Error('Categoria não encontrada!');
      }
      const products = await prismaClient.product.findMany({
        where: {
          category_id: category_id,
          disabled: false,
        },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          banner: true,
          disabled: true,
          category_id: true,
          category: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
      return products;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Falha ao buscar produtos da categoria');
    }
  }
}

export { ListProductByCategoryService };
