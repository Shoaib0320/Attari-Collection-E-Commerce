import { Router } from 'express';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct, relatedProducts, uploadMedia } from '../controllers/product.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.get('/:id/related', relatedProducts);
router.post('/create', protect, authorize('admin'), createProduct);
router.patch('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.post('/upload', protect, authorize('admin'), upload.single('file'), uploadMedia);

export default router;
