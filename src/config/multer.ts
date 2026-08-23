import multer from 'multer';

export default {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  fileFilter: (req: any, file: Express.Multer.File, callback: any) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error(
          'Formato de arquivo inválido. É suportado apenas JPEG, PNG e JPG!',
        ),
      );
    }
  },
};
