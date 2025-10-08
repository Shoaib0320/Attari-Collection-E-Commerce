import { Router } from 'express';
import { register, login, profile } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, profile);

export default router;
