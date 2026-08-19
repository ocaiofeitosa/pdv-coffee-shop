import z from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'O nome da categoria precisa ser um texto' })
      .min(3, { message: 'O nome precisa possuir pelo menos 3 caracteres' }),
  }),
});
