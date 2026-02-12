import { Router } from 'express';
import {
  getAllTenants,
  getTenantBySlug,
  createTenant,
  updateTenant,
  deleteTenant,
} from '../controllers/tenant.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllTenants);
router.get('/:slug', getTenantBySlug);
router.post('/', authenticate, authorize('ADMIN'), createTenant);
router.put('/:id', authenticate, authorize('ADMIN', 'LOJISTA'), updateTenant);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteTenant);

export default router;
