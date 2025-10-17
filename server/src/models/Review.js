// import mongoose from 'mongoose';

// const reviewSchema = new mongoose.Schema(
// 	{
// 		product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
// 		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// 		rating: { type: Number, min: 1, max: 5, required: true },
// 		comment: { type: String },
// 		approved: { type: Boolean, default: true },
// 	},
// 	{ timestamps: true }
// );

// reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
// export default Review;



import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    rating: { 
      type: Number, 
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Review title cannot exceed 100 characters']
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Review comment cannot exceed 1000 characters']
    },
    approved: { 
      type: Boolean, 
      default: true 
    },
    helpful: { 
      type: Number, 
      default: 0 
    },
    notHelpful: { 
      type: Number, 
      default: 0 
    },
    
    // Review verification
    verifiedPurchase: { 
      type: Boolean, 
      default: false 
    },
    
    // Admin response
    adminResponse: {
      comment: String,
      respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      respondedAt: Date
    }
  },
  { 
    timestamps: true 
  }
);

// Compound unique index - one review per product per user
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Indexes for better performance
reviewSchema.index({ product: 1, rating: 1 });
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ approved: 1 });
reviewSchema.index({ rating: 1 });

// Static methods
reviewSchema.statics.getProductReviews = function(productId, options = {}) {
  const { page = 1, limit = 10, sort = '-createdAt', rating } = options;
  const skip = (page - 1) * limit;
  
  const query = { 
    product: productId, 
    approved: true 
  };
  
  if (rating) {
    query.rating = rating;
  }
  
  return this.find(query)
    .populate('user', 'name avatar')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

reviewSchema.statics.getRatingSummary = function(productId) {
  return this.aggregate([
    {
      $match: { 
        product: new mongoose.Types.ObjectId(productId),
        approved: true 
      }
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$count' },
        average: { $avg: '$rating' },
        ratings: { $push: { rating: '$_id', count: '$count' } }
      }
    },
    {
      $project: {
        _id: 0,
        total: 1,
        average: { $round: ['$average', 1] },
        ratings: 1
      }
    }
  ]);
};

// Instance methods
reviewSchema.methods.markHelpful = function() {
  this.helpful += 1;
  return this.save();
};

reviewSchema.methods.markNotHelpful = function() {
  this.notHelpful += 1;
  return this.save();
};

reviewSchema.methods.addAdminResponse = function(comment, adminId) {
  this.adminResponse = {
    comment,
    respondedBy: adminId,
    respondedAt: new Date()
  };
  return this.save();
};

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;