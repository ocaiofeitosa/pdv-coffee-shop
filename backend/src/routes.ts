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
  listProductsByCategorySchema,
  listProductSchema,
} from './schemas/productSchema.js';
import { ListProductController } from './controllers/product/ListProductController.js';
import { DeleteProductController } from './controllers/product/DeleteProductController.js';
import { ListProductByCategoryController } from './controllers/product/ListProductByCategoryController.js';
import { CreateOrderController } from './controllers/order/CreateOrderController.js';
import {
  addItemToOrderSchema,
  createOrderSchema,
  deleteOrderSchema,
  finishOrderSchema,
  sendOrderToProductionSchema,
} from './schemas/orderSchema.js';
import { ListOrdersController } from './controllers/order/ListOrdersController.js';
import { AddItemToOrderController } from './controllers/order/AddItemToOrderController.js';
import { DeleteItemFromOrderController } from './controllers/order/DeleteItemFromOrderController.js';
import { ListAndOrderController } from './controllers/order/ListAnOrderController.js';
import { SendOrderToProductionController } from './controllers/order/SendOrderToProductionController.js';
import { FinishOrderController } from './controllers/order/FinishOrderController.js';
import { DeleteOrderController } from './controllers/order/DeleteOrderController.js';
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
  upload.single('banner'),
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
router.get(
  '/category/:category_id/products',
  isAuthenticated,
  validateSchema(listProductsByCategorySchema),
  new ListProductByCategoryController().handle,
);

// order routes
router.post(
  '/order',
  isAuthenticated,
  isAdmin,
  validateSchema(createOrderSchema),
  new CreateOrderController().handle,
);
router.get('/orders', isAuthenticated, new ListOrdersController().handle);
router.post(
  '/order/add/:order_id/:product_id',
  isAuthenticated,
  isAdmin,
  validateSchema(addItemToOrderSchema),
  new AddItemToOrderController().handle,
);
router.delete(
  '/order/remove/:item_id',
  isAuthenticated,
  isAdmin,
  new DeleteItemFromOrderController().handle,
);
router.get(
  '/order/detail/:order_id',
  isAuthenticated,
  new ListAndOrderController().handle,
);
router.put(
  '/order/send/:order_id',
  isAuthenticated,
  validateSchema(sendOrderToProductionSchema),
  new SendOrderToProductionController().handle,
);
router.put(
  '/order/finish/:order_id',
  isAuthenticated,
  validateSchema(finishOrderSchema),
  new FinishOrderController().handle,
);
router.delete(
  '/order/delete/:order_id',
  isAuthenticated,
  validateSchema(deleteOrderSchema),
  new DeleteOrderController().handle,
);
export { router };
