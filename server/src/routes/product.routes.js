// import { Router } from 'express';
// import { listProducts, getProduct, createProduct, updateProduct, deleteProduct, relatedProducts, uploadMedia } from '../controllers/product.controller.js';
// import { protect, authorize } from '../middlewares/auth.js';
// import multer from 'multer';
// const upload = multer({ dest: 'uploads/' });

// const router = Router();

// router.get('/', listProducts);
// router.get('/:id', getProduct);
// router.get('/:id/related', relatedProducts);
// router.post('/create', protect, authorize('admin'), createProduct);
// router.patch('/:id', protect, authorize('admin'), updateProduct);
// router.delete('/:id', protect, authorize('admin'), deleteProduct);
// router.post('/upload', protect, authorize('admin'), upload.single('file'), uploadMedia);

// export default router;



import { Router } from 'express';
import { 
  listProducts, 
  getProduct, 
  getProductBySlug,
  createProduct, 
  updateProduct, 
  deleteProduct,
  hardDeleteProduct,
  relatedProducts,
  featuredProducts,
  newArrivals,
  productsOnSale,
  updateStock,
  uploadMedia, 
  getAllProducts
} from '../controllers/product.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import multer from 'multer';

const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const router = Router();

// Public routes
router.get('/', listProducts);
router.get('/all', getAllProducts);
router.get('/featured', featuredProducts);
router.get('/new-arrivals', newArrivals);
router.get('/sale', productsOnSale);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);
router.get('/:id/related', relatedProducts);

// Protected admin routes
router.post('/upload', protect, authorize('admin'), upload.single('file'), uploadMedia);
router.post('/', protect, authorize('admin'), createProduct);
router.patch('/:id', protect, authorize('admin'), updateProduct);
router.patch('/:id/stock', protect, authorize('admin'), updateStock);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.delete('/:id/permanent', protect, authorize('admin'), hardDeleteProduct);

export default router;