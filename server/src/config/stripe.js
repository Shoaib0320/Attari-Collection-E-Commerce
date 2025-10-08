import Stripe from 'stripe';

let stripeInstance = null;

export const getStripe = () => {
	if (stripeInstance) return stripeInstance;
	const key = process.env.STRIPE_SECRET_KEY;
	if (!key) {
		throw new Error('STRIPE_SECRET_KEY is not set');
	}
	stripeInstance = new Stripe(key, { apiVersion: '2024-06-20' });
	return stripeInstance;
};

export default getStripe;
