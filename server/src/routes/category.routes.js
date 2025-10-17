// import { Router } from 'express';
// import { listCategories, createCategory, updateCategory, deleteCategory, listSubcategories } from '../controllers/category.controller.js';
// import { protect, authorize } from '../middlewares/auth.js';

// const router = Router();

// router.get('/', listCategories);
// router.get('/:id/subcategories', listSubcategories);
// router.post('/', protect, authorize('admin'), createCategory);
// router.patch('/:id', protect, authorize('admin'), updateCategory);
// router.delete('/:id', protect, authorize('admin'), deleteCategory);

// export default router;


import { Router } from 'express';
import { 
  listCategories, 
  getCategory,
  createCategory, 
  updateCategory, 
  deleteCategory, 
  listSubcategories,
  getCategoryTree,
  getCategoryProducts,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory
} from '../controllers/category.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

// Public routes
router.get('/', listCategories);
router.get('/tree', getCategoryTree);
router.get('/:id', getCategory);
router.get('/:id/subcategories', listSubcategories);
router.get('/:id/products', getCategoryProducts);

// Protected admin routes
router.post('/', protect, authorize('admin'), createCategory);
router.patch('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

// NEW: Subcategory routes
router.post('/:categoryId/subcategories', protect, authorize('admin'), addSubcategory);
router.patch('/:categoryId/subcategories/:subcategoryId', protect, authorize('admin'), updateSubcategory);
router.delete('/:categoryId/subcategories/:subcategoryId', protect, authorize('admin'), deleteSubcategory);

export default router;