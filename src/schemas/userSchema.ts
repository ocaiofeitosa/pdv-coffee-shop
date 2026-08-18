import z from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'O nome precisa ser um texto' })
      .min(3, { message: 'O nome precisa contar pelo menos 3 caracteres' }),
    email: z.email({ message: 'Insira um e-mail válido' }),
    password: z
      .string()
      .min(6, { message: 'A senha deve conter pelo menps 6 caracteres' }),
  }),
});

export const authUserSchema = z.object({
  body: z.object({
    email: z.email({ message: 'Insira um e-mail válido' }),
    password: z.string({ message: 'A senha é obrigatória' }),
  }),
});
