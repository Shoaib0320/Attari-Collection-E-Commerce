import { getStripe } from '../config/stripe.js';

export const createPaymentIntent = async (req, res) => {
	const stripe = getStripe();
	const { amount, currency = 'usd' } = req.body;
	const paymentIntent = await stripe.paymentIntents.create({ amount, currency, automatic_payment_methods: { enabled: true } });
	res.json({ clientSecret: paymentIntent.client_secret });
};

export const stripeWebhookHandler = async (req, res) => {
	try {
		const stripe = getStripe();
		const sig = req.headers['stripe-signature'];
		const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
		let event;
		if (endpointSecret) {
			event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
		} else {
			event = JSON.parse(req.body);
		}
		// Handle events as needed
		switch (event.type) {
			case 'payment_intent.succeeded':
				break;
			default:
				break;
		}
		res.json({ received: true });
	} catch (err) {
		console.error('Stripe webhook error', err.message);
		res.status(400).send(`Webhook Error: ${err.message}`);
	}
};

export default { createPaymentIntent, stripeWebhookHandler };
