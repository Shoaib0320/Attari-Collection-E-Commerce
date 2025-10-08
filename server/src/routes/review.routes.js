import { Router } from 'express';
import { listProductReviews, addReview, moderateReview } from '../controllers/review.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/product/:id', listProductReviews);
router.post('/add', protect, addReview);
router.post('/moderate', protect, authorize('admin'), moderateReview);

export default router;
