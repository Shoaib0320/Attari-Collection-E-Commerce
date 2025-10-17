import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Brand name is required'],
      trim: true,
      unique: true,
      maxlength: [100, 'Brand name cannot exceed 100 characters']
    },
    slug: { 
      type: String, 
      required: [true, 'Brand slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    logo: {
      url: String,
      publicId: String,
      alt: String
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+\..+/, 'Please enter a valid website URL']
    },
    featured: { 
      type: Boolean, 
      default: false 
    },
    sortOrder: { 
      type: Number, 
      default: 0 
    },
    
    // SEO
    seo: {
      title: String,
      keywords: [String],
      metaDescription: String
    },
    
    // Status
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'archived'],
      default: 'active'
    },
    
    // Analytics
    productCount: { 
      type: Number, 
      default: 0 
    },
    
    // Metadata
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    updatedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for products
brandSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'brand'
});

// Indexes
brandSchema.index({ slug: 1 });
brandSchema.index({ status: 1, featured: 1 });
brandSchema.index({ sortOrder: 1 });

// Pre-save middleware
brandSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

// Static methods
brandSchema.statics.getActiveBrands = function() {
  return this.find({ status: 'active' }).sort({ sortOrder: 1, name: 1 });
};

brandSchema.statics.getFeaturedBrands = function() {
  return this.find({ 
    status: 'active', 
    featured: true 
  }).sort({ sortOrder: 1, name: 1 });
};

const Brand = mongoose.models.Brand || mongoose.model('Brand', brandSchema);
export default Brand;