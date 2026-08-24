import prismaClient from '../../prisma/index.js';

interface CreateCategory {
  name: string;
}

class CreateCategoryService {
  async execute({ name }: CreateCategory) {
    const findCategoryByName = await prismaClient.category.findFirst({
      where: {
        name,
      },
    });
    if (findCategoryByName) {
      throw new Error('Categoria já existe');
    }
    const category = prismaClient.category.create({
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
    return category;
  }
}
export { CreateCategoryService };
