import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, required: true },
		active: { type: Boolean, default: true },
	},
	{ _id: false }
);

const categorySchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		slug: { type: String, required: true, unique: true },
		image: { type: String },
		active: { type: Boolean, default: true },
		subcategories: [subcategorySchema],
	},
	{ timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
