import prismaClient from '../../prisma/index.js';

interface DeleteProductProps {
  id: string;
}

class DeleteProductService {
  async execute({ id }: DeleteProductProps) {
    try {
      await prismaClient.product.update({
        where: {
          id: id,
        },
        data: {
          disabled: true,
        },
      });
      return { message: 'Produto deletado/arquivado com sucesso!' };
    } catch (error) {
      console.log(error);
      throw new Error('Ocorreu um erro ao deletar o produto');
    }
  }
}

export { DeleteProductService };
