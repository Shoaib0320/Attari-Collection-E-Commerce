import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import sanitizeRequest from './middlewares/sanitize.js';
import createError from 'http-errors';

import connectDB from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';
import { stripeWebhookHandler } from './controllers/payment.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load env from server/.env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// Security & common middlewares (except JSON for webhook)
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Stripe webhook must read raw body BEFORE express.json
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

// JSON body parser for rest
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Security middlewares after JSON parsing
app.use(sanitizeRequest);

// Rate limiting on API
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
app.use('/api', limiter);

// Health check
app.get('/health', (_, res) => res.json({ ok: true }));

// Mount routes
app.use('/api', routes);

// 404 handler
app.use((req, res, next) => next(createError(404, 'Route not found')));

// Error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
	await connectDB();
	configureCloudinary();
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
};

start();
