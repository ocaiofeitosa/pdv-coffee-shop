import prismaClient from '../../prisma/index.js';

class DetailCategoryService {
  async execute(id: string) {
    try {
      const category = await prismaClient.category.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      });
      if (!category) {
        throw new Error('Categoria não encontrada!');
      }
      return category;
    } catch (error) {
      throw new Error('Categoria não encontrada!');
    }
  }
}

export { DetailCategoryService };
