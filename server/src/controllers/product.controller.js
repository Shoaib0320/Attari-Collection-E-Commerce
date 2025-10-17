// import Product from '../models/Product.js';
// import { uploadImage } from '../config/cloudinary.js';
// import fs from 'fs';

// export const listProducts = async (req, res) => {
// 	try {
// 		const {
// 			page = 1,
// 			limit = 12,
// 			q,
// 			category,
// 			subcategory,
// 			min,
// 			max,
// 			sort,
// 			featured,
// 			trending,
// 		} = req.query;

// 		const filter = {};

// 		if (q) filter.title = { $regex: q, $options: "i" };
// 		if (category) filter.category = category;
// 		if (subcategory) filter.subcategory = subcategory;
// 		if (featured) filter.featured = featured === "true";
// 		if (trending) filter.trending = trending === "true";

// 		if (min || max)
// 			filter.price = {
// 				...(min && { $gte: Number(min) }),
// 				...(max && { $lte: Number(max) }),
// 			};

// 		const sortMap = {
// 			price_asc: { price: 1 },
// 			price_desc: { price: -1 },
// 			newest: { createdAt: -1 },
// 			popular: { rating: -1 },
// 		};

// 		const sortOption = sortMap[sort] || { createdAt: -1 };
// 		const skip = (Number(page) - 1) * Number(limit);

// 		const [items, total] = await Promise.all([
// 			Product.find(filter)
// 				.sort(sortOption)
// 				.skip(skip)
// 				.limit(Number(limit))
// 				.populate("category", "name slug") // 👈 Category populate (only name + slug)
// 				.populate("subcategory", "name slug"), // 👈 Subcategory populate
// 			Product.countDocuments(filter),
// 		]);

// 		res.json({
// 			items,
// 			total,
// 			page: Number(page),
// 			pages: Math.ceil(total / Number(limit)),
// 		});
// 	} catch (error) {
// 		console.error("Error fetching products:", error);
// 		res.status(500).json({ message: "Server error", error: error.message });
// 	}
// };


// export const getProduct = async (req, res) => {
// 	try {
// 		const item = await Product.findOne({ _id: req.params.id })
// 			.populate("category"); // 👈 category ka data populate karega

// 		if (!item)
// 			return res.status(404).json({ message: "Product not found" });

// 		res.json({ item });
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: "Server error", error: error.message });
// 	}
// };


// export const createProduct = async (req, res) => {
// 	const product = await Product.create(req.body);
// 	res.status(201).json({ item: product });
// };

// export const updateProduct = async (req, res) => {
// 	const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
// 	res.json({ item: updated });
// };

// export const deleteProduct = async (req, res) => {
// 	await Product.findByIdAndDelete(req.params.id);
// 	res.json({ ok: true });
// };

// export const relatedProducts = async (req, res) => {
// 	const { id } = req.params;
// 	const base = await Product.findById(id);
// 	if (!base) return res.status(404).json({ message: 'Product not found' });
// 	const items = await Product.find({
// 		_id: { $ne: base._id },
// 		category: base.category,
// 	}).limit(8);
// 	res.json({ items });
// };

// export const uploadMedia = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
//     const result = await uploadImage(req.file.path);
//     // Cleanup temp file
//     try { fs.unlinkSync(req.file.path); } catch {}
//     return res.status(201).json({ url: result.secure_url, publicId: result.public_id });
//   } catch (err) {
//     return res.status(500).json({ message: 'Upload failed', error: String(err?.message || err) });
//     console.log('Upload Error', err);
    
//   }
// };

// export default { listProducts, getProduct, createProduct, updateProduct, deleteProduct, relatedProducts };


import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { uploadImage } from '../config/cloudinary.js';
import fs from 'fs';

export const listProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      q,
      category,
      brand,
      min,
      max,
      sort,
      featured,
      trending,
      newArrival,
      bestSeller,
      isOnSale,
      status = 'active',
      tags,
      hasVariants
    } = req.query;

    const filter = { status };

    // Search filter
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    // Category filter
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        const categoryDoc = await Category.findOne({ slug: category });
        if (categoryDoc) filter.category = categoryDoc._id;
      }
    }

    // Other filters
    if (brand) filter.brand = { $regex: brand, $options: "i" };
    if (featured) filter.featured = featured === "true";
    if (trending) filter.trending = trending === "true";
    if (newArrival) filter.newArrival = newArrival === "true";
    if (bestSeller) filter.bestSeller = bestSeller === "true";
    if (isOnSale) filter.isOnSale = isOnSale === "true";
    if (hasVariants) filter.hasVariants = hasVariants === "true";
    if (tags) filter.tags = { $in: tags.split(',') };

    // Price range filter
    if (min || max) {
      filter.price = {
        ...(min && { $gte: Number(min) }),
        ...(max && { $lte: Number(max) })
      };
    }

    // Sort options
    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      popular: { rating: -1, reviewCount: -1 },
      name_asc: { title: 1 },
      name_desc: { title: -1 },
      featured: { featured: -1, createdAt: -1 },
      bestselling: { soldCount: -1 }
    };

    const sortOption = sortMap[sort] || { createdAt: -1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .populate("category", "name slug image")
        .populate("relatedProducts", "title price images slug")
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      hasMore: skip + items.length < total
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const item = await Product.findOne({ 
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ],
      status: { $ne: 'archived' }
    })
    .populate("category", "name slug description")
    .populate("relatedProducts", "title price images slug rating ratingCount")
    .populate("bundleProducts.product", "title price images slug");

    if (!item) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Increment view count
    await item.incrementViewCount();

    res.json({ item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Backend - Product controller mein yeh add karein
export const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find({ status: 'active' })
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .lean();
      
      res.json({ products });
    } catch (error) {
      console.error("Error fetching all products:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };  

export const getProductBySlug = async (req, res) => {
  try {
    const item = await Product.findOne({ 
      slug: req.params.slug,
      status: 'active'
    })
    .populate("category", "name slug description")
    .populate("relatedProducts", "title price images slug rating ratingCount")
    .populate("bundleProducts.product", "title price images slug");

    if (!item) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Increment view count
    await item.incrementViewCount();

    res.json({ item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Handle variants
    if (productData.variants && productData.variants.length > 0) {
      productData.hasVariants = true;
    }

    // Handle images
    if (productData.images && productData.images.length > 0) {
      const primaryImage = productData.images.find(img => img.isPrimary);
      if (!primaryImage && productData.images.length > 0) {
        productData.images[0].isPrimary = true;
      }
      productData.thumbnail = productData.images.find(img => img.isPrimary)?.url || productData.images[0]?.url;
    }

    // Set createdBy
    productData.createdBy = req.user.id;

    const product = await Product.create(productData);
    
    // Populate the created product
    const populatedProduct = await Product.findById(product._id)
      .populate("category", "name slug")
      .populate("createdBy", "name email");

    res.status(201).json({ 
      message: "Product created successfully",
      item: populatedProduct 
    });
  } catch (error) {
    console.error("Error creating product:", error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `Product with this ${field} already exists` 
      });
    }
    
    res.status(500).json({ 
      message: "Error creating product", 
      error: error.message 
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updateData = req.body;
    
    // Handle variants
    if (updateData.variants && updateData.variants.length > 0) {
      updateData.hasVariants = true;
    } else {
      updateData.hasVariants = false;
    }

    // Handle images
    if (updateData.images && updateData.images.length > 0) {
      const primaryImage = updateData.images.find(img => img.isPrimary);
      if (!primaryImage && updateData.images.length > 0) {
        updateData.images[0].isPrimary = true;
      }
      updateData.thumbnail = updateData.images.find(img => img.isPrimary)?.url || updateData.images[0]?.url;
    }

    // Set updatedBy
    updateData.updatedBy = req.user.id;

    const updated = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { 
        new: true,
        runValidators: true 
      }
    )
    .populate("category", "name slug")
    .populate("updatedBy", "name email");

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ 
      message: "Product updated successfully",
      item: updated 
    });
  } catch (error) {
    console.error("Error updating product:", error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `Product with this ${field} already exists` 
      });
    }
    
    res.status(500).json({ 
      message: "Error updating product", 
      error: error.message 
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Soft delete by archiving
    product.status = 'archived';
    product.updatedBy = req.user.id;
    await product.save();

    res.json({ 
      message: "Product archived successfully",
      ok: true 
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ 
      message: "Error deleting product", 
      error: error.message 
    });
  }
};

export const hardDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ 
      message: "Product permanently deleted",
      ok: true 
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ 
      message: "Error deleting product", 
      error: error.message 
    });
  }
};

export const relatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const base = await Product.findById(id);
    
    if (!base) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const items = await Product.find({
      _id: { $ne: base._id },
      category: base.category,
      status: 'active'
    })
    .select('title price images slug rating ratingCount isOnSale discountPercent')
    .limit(8)
    .lean();

    res.json({ items });
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ 
      message: "Error fetching related products", 
      error: error.message 
    });
  }
};

export const featuredProducts = async (req, res) => {
  try {
    const items = await Product.find({
      featured: true,
      status: 'active'
    })
    .select('title price images slug rating ratingCount isOnSale discountPercent')
    .limit(12)
    .lean();

    res.json({ items });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ 
      message: "Error fetching featured products", 
      error: error.message 
    });
  }
};

export const newArrivals = async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    const date = new Date();
    date.setDate(date.getDate() - 30); // Last 30 days

    const items = await Product.find({
      status: 'active',
      createdAt: { $gte: date }
    })
    .select('title price images slug rating ratingCount isOnSale discountPercent')
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .lean();

    res.json({ items });
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({ 
      message: "Error fetching new arrivals", 
      error: error.message 
    });
  }
};

export const productsOnSale = async (req, res) => {
  try {
    const items = await Product.getProductsOnSale();

    res.json({ items });
  } catch (error) {
    console.error("Error fetching products on sale:", error);
    res.status(500).json({ 
      message: "Error fetching products on sale", 
      error: error.message 
    });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { stock, variantId } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (variantId) {
      // Update variant stock
      await product.updateVariantStock(variantId, stock);
    } else {
      // Update main product stock
      product.stock = stock;
      await product.save();
    }

    const updatedProduct = await Product.findById(req.params.id);
    
    res.json({ 
      message: "Stock updated successfully",
      item: updatedProduct 
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ 
      message: "Error updating stock", 
      error: error.message 
    });
  }
};

export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadImage(req.file.path);
    
    // Cleanup temp file
    try { 
      fs.unlinkSync(req.file.path); 
    } catch (cleanupError) {
      console.warn('Could not delete temp file:', cleanupError);
    }

    return res.status(201).json({ 
      url: result.secure_url, 
      publicId: result.public_id,
      message: "File uploaded successfully"
    });
  } catch (err) {
    console.error('Upload Error:', err);
    
    // Cleanup temp file on error
    try { 
      fs.unlinkSync(req.file.path); 
    } catch (cleanupError) {
      console.warn('Could not delete temp file:', cleanupError);
    }

    return res.status(500).json({ 
      message: 'Upload failed', 
      error: String(err?.message || err) 
    });
  }
};

export default { 
  listProducts, 
  getProduct, 
  getProductBySlug,
  createProduct, 
  updateProduct, 
  deleteProduct,
  hardDeleteProduct,
  relatedProducts,
  featuredProducts,
  newArrivals,
  productsOnSale,
  updateStock,
  uploadMedia 
};