import prismaClient from '../../prisma/index.js';
import { hash } from 'bcryptjs';
interface CreateUser {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ name, email, password }: CreateUser) {
    const findUserByEmail = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });
    if (findUserByEmail) {
      throw new Error('user email already exists');
    }

    const passwordHash = await hash(password, 8);

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return user;
  }
}

export { CreateUserService };
