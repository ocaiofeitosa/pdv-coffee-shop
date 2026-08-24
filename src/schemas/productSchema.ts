import z from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'O nome do produto precisa ser um texto' })
      .min(1, { message: 'O nome do produto é obrigatório!' }),
    price: z.coerce
      .number()
      .min(1, { message: 'O preço do produto é obrigatório' }),
    description: z
      .string()
      .min(1, { message: 'A descrição do produto é obrigatória!' }),
    category_id: z.string({ message: 'A categoria do produto é obrigatória!' }),
  }),
});
export const listProductSchema = z.object({
  query: z.object({
    disabled: z.string().optional(),
  }),
});
export const listProductsByCategorySchema = z.object({
  query: z.object({
    category_id: z.string({ message: 'o ID da categoria é obrigatório!' }),
  }),
});
