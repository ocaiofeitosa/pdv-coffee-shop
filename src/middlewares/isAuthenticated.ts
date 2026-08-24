import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface Payload {
  sub: string;
}

const { verify } = jwt;

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      error: 'Token não fornecido',
    });
  }

  const token = authToken.split(' ')[1];

  try {
    const { sub } = verify(token!, process.env.JWT_SECRET as string) as Payload;

    req.user_id = sub;

    return next();
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido!',
    });
  }
}
