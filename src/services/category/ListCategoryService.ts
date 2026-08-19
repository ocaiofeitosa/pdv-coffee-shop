import prismaClient from '../../prisma/index.js';

class ListCategoryController {
  async execute() {
    try {
      const categories = await prismaClient.category.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return categories;
    } catch (error) {
      throw new Error('Categoria não encontrada!');
    }
  }
}

export { ListCategoryController };
