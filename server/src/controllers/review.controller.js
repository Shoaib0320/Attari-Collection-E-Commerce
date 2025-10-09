// import Review from '../models/Review.js';

// export const listProductReviews = async (req, res) => {
// 	const reviews = await Review.find({ product: req.params.id }).populate('user', 'name');
// 	res.json({ reviews });
// };

// export const addReview = async (req, res) => {
// 	const { product, rating, comment } = req.body;
// 	const review = await Review.create({ product, user: req.user.id, rating, comment });
// 	res.status(201).json({ review });
// };

import Review from "../models/Review.js";
import Product from "../models/Product.js";

// ✅ Get reviews for a product
export const listProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.id })
    .populate("user", "name")
    .sort({ createdAt: -1 });
  res.json({ reviews });
};

// ✅ Add Review + Update Average Rating
export const addReview = async (req, res) => {
  const { product, rating, comment } = req.body;

  const review = await Review.create({
    product,
    user: req.user.id,
    rating,
    comment,
  });

  // Update product stats
  const reviews = await Review.find({ product });
  const avgRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(product, {
    rating: avgRating,
    numReviews: reviews.length,
  });

  res.status(201).json({ review });
};


export const moderateReview = async (req, res) => {
	const { id, approved } = req.body;
	const review = await Review.findByIdAndUpdate(id, { approved }, { new: true });
	res.json({ review });
};

export default { listProductReviews, addReview, moderateReview };
