import { Router } from 'express';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct, relatedProducts } from '../controllers/product.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.get('/:id/related', relatedProducts);
router.post('/create', protect, authorize('admin'), createProduct);
router.patch('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
