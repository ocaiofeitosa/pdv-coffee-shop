import { Router } from 'express';
import { CreateUserController } from './controllers/user/CreateUserController.js';
import { validateSchema } from './middlewares/validateSchema.js';
import { authUserSchema, createUserSchema } from './schemas/userSchema.js';
import { AuthUserController } from './controllers/user/AuthUserController.js';
import { DetailUserController } from './controllers/user/DetailUserController.js';
import { isAuthenticated } from './middlewares/isAuthenticated.js';
import { CreateCategoryController } from './controllers/category/CreateCategoryController.js';
import { createCategorySchema } from './schemas/categorySchema.js';
import { isAdmin } from './middlewares/isAdmin.js';
import { DetailCategoryController } from './controllers/category/DetailCategoryController.js';
const router = Router();

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
  isAdmin,
  new DetailCategoryController().handle,
);

export { router };
