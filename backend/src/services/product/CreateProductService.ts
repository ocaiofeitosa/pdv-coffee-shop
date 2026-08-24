import prismaClient from '../../prisma/index.js';
import cloudinary from '../../config/cloudinary.js';
import { Readable } from 'node:stream';
interface CreateProductTypes {
  name: string;
  price: string;
  description: string;
  category_id: string;
  imageBuffer: Buffer;
  imageName: string;
}

class CreateProductService {
  async execute({
    name,
    price,
    description,
    category_id,
    imageBuffer,
    imageName,
  }: CreateProductTypes) {
    const categoryExists = await prismaClient.category.findFirst({
      where: {
        id: category_id,
      },
    });
    const productNameExists = await prismaClient.product.findFirst({
      where: {
        name,
      },
    });
    if (productNameExists) {
      throw new Error(
        'Já existe um produto com esse nome. Por favor, cadastre outro nome!',
      );
    }
    if (!categoryExists) {
      throw new Error('Categoria não encontrada!');
    }
    let bannerURL = '';
    try {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'products',
            resource_type: 'image',
            public_id: `${Date.now()}-${imageName.split('.')[0]}`,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );
        const bufferStream = Readable.from(imageBuffer);
        bufferStream.pipe(uploadStream);
      });
      bannerURL = result.secure_url;
    } catch (error) {
      throw new Error('Erro ao fazer o upload da imagem!');
    }
    const product = await prismaClient.product.create({
      data: {
        name,
        price: parseInt(price),
        description,
        category_id,
        banner: bannerURL,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        category_id: true,
        banner: true,
        createdAt: true,
      },
    });
    return product;
  }
}
export { CreateProductService };
