import { Router } from 'express';
import { createPaymentIntent } from '../controllers/payment.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post('/create-intent', protect, createPaymentIntent);

export default router;
