import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  getOrdersByTenant,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/order.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, authorize('ADMIN'), getAllOrders);
router.get('/tenant/:tenantId', authenticate, authorize('ADMIN', 'LOJISTA'), getOrdersByTenant);
router.get('/:id', authenticate, getOrderById);
router.post('/', createOrder);
router.patch('/:id/status', authenticate, authorize('ADMIN', 'LOJISTA'), updateOrderStatus);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteOrder);

export default router;
