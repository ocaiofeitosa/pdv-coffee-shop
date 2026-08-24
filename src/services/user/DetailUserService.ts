import prismaClient from '../../prisma/index.js';

class DetailUserService {
  async execute(id: string) {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          role: true,
        },
      });
      if (!user) throw new Error('Usário não encontrado!');
      return user;
    } catch (error) {
      throw new Error('Usário não encontrado!');
    }
  }
}

export { DetailUserService };
