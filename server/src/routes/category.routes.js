import { Router } from 'express';
import { listCategories, createCategory, updateCategory, deleteCategory, listSubcategories } from '../controllers/category.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', listCategories);
router.get('/:id/subcategories', listSubcategories);
router.post('/', protect, authorize('admin'), createCategory);
router.patch('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;
