// import mongoose from 'mongoose';

// const variantSchema = new mongoose.Schema(
// 	{
// 		color: String,
// 		size: String,
// 		stock: { type: Number, default: 0 },
// 	},
// 	{ _id: false }
// );

// const productSchema = new mongoose.Schema(
// 	{
// 		title: { type: String, required: true },
// 		slug: { type: String, required: true, unique: true },
// 		description: { type: String },
// 		price: { type: Number, required: true },
// 		discountPercent: { type: Number, default: 0 },
// 		category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
// 		subcategory: { type: String },
// 		images: [{ url: String, publicId: String }],
// 		video: { url: String, publicId: String },
// 		variants: [variantSchema],
// 		featured: { type: Boolean, default: false },
// 		trending: { type: Boolean, default: false },
// 		hidden: { type: Boolean, default: false },
// 		seo: {
// 			title: String,
// 			keywords: [String],
// 			metaDescription: String,
// 		},
// 		rating: { type: Number, default: 0 },
// 		ratingCount: { type: Number, default: 0 },
// 	},
// 	{ timestamps: true }
// );

// const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
// export default Product;

import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      trim: true
    },
    size: {
      type: String,
      trim: true
    },
    stock: { 
      type: Number, 
      default: 0,
      min: [0, 'Stock cannot be negative']
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true
    },
    price: { 
      type: Number,
      min: [0, 'Price cannot be negative']
    },
    image: { 
      url: String, 
      publicId: String,
      alt: String
    },
    barcode: String,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },
  { _id: true } // Give each variant an _id
);

const productSchema = new mongoose.Schema(
  {
    // Basic Information
    title: { 
      type: String, 
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [200, 'Product title cannot exceed 200 characters']
    },
    slug: { 
      type: String, 
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    shortDescription: {
      type: String,
      maxlength: [300, 'Short description cannot exceed 300 characters']
    },
    longDescription: {
      type: String,
      maxlength: [5000, 'Long description cannot exceed 5000 characters']
    },
    
    // Pricing
    price: { 
      type: Number, 
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    originalPrice: { 
      type: Number,
      min: [0, 'Original price cannot be negative']
    },
    discountPercent: { 
      type: Number, 
      default: 0,
      min: [0, 'Discount percent cannot be negative'],
      max: [100, 'Discount percent cannot exceed 100']
    },
    discountAmount: { 
      type: Number,
      min: [0, 'Discount amount cannot be negative']
    },
    isOnSale: { 
      type: Boolean, 
      default: false 
    },
    saleStartDate: Date,
    saleEndDate: Date,
    costPrice: { 
      type: Number,
      min: [0, 'Cost price cannot be negative']
    },
    profitMargin: { 
      type: Number,
      min: [0, 'Profit margin cannot be negative'],
      max: [100, 'Profit margin cannot exceed 100']
    },
    
    // Inventory Management
    sku: { 
      type: String, 
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true
    },
    barcode: String,
    stock: { 
      type: Number, 
      default: 0,
      min: [0, 'Stock cannot be negative']
    },
    lowStockAlert: { 
      type: Number, 
      default: 5,
      min: [0, 'Low stock alert cannot be negative']
    },
    trackQuantity: { 
      type: Boolean, 
      default: true 
    },
    allowBackorder: { 
      type: Boolean, 
      default: false 
    },
    soldCount: { 
      type: Number, 
      default: 0,
      min: [0, 'Sold count cannot be negative']
    },
    
    // Categories & Organization
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category',
      required: [true, 'Product category is required']
    },
    subcategory: {
      type: String,
      trim: true
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    brand: {
      type: String,
      trim: true
    },
    
    // Media
    images: [{ 
      url: { type: String, required: true },
      publicId: String,
      alt: String,
      isPrimary: { type: Boolean, default: false },
      sortOrder: { type: Number, default: 0 }
    }],
    video: { 
      url: String, 
      publicId: String,
      thumbnail: String
    },
    thumbnail: String,
    
    // Variants
    variants: [variantSchema],
    hasVariants: { 
      type: Boolean, 
      default: false 
    },
    
    // Shipping Information
    weight: { 
      type: Number,
      min: [0, 'Weight cannot be negative']
    },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 }
    },
    shippingClass: String,
    freeShipping: { 
      type: Boolean, 
      default: false 
    },
    
    // Product Status & Visibility
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'draft', 'archived'],
      default: 'active'
    },
    featured: { 
      type: Boolean, 
      default: false 
    },
    trending: { 
      type: Boolean, 
      default: false 
    },
    newArrival: { 
      type: Boolean, 
      default: false 
    },
    bestSeller: { 
      type: Boolean, 
      default: false 
    },
    hidden: { 
      type: Boolean, 
      default: false 
    },
    
    // SEO
    seo: {
      title: {
        type: String,
        maxlength: [60, 'SEO title cannot exceed 60 characters']
      },
      keywords: [{
        type: String,
        trim: true
      }],
      metaDescription: {
        type: String,
        maxlength: [160, 'Meta description cannot exceed 160 characters']
      },
      canonicalUrl: String,
      ogImage: String
    },
    
    // Additional Product Information
    manufacturer: String,
    model: String,
    warranty: String,
    returnPolicy: String,
    
    // Digital Product
    isDigital: { 
      type: Boolean, 
      default: false 
    },
    downloadLink: String,
    fileSize: String,
    
    // Bundle Product
    isBundle: { 
      type: Boolean, 
      default: false 
    },
    bundleProducts: [{
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true
      },
      quantity: { 
        type: Number, 
        default: 1,
        min: [1, 'Bundle quantity must be at least 1']
      }
    }],
    
    // Related Products
    relatedProducts: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    }],
    
    // Analytics
    viewCount: { 
      type: Number, 
      default: 0 
    },
    wishlistCount: { 
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

// Virtual Fields
productSchema.virtual('salePrice').get(function() {
  if (this.isOnSale && this.discountPercent > 0) {
    return Math.round(this.price - (this.price * this.discountPercent / 100));
  }
  return this.price;
});

productSchema.virtual('inStock').get(function() {
  if (this.hasVariants) {
    return this.variants.some(variant => variant.stock > 0);
  }
  return this.stock > 0;
});

productSchema.virtual('totalStock').get(function() {
  if (this.hasVariants) {
    return this.variants.reduce((total, variant) => total + variant.stock, 0);
  }
  return this.stock;
});

productSchema.virtual('isLowStock').get(function() {
  if (this.hasVariants) {
    return this.variants.every(variant => variant.stock <= this.lowStockAlert);
  }
  return this.stock <= this.lowStockAlert;
});

productSchema.virtual('saleEndsIn').get(function() {
  if (this.saleEndDate && this.isOnSale) {
    const now = new Date();
    const end = new Date(this.saleEndDate);
    return Math.max(0, end - now);
  }
  return null;
});

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isOnSale: 1 });
productSchema.index({ featured: 1, trending: 1 });
productSchema.index({ 'seo.keywords': 1 });
productSchema.index({ tags: 1 });
productSchema.index({ brand: 1 });

// Pre-save Middleware
productSchema.pre('save', function(next) {
  // Calculate discount fields
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discountAmount = this.originalPrice - this.price;
    this.discountPercent = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    this.isOnSale = true;
  }
  
  // Calculate profit margin
  if (this.costPrice && this.price > 0) {
    this.profitMargin = Math.round(((this.price - this.costPrice) / this.price) * 100);
  }
  
  // Set hasVariants
  this.hasVariants = this.variants && this.variants.length > 0;
  
  // Auto-generate slug if not provided
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  
  next();
});

// Static Methods
productSchema.statics.getProductsOnSale = function() {
  return this.find({ 
    isOnSale: true,
    status: 'active',
    $or: [
      { saleEndDate: { $gte: new Date() } },
      { saleEndDate: { $exists: false } }
    ]
  });
};

productSchema.statics.getFeaturedProducts = function() {
  return this.find({ 
    featured: true, 
    status: 'active' 
  }).limit(20);
};

productSchema.statics.getNewArrivals = function(days = 30) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  
  return this.find({
    status: 'active',
    createdAt: { $gte: date }
  }).sort({ createdAt: -1 }).limit(20);
};

productSchema.statics.getLowStockProducts = function() {
  return this.find({
    status: 'active',
    $or: [
      { 
        hasVariants: false,
        stock: { $lte: '$lowStockAlert' }
      },
      { 
        hasVariants: true,
        'variants.stock': { $lte: '$lowStockAlert' }
      }
    ]
  });
};

// Instance Methods
productSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

productSchema.methods.incrementWishlistCount = function() {
  this.wishlistCount += 1;
  return this.save();
};

productSchema.methods.decrementWishlistCount = function() {
  this.wishlistCount = Math.max(0, this.wishlistCount - 1);
  return this.save();
};

productSchema.methods.isVariantAvailable = function(color, size) {
  const variant = this.variants.find(v => 
    v.color === color && v.size === size
  );
  return variant && variant.stock > 0;
};

productSchema.methods.getVariantStock = function(color, size) {
  const variant = this.variants.find(v => 
    v.color === color && v.size === size
  );
  return variant ? variant.stock : 0;
};

productSchema.methods.updateVariantStock = function(variantId, newStock) {
  const variant = this.variants.id(variantId);
  if (variant) {
    variant.stock = newStock;
    return this.save();
  }
  throw new Error('Variant not found');
};

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;