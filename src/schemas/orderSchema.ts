import z from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    table: z.coerce
      .number()
      .min(1, { message: 'O número da mesa é obrigatório!' }),
    name: z.string().min(1, { message: 'O nome é obrigatório!' }),
  }),
});

export const addItemToOrderSchema = z.object({
  body: z.object({
    amount: z.number().int().positive(),
    order_id: z.string({ message: 'O número do pedido é obrigatório!' }),
    product_id: z.string({ message: 'O número do produto é obrigatório!' }),
  }),
});

export const sendOrderToProductionSchema = z.object({
  params: z.object({
    order_id: z.string({ message: 'O número do pedido é obrigatório!' }).min(1),
  }),
});

export const finishOrderSchema = z.object({
  params: z.object({
    order_id: z.string({ message: 'O número do pedido é obrigatório' }).min(1),
  }),
});

export const deleteOrderSchema = z.object({
  params: z.object({
    order_id: z.string({ message: 'O número do pedido é obrigatório' }).min(1),
  }),
});
