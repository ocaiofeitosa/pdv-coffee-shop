import z from 'zod';

export const createOrderSchema = z.object({
  body: {
    table: z.coerce
      .number()
      .min(1, { message: 'O número da mesa é obrigatório!' }),
  },
});

export const addItemToOrderSchema = z.object({
  body: z.object({
    amount: z.number().int().positive(),
    order_id: z.string({ message: 'O número do pedido é obrigatório!' }),
    product_id: z.string({ message: 'O número do produto é obrigatório!' }),
  }),
});
