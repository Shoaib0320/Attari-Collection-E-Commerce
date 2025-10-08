import { Router } from 'express';
import { createOrder, listUserOrders, listAllOrders, updateStatus, getInvoice } from '../controllers/order.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

router.post('/create', protect, createOrder);
router.get('/user/:id', protect, listUserOrders);
router.get('/admin', protect, authorize('admin'), listAllOrders);
router.patch('/:id/status', protect, authorize('admin'), updateStatus);
router.get('/:id/invoice', protect, getInvoice);

export default router;
