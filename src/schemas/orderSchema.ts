import z from 'zod';

export const createOrderSchema = z.object({
  body: {
    table: z.coerce
      .number()
      .min(1, { message: 'O número da mesa é obrigatório!' }),
  },
});
