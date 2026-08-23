import prismaClient from '../../prisma/index.js';

interface DeleteItemProps {
  item_id: string;
}

class DeleteItemFromOrderService {
  async execute({ item_id }: DeleteItemProps) {
    if (!item_id) {
      throw new Error('É necessário selecionar um item para excluir!');
    }
    const item = await prismaClient.item.findFirst({
      where: {
        id: item_id,
      },
    });
    if (!item) {
      throw new Error('Item não encontrado!');
    }
    const itemDeleted = await prismaClient.item.delete({
      where: {
        id: item_id,
      },
    });
    return itemDeleted;
  }
}

export { DeleteItemFromOrderService };
