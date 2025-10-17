import Brand from '../models/Brand.js';
import Product from '../models/Product.js';

export const listBrands = async (req, res) => {
  try {
    const { 
      featured, 
      status = 'active',
      includeProductCount = false,
      sort = 'name',
      limit
    } = req.query;

    const filter = { status };

    if (featured) filter.featured = featured === "true";

    let brands;

    if (includeProductCount === 'true') {
      brands = await Brand.aggregate([
        {
          $match: filter
        },
        {
          $lookup: {
            from: 'products',
            localField: 'name',
            foreignField: 'brand',
            as: 'products'
          }
        },
        {
          $project: {
            name: 1,
            slug: 1,
            logo: 1,
            description: 1,
            website: 1,
            featured: 1,
            sortOrder: 1,
            productCount: { $size: '$products' },
            status: 1
          }
        },
        {
          $sort: { [sort]: 1 }
        },
        ...(limit ? [{ $limit: Number(limit) }] : [])
      ]);
    } else {
      brands = await Brand.find(filter)
        .sort({ [sort]: 1, name: 1 })
        .select('name slug logo description website featured sortOrder productCount')
        .limit(limit ? Number(limit) : 0)
        .lean();
    }

    res.json({ 
      brands,
      count: brands.length 
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export const getBrand = async (req, res) => {
  try {
    const brand = await Brand.findOne({
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ]
    });

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json({ brand });
  } catch (error) {
    console.error("Error fetching brand:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export const createBrand = async (req, res) => {
  try {
    const brandData = req.body;
    brandData.createdBy = req.user.id;

    const brand = await Brand.create(brandData);
    
    const populatedBrand = await Brand.findById(brand._id)
      .populate('createdBy', 'name email');

    res.status(201).json({ 
      message: "Brand created successfully",
      brand: populatedBrand 
    });
  } catch (error) {
    console.error("Error creating brand:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Brand with this name or slug already exists" 
      });
    }
    
    res.status(500).json({ 
      message: "Error creating brand", 
      error: error.message 
    });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const updateData = req.body;
    updateData.updatedBy = req.user.id;

    const brand = await Brand.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { 
        new: true,
        runValidators: true 
      }
    )
    .populate('updatedBy', 'name email');

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json({ 
      message: "Brand updated successfully",
      brand 
    });
  } catch (error) {
    console.error("Error updating brand:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Brand with this name or slug already exists" 
      });
    }
    
    res.status(500).json({ 
      message: "Error updating brand", 
      error: error.message 
    });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Check if brand has products
    const productCount = await Product.countDocuments({ 
      brand: brand.name,
      status: { $ne: 'archived' }
    });

    if (productCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete brand. It has ${productCount} associated products.` 
      });
    }

    await Brand.findByIdAndDelete(req.params.id);

    res.json({ 
      message: "Brand deleted successfully",
      ok: true 
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ 
      message: "Error deleting brand", 
      error: error.message 
    });
  }
};

export const getBrandProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      sort = 'newest',
      min,
      max 
    } = req.query;

    const brand = await Brand.findOne({
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ]
    });

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    const filter = { 
      brand: brand.name,
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
        .select('title price images slug rating ratingCount isOnSale discountPercent brand')
        .populate('category', 'name slug')
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      brand: {
        _id: brand._id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        description: brand.description
      },
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error("Error fetching brand products:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export const getFeaturedBrands = async (req, res) => {
  try {
    const brands = await Brand.getFeaturedBrands();

    res.json({ 
      brands,
      count: brands.length 
    });
  } catch (error) {
    console.error("Error fetching featured brands:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export const updateBrandLogo = async (req, res) => {
  try {
    const { logoUrl, publicId } = req.body;

    if (!logoUrl) {
      return res.status(400).json({ 
        message: "Logo URL is required" 
      });
    }

    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { 
        logo: { url: logoUrl, publicId },
        updatedBy: req.user.id
      },
      { new: true }
    );

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json({ 
      message: "Brand logo updated successfully",
      brand 
    });
  } catch (error) {
    console.error("Error updating brand logo:", error);
    res.status(500).json({ 
      message: "Error updating brand logo", 
      error: error.message 
    });
  }
};

export default { 
  listBrands, 
  getBrand,
  createBrand, 
  updateBrand, 
  deleteBrand, 
  getBrandProducts,
  getFeaturedBrands,
  updateBrandLogo
};