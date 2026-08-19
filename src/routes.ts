import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/multer.js';
import { CreateUserController } from './controllers/user/CreateUserController.js';
import { validateSchema } from './middlewares/validateSchema.js';
import { authUserSchema, createUserSchema } from './schemas/userSchema.js';
import { AuthUserController } from './controllers/user/AuthUserController.js';
import { DetailUserController } from './controllers/user/DetailUserController.js';
import { isAuthenticated } from './middlewares/isAuthenticated.js';
import { CreateCategoryController } from './controllers/category/CreateCategoryController.js';
import { createCategorySchema } from './schemas/categorySchema.js';
import { isAdmin } from './middlewares/isAdmin.js';
import { DetailCategoryController } from './controllers/category/ListCategoryController.js';
import { CreateProductController } from './controllers/product/CreateProductController.js';
import {
  createProductSchema,
  listProductSchema,
} from './schemas/productSchema.js';
import { ListProductController } from './controllers/product/ListProductController.js';
import { DeleteProductController } from './controllers/product/DeleteProductController.js';
const router = Router();
const upload = multer(uploadConfig);
// user routes
router.post(
  '/users',
  validateSchema(createUserSchema),
  new CreateUserController().handle,
);
router.post(
  '/session',
  validateSchema(authUserSchema),
  new AuthUserController().handle,
);
router.get('/me', isAuthenticated, new DetailUserController().handle);

// category routes
router.post(
  '/category',
  isAuthenticated,
  isAdmin,
  validateSchema(createCategorySchema),
  new CreateCategoryController().handle,
);
router.get(
  '/categories',
  isAuthenticated,
  new DetailCategoryController().handle,
);

// product routes
router.post(
  '/product',
  isAuthenticated,
  isAdmin,
  upload.single('file'),
  validateSchema(createProductSchema),
  new CreateProductController().handle,
);
router.get(
  '/products',
  isAuthenticated,
  validateSchema(listProductSchema),
  new ListProductController().handle,
);
router.delete(
  '/product/:id',
  isAuthenticated,
  isAdmin,
  new DeleteProductController().handle,
);
export { router };
