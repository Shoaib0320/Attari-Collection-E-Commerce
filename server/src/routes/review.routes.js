// import { Router } from 'express';
// import { listProductReviews, addReview, moderateReview } from '../controllers/review.controller.js';
// import { protect, authorize } from '../middlewares/auth.js';

// const router = Router();

// router.get('/product/:id', listProductReviews);
// router.post('/add', protect, addReview);
// router.post('/moderate', protect, authorize('admin'), moderateReview);

// export default router;









import { Router } from 'express';
import { 
  listProductReviews, 
  addReview, 
  updateReview,
  deleteReview,
  markHelpful,
  markNotHelpful,
  moderateReview,
  getUserReviews 
} from '../controllers/review.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

// Public routes
router.get('/product/:id', listProductReviews);

// User routes (protected)
router.get('/my-reviews', protect, getUserReviews);
router.post('/', protect, addReview);
router.patch('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, markHelpful);
router.post('/:id/not-helpful', protect, markNotHelpful);

// Admin routes
router.patch('/:id/moderate', protect, authorize('admin'), moderateReview);

export default router;