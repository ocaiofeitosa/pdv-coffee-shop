import type { Request, Response, NextFunction } from 'express';
import prismaClient from '../prisma/index.js';
import { error } from 'node:console';

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user_id = req.user_id;
  if (!user_id) {
    return res.status(401).json({ error: 'Não autorizado!' });
  }

  try {
    const user = await prismaClient.user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        role: true,
      },
    });
    if (!user || user.role !== 'ADMIN') {
      return res
        .status(400)
        .json({ error: 'Acesso negado. Requer perfil de administrador!' });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao verificar permissões' });
  }
}
