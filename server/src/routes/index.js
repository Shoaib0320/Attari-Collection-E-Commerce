import { Router } from 'express';
import authRouter from './auth.routes.js';
import productRouter from './product.routes.js';
import categoryRouter from './category.routes.js';
import orderRouter from './order.routes.js';
import paymentRouter from './payment.routes.js';
import brandRoutes from './brand.routes.js';
import reviewRoutes from './review.routes.js';
import inventoryLogRoutes from './inventoryLog.routes.js';
import analyticsRouter from './reports.routes.js';

const router = Router();

router.get('/', (req, res) => res.json({ message: 'Attari API v1' }));

router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/categories', categoryRouter);
router.use('/orders', orderRouter);
router.use('/payment', paymentRouter);
router.use('/brands', brandRoutes);
router.use('/reviews', reviewRoutes);
router.use('/inventory-logs', inventoryLogRoutes);
router.use('/analytics', analyticsRouter);

export default router;
