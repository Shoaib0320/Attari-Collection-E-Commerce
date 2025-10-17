// import Category from '../models/Category.js';

// export const listCategories = async (req, res) => {
// 	const categories = await Category.find({});
// 	res.json({ categories });
// };

// export const createCategory = async (req, res) => {
// 	const cat = await Category.create(req.body);
// 	res.status(201).json({ category: cat });
// };

// export const updateCategory = async (req, res) => {
// 	const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
// 	res.json({ category: cat });
// };

// export const deleteCategory = async (req, res) => {
// 	await Category.findByIdAndDelete(req.params.id);
// 	res.json({ ok: true });
// };

// export const listSubcategories = async (req, res) => {
// 	const cat = await Category.findById(req.params.id);
// 	if (!cat) return res.status(404).json({ message: 'Category not found' });
// 	res.json({ subcategories: cat.subcategories || [] });
// };

// export default { listCategories, createCategory, updateCategory, deleteCategory, listSubcategories };

import Category from '../models/Category.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

export const listCategories = async (req, res) => {
  try {
    const { 
      featured, 
      status = 'active',
      includeSubcategories = false,
      includeProductCount = false 
    } = req.query;

    let categories;

    if (includeProductCount === 'true') {
      categories = await Category.getCategoriesWithCount();
    } else {
      const filter = { status };
      if (featured) filter.featured = featured === "true";

      let query = Category.find(filter)
        .sort({ sortOrder: 1, name: 1 })
        .select('name slug description image featured productCount sortOrder status showInMenu showInFooter parent subcategories');

      if (includeSubcategories === 'true') {
        query = query.populate('subcategories');
      }

      categories = await query.lean();
    }

    res.json({ 
      categories,
      count: categories.length 
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ]
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Increment view count
    category.viewCount += 1;
    await category.save();

    res.json({ category });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    categoryData.createdBy = req.user.id;

    // Auto-generate slugs for subcategories if not provided
    if (categoryData.subcategories && Array.isArray(categoryData.subcategories)) {
      categoryData.subcategories = categoryData.subcategories.map(subcat => ({
        ...subcat,
        slug: subcat.slug || subcat.name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
      }));
    }

    const category = await Category.create(categoryData);
    
    const populatedCategory = await Category.findById(category._id)
      .populate('createdBy', 'name email');

    res.status(201).json({ 
      message: "Category created successfully",
      category: populatedCategory 
    });
  } catch (error) {
    console.error("Error creating category:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Category with this name or slug already exists" 
      });
    }
    
    res.status(500).json({ 
      message: "Error creating category", 
      error: error.message 
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updateData = req.body;
    updateData.updatedBy = req.user.id;

    // Auto-generate slugs for subcategories if not provided
    if (updateData.subcategories && Array.isArray(updateData.subcategories)) {
      updateData.subcategories = updateData.subcategories.map(subcat => ({
        ...subcat,
        slug: subcat.slug || subcat.name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
      }));
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { 
        new: true,
        runValidators: true 
      }
    )
    .populate('updatedBy', 'name email');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ 
      message: "Category updated successfully",
      category 
    });
  } catch (error) {
    console.error("Error updating category:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Category with this name or slug already exists" 
      });
    }
    
    res.status(500).json({ 
      message: "Error updating category", 
      error: error.message 
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ 
      category: category._id,
      status: { $ne: 'archived' }
    });

    if (productCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category. It has ${productCount} associated products.` 
      });
    }

    // Check if category has subcategories
    if (category.subcategories && category.subcategories.length > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category. It has ${category.subcategories.length} subcategories.` 
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ 
      message: "Category deleted successfully",
      ok: true 
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ 
      message: "Error deleting category", 
      error: error.message 
    });
  }
};

// NEW: Add subcategory to a category
export const addSubcategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategoryData = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Auto-generate slug if not provided
    if (!subcategoryData.slug && subcategoryData.name) {
      subcategoryData.slug = subcategoryData.name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    // Add subcategory to the array
    category.subcategories.push(subcategoryData);
    await category.save();

    const updatedCategory = await Category.findById(categoryId);
    
    res.status(201).json({ 
      message: "Subcategory added successfully",
      category: updatedCategory 
    });
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({ 
      message: "Error adding subcategory", 
      error: error.message 
    });
  }
};

// NEW: Update subcategory
export const updateSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;
    const updateData = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find the subcategory index
    const subcategoryIndex = category.subcategories.findIndex(
      sub => sub._id.toString() === subcategoryId
    );

    if (subcategoryIndex === -1) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    // Update subcategory
    category.subcategories[subcategoryIndex] = {
      ...category.subcategories[subcategoryIndex].toObject(),
      ...updateData
    };

    await category.save();

    const updatedCategory = await Category.findById(categoryId);
    
    res.json({ 
      message: "Subcategory updated successfully",
      category: updatedCategory 
    });
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({ 
      message: "Error updating subcategory", 
      error: error.message 
    });
  }
};

// NEW: Delete subcategory
export const deleteSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Remove subcategory from array
    category.subcategories = category.subcategories.filter(
      sub => sub._id.toString() !== subcategoryId
    );

    await category.save();

    res.json({ 
      message: "Subcategory deleted successfully",
      ok: true 
    });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ 
      message: "Error deleting subcategory", 
      error: error.message 
    });
  }
};

export const listSubcategories = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ 
      subcategories: category.subcategories || [],
      count: category.subcategories ? category.subcategories.length : 0 
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export const getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find({ status: 'active' })
      .sort({ sortOrder: 1, name: 1 })
      .select('name slug parent sortOrder subcategories')
      .lean();

    // Build tree structure
    const buildTree = (parentId = null) => {
      return categories
        .filter(cat => {
          if (parentId === null) return !cat.parent;
          return cat.parent && cat.parent.toString() === parentId.toString();
        })
        .map(cat => ({
          ...cat,
          children: buildTree(cat._id)
        }));
    };

    const categoryTree = buildTree();

    res.json({ categories: categoryTree });
  } catch (error) {
    console.error("Error fetching category tree:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export const getCategoryProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      sort = 'newest',
      min,
      max 
    } = req.query;

    const category = await Category.findOne({
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ]
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Get all subcategories including the main category
    const subcategories = await Category.find({ 
      $or: [
        { _id: category._id },
        { parent: category._id }
      ],
      status: 'active'
    }).select('_id');

    const categoryIds = subcategories.map(cat => cat._id);

    const filter = { 
      category: { $in: categoryIds },
      status: 'active'
    };

    // Price filter
    if (min || max) {
      filter.price = {
        ...(min && { $gte: Number(min) }),
        ...(max && { $lte: Number(max) })
      };
    }

    // Sort options
    const sortMap = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      popular: { rating: -1 },
      name_asc: { title: 1 },
      name_desc: { title: -1 }
    };

    const sortOption = sortMap[sort] || { createdAt: -1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .select('title price images slug rating ratingCount isOnSale discountPercent')
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description
      },
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error("Error fetching category products:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};