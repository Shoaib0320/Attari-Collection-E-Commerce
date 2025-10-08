import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema(
	{
		color: String,
		size: String,
		stock: { type: Number, default: 0 },
	},
	{ _id: false }
);

const productSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		description: { type: String },
		price: { type: Number, required: true },
		discountPercent: { type: Number, default: 0 },
		category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
		subcategory: { type: String },
		images: [{ url: String, publicId: String }],
		video: { url: String, publicId: String },
		variants: [variantSchema],
		featured: { type: Boolean, default: false },
		trending: { type: Boolean, default: false },
		hidden: { type: Boolean, default: false },
		seo: {
			title: String,
			keywords: [String],
			metaDescription: String,
		},
		rating: { type: Number, default: 0 },
		ratingCount: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
