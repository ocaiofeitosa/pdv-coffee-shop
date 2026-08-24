import { compare } from 'bcryptjs';
import prismaClient from '../../prisma/index.js';
import jwt from 'jsonwebtoken';

interface AuthUserServiceProps {
  email: string;
  password: string;
}

class AuthUserService {
  async execute({ email, password }: AuthUserServiceProps) {
    const user = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error('E-mail e senha são obrigatórios!');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('E-mail e senha são obrigatórios!');
    }

    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: '30d',
      },
    );

    return {
      id: user.id,
      name: user.name,
      role: user.role,
      token,
    };
  }
}
export { AuthUserService };
