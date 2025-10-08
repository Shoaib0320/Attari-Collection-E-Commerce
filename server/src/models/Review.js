import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
	{
		product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		rating: { type: Number, min: 1, max: 5, required: true },
		comment: { type: String },
		approved: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
