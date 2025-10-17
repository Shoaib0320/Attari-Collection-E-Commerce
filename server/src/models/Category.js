// import mongoose from 'mongoose';

// const subcategorySchema = new mongoose.Schema(
// 	{
// 		name: { type: String, required: true },
// 		slug: { type: String, required: true },
// 		active: { type: Boolean, default: true },
// 	},
// 	{ _id: false }
// );

// const categorySchema = new mongoose.Schema(
// 	{
// 		name: { type: String, required: true, unique: true },
// 		slug: { type: String, required: true, unique: true },
// 		image: { type: String },
// 		active: { type: Boolean, default: true },
// 		subcategories: [subcategorySchema],
// 	},
// 	{ timestamps: true }
// );

// const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
// export default Category;

import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Subcategory name is required'],
    trim: true,
    maxlength: [100, 'Subcategory name cannot exceed 100 characters']
  },
  slug: { 
    type: String, 
    required: [true, 'Subcategory slug is required'],
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    url: String,
    publicId: String,
    alt: String
  },
  icon: String,
  featured: { 
    type: Boolean, 
    default: false 
  },
  sortOrder: { 
    type: Number, 
    default: 0 
  },
  
  // SEO Fields
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
    }
  },
  
  // Status & Visibility
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  showInMenu: { 
    type: Boolean, 
    default: true 
  },
  showInFooter: { 
    type: Boolean, 
    default: false 
  },
  
  // Analytics
  productCount: { 
    type: Number, 
    default: 0 
  },
  viewCount: { 
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
}, { 
  timestamps: true 
});

const categorySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters']
    },
    slug: { 
      type: String, 
      required: [true, 'Category slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    image: {
      url: String,
      publicId: String,
      alt: String
    },
    icon: String,
    parent: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category',
      default: null
    },
    featured: { 
      type: Boolean, 
      default: false 
    },
    sortOrder: { 
      type: Number, 
      default: 0 
    },
    
    // Subcategories array
    subcategories: [subcategorySchema],
    
    // SEO Fields
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
      }
    },
    
    // Status & Visibility
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'archived'],
      default: 'active'
    },
    showInMenu: { 
      type: Boolean, 
      default: true 
    },
    showInFooter: { 
      type: Boolean, 
      default: false 
    },
    
    // Analytics
    productCount: { 
      type: Number, 
      default: 0 
    },
    viewCount: { 
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

// Virtual for nested subcategories
categorySchema.virtual('nestedSubcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for products in this category
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category'
});

// Index for better performance
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ status: 1, featured: 1 });
categorySchema.index({ sortOrder: 1 });
categorySchema.index({ 'seo.keywords': 1 });

// Pre-save middleware to update slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  
  // Auto-generate slugs for subcategories
  if (this.isModified('subcategories')) {
    this.subcategories.forEach(subcat => {
      if (!subcat.slug && subcat.name) {
        subcat.slug = subcat.name
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      }
    });
  }
  
  next();
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;