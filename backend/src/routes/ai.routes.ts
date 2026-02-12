import { Router } from 'express';
import {
  generateProductDescription,
  generateSEOKeywords,
  generateCategoryDescription,
} from '../controllers/ai.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/product-description', authenticate, authorize('ADMIN', 'LOJISTA'), generateProductDescription);
router.post('/seo-keywords', authenticate, authorize('ADMIN', 'LOJISTA'), generateSEOKeywords);
router.post('/category-description', authenticate, authorize('ADMIN', 'LOJISTA'), generateCategoryDescription);

export default router;
