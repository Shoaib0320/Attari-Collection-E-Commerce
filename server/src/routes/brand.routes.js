import { Router } from 'express';
import { 
  listBrands, 
  getBrand,
  createBrand, 
  updateBrand, 
  deleteBrand, 
  getBrandProducts,
  getFeaturedBrands,
  updateBrandLogo
} from '../controllers/brand.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

// Public routes
router.get('/', listBrands);
router.get('/featured', getFeaturedBrands);
router.get('/:id', getBrand);
router.get('/:id/products', getBrandProducts);

// Protected admin routes
router.post('/', protect, authorize('admin'), createBrand);
router.patch('/:id', protect, authorize('admin'), updateBrand);
router.patch('/:id/logo', protect, authorize('admin'), updateBrandLogo);
router.delete('/:id', protect, authorize('admin'), deleteBrand);

export default router;