import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
	{
		product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
		qty: { type: Number, required: true },
		price: { type: Number, required: true },
		variant: { color: String, size: String },
	},
	{ _id: false }
);

const addressSchema = new mongoose.Schema(
	{
		fullName: String,
		phone: String,
		addressLine1: String,
		addressLine2: String,
		city: String,
		state: String,
		postalCode: String,
		country: String,
	},
	{ _id: false }
);

const orderSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		items: [orderItemSchema],
		shippingAddress: addressSchema,
		status: {
			type: String,
			enum: ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunded'],
			default: 'Placed',
		},
		payment: {
			method: { type: String, enum: ['stripe'], default: 'stripe' },
			stripePaymentIntentId: String,
			paid: { type: Boolean, default: false },
			refunded: { type: Boolean, default: false },
		},
		amounts: {
			subtotal: Number,
			shipping: Number,
			tax: Number,
			discount: Number,
			total: Number,
		},
	},
	{ timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
