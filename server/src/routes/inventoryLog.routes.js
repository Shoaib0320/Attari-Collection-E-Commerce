import { Router } from 'express';
import { 
  listInventoryLogs, 
  getInventoryLog,
  createInventoryLog, 
  updateInventoryLog, 
  deleteInventoryLog, 
  getProductInventoryLogs,
  getInventorySummary,
  getStockAlerts
} from '../controllers/inventoryLog.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

// All routes are protected and require admin/inventory manager role
router.get('/', protect, authorize('admin', 'inventory_manager'), listInventoryLogs);
router.get('/summary', protect, authorize('admin', 'inventory_manager'), getInventorySummary);
router.get('/alerts', protect, authorize('admin', 'inventory_manager'), getStockAlerts);
router.get('/product/:id', protect, authorize('admin', 'inventory_manager'), getProductInventoryLogs);
router.get('/:id', protect, authorize('admin', 'inventory_manager'), getInventoryLog);
router.post('/', protect, authorize('admin', 'inventory_manager'), createInventoryLog);
router.patch('/:id', protect, authorize('admin', 'inventory_manager'), updateInventoryLog);
router.delete('/:id', protect, authorize('admin'), deleteInventoryLog);

export default router;