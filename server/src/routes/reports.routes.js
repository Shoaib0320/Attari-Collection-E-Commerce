import { Router } from 'express';

const router = Router();

router.get('/revenue', (req, res) => res.json({ revenue: [] }));
router.get('/top-products', (req, res) => res.json({ items: [] }));
router.get('/sales-report', (req, res) => res.json({ report: [] }));

export default router;
