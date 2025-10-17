// import Review from "../models/Review.js";
// import Product from "../models/Product.js";

// // ✅ Get reviews for a product
// export const listProductReviews = async (req, res) => {
//   const reviews = await Review.find({ product: req.params.id })
//     .populate("user", "name")
//     .sort({ createdAt: -1 });
//   res.json({ reviews });
// };

// // ✅ Add Review + Update Average Rating
// export const addReview = async (req, res) => {
//   const { product, rating, comment } = req.body;

//   const review = await Review.create({
//     product,
//     user: req.user.id,
//     rating,
//     comment,
//   });

//   // Update product stats
//   const reviews = await Review.find({ product });
//   const avgRating =
//     reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
//   await Product.findByIdAndUpdate(product, {
//     rating: avgRating,
//     numReviews: reviews.length,
//   });

//   res.status(201).json({ review });
// };


// export const moderateReview = async (req, res) => {
// 	const { id, approved } = req.body;
// 	const review = await Review.findByIdAndUpdate(id, { approved }, { new: true });
// 	res.json({ review });
// };

// export default { listProductReviews, addReview, moderateReview };








import Review from "../models/Review.js";
import Product from "../models/Product.js";

// Get reviews for a product with pagination and filtering
export const listProductReviews = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt', 
      rating,
      helpful 
    } = req.query;

    const reviews = await Review.getProductReviews(req.params.id, {
      page: Number(page),
      limit: Number(limit),
      sort,
      rating: rating ? Number(rating) : null
    });

    const ratingSummary = await Review.getRatingSummary(req.params.id);

    res.json({ 
      reviews,
      ratingSummary: ratingSummary[0] || { total: 0, average: 0, ratings: [] },
      page: Number(page),
      pages: Math.ceil((ratingSummary[0]?.total || 0) / Number(limit))
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Add Review + Update Average Rating
export const addReview = async (req, res) => {
  try {
    const { product, rating, comment, title } = req.body;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product,
      user: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: "You have already reviewed this product" 
      });
    }

    const review = await Review.create({
      product,
      user: req.user.id,
      rating,
      comment,
      title,
      verifiedPurchase: true // You can implement purchase verification logic
    });

    // Update product rating stats
    await updateProductRating(product);

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name avatar");

    res.status(201).json({ 
      message: "Review added successfully",
      review: populatedReview 
    });
  } catch (error) {
    console.error("Error adding review:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "You have already reviewed this product" 
      });
    }
    
    res.status(500).json({ 
      message: "Error adding review", 
      error: error.message 
    });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { rating, comment, title } = req.body;

    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!review) {
      return res.status(404).json({ 
        message: "Review not found or you don't have permission to edit it" 
      });
    }

    review.rating = rating;
    review.comment = comment;
    review.title = title;
    await review.save();

    // Update product rating stats
    await updateProductRating(review.product);

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name avatar");

    res.json({ 
      message: "Review updated successfully",
      review: populatedReview 
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ 
      message: "Error updating review", 
      error: error.message 
    });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!review) {
      return res.status(404).json({ 
        message: "Review not found or you don't have permission to delete it" 
      });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Update product rating stats
    await updateProductRating(productId);

    res.json({ 
      message: "Review deleted successfully",
      ok: true 
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ 
      message: "Error deleting review", 
      error: error.message 
    });
  }
};

// Mark review as helpful
export const markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.markHelpful();
    
    res.json({ 
      message: "Review marked as helpful",
      helpful: review.helpful 
    });
  } catch (error) {
    console.error("Error marking review as helpful:", error);
    res.status(500).json({ 
      message: "Error marking review as helpful", 
      error: error.message 
    });
  }
};

// Mark review as not helpful
export const markNotHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.markNotHelpful();
    
    res.json({ 
      message: "Review marked as not helpful",
      notHelpful: review.notHelpful 
    });
  } catch (error) {
    console.error("Error marking review as not helpful:", error);
    res.status(500).json({ 
      message: "Error marking review as not helpful", 
      error: error.message 
    });
  }
};

// Moderate review (admin only)
export const moderateReview = async (req, res) => {
  try {
    const { approved, response } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      req.params.id, 
      { 
        approved,
        ...(response && {
          adminResponse: {
            comment: response,
            respondedBy: req.user.id,
            respondedAt: new Date()
          }
        })
      }, 
      { new: true }
    )
    .populate("user", "name avatar")
    .populate("adminResponse.respondedBy", "name");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update product rating stats if review approval status changed
    await updateProductRating(review.product);

    res.json({ 
      message: `Review ${approved ? 'approved' : 'rejected'}`,
      review 
    });
  } catch (error) {
    console.error("Error moderating review:", error);
    res.status(500).json({ 
      message: "Error moderating review", 
      error: error.message 
    });
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ user: req.user.id })
        .populate("product", "title images slug price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Review.countDocuments({ user: req.user.id })
    ]);

    res.json({
      reviews,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ 
      message: "Error fetching user reviews", 
      error: error.message 
    });
  }
};

// Helper function to update product rating
const updateProductRating = async (productId) => {
  try {
    const ratingSummary = await Review.getRatingSummary(productId);
    const summary = ratingSummary[0];

    if (summary) {
      await Product.findByIdAndUpdate(productId, {
        rating: summary.average,
        ratingCount: summary.total
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        ratingCount: 0
      });
    }
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
};

export default { 
  listProductReviews, 
  addReview, 
  updateReview,
  deleteReview,
  markHelpful,
  markNotHelpful,
  moderateReview,
  getUserReviews 
};