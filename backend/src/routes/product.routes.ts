import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  getProductsByTenant,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/tenant/:tenantId', getProductsByTenant);
router.get('/:id', getProductById);
router.post('/', authenticate, authorize('ADMIN', 'LOJISTA'), createProduct);
router.put('/:id', authenticate, authorize('ADMIN', 'LOJISTA'), updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN', 'LOJISTA'), deleteProduct);

export default router;
