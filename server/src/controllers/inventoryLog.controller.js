import InventoryLog from '../models/InventoryLog.js';
import Product from '../models/Product.js';

export const listInventoryLogs = async (req, res) => {
  try {
    const { 
      page = 1,
      limit = 50,
      product,
      type,
      startDate,
      endDate,
      sort = '-createdAt'
    } = req.query;

    const filter = {};

    // Product filter
    if (product) {
      filter.product = product;
    }

    // Type filter
    if (type) {
      filter.type = type;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      InventoryLog.find(filter)
        .populate('product', 'title sku images')
        .populate('createdBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      InventoryLog.countDocuments(filter),
    ]);

    res.json({
      logs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error("Error fetching inventory logs:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export const getInventoryLog = async (req, res) => {
  try {
    const log = await InventoryLog.findById(req.params.id)
      .populate('product', 'title sku images price')
      .populate('createdBy', 'name email');

    if (!log) {
      return res.status(404).json({ message: 'Inventory log not found' });
    }

    res.json({ log });
  } catch (error) {
    console.error("Error fetching inventory log:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export const createInventoryLog = async (req, res) => {
  try {
    const { 
      product, 
      variantId, 
      type, 
      quantity, 
      reason, 
      reference,
      cost 
    } = req.body;

    // Validate required fields
    if (!product || !type || !quantity || !reason) {
      return res.status(400).json({ 
        message: "Product, type, quantity, and reason are required" 
      });
    }

    // Get the product
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let previousStock, newStock, variantInfo = null;

    if (variantId) {
      // Handle variant stock update
      const variant = productDoc.variants.id(variantId);
      if (!variant) {
        return res.status(404).json({ message: 'Variant not found' });
      }

      previousStock = variant.stock;
      
      // Calculate new stock based on type
      if (type === 'in' || type === 'return') {
        newStock = previousStock + quantity;
      } else if (type === 'out' || type === 'damaged' || type === 'lost') {
        newStock = Math.max(0, previousStock - quantity);
      } else if (type === 'adjustment') {
        newStock = quantity;
      }

      // Update variant stock
      variant.stock = newStock;
      variantInfo = {
        variantId: variant._id,
        color: variant.color,
        size: variant.size,
        sku: variant.sku
      };
    } else {
      // Handle main product stock update
      previousStock = productDoc.stock;
      
      // Calculate new stock based on type
      if (type === 'in' || type === 'return') {
        newStock = previousStock + quantity;
      } else if (type === 'out' || type === 'damaged' || type === 'lost') {
        newStock = Math.max(0, previousStock - quantity);
      } else if (type === 'adjustment') {
        newStock = quantity;
      }

      // Update product stock
      productDoc.stock = newStock;
    }

    // Save the product with updated stock
    await productDoc.save();

    // Create inventory log
    const inventoryLog = await InventoryLog.create({
      product,
      variant: variantInfo,
      type,
      quantity,
      previousStock,
      newStock,
      reason,
      reference,
      cost,
      totalValue: cost ? cost * quantity : 0,
      createdBy: req.user.id
    });

    const populatedLog = await InventoryLog.findById(inventoryLog._id)
      .populate('product', 'title sku images')
      .populate('createdBy', 'name email');

    res.status(201).json({ 
      message: "Inventory log created successfully",
      log: populatedLog 
    });
  } catch (error) {
    console.error("Error creating inventory log:", error);
    res.status(500).json({ 
      message: "Error creating inventory log", 
      error: error.message 
    });
  }
};

export const getProductInventoryLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50,
      type,
      startDate,
      endDate 
    } = req.query;

    const filter = { product: req.params.id };

    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      InventoryLog.find(filter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      InventoryLog.countDocuments(filter),
    ]);

    // Get stock movement summary
    const stockMovement = await InventoryLog.aggregate([
      {
        $match: { product: new mongoose.Types.ObjectId(req.params.id) }
      },
      {
        $group: {
          _id: '$type',
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: '$totalValue' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      logs,
      stockMovement,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error("Error fetching product inventory logs:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export const getInventorySummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchStage = dateFilter.$gte || dateFilter.$lte ? { createdAt: dateFilter } : {};

    const summary = await InventoryLog.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: '$type',
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: '$totalValue' },
          transactionCount: { $sum: 1 },
          averageQuantity: { $avg: '$quantity' }
        }
      },
      {
        $project: {
          type: '$_id',
          totalQuantity: 1,
          totalValue: 1,
          transactionCount: 1,
          averageQuantity: { $round: ['$averageQuantity', 2] },
          _id: 0
        }
      }
    ]);

    // Get low stock products
    const lowStockProducts = await Product.find({
      $or: [
        { 
          hasVariants: false,
          stock: { $lte: '$lowStockAlert' },
          status: 'active'
        },
        { 
          hasVariants: true,
          'variants.stock': { $lte: '$lowStockAlert' },
          status: 'active'
        }
      ]
    })
    .select('title sku stock lowStockAlert hasVariants variants')
    .limit(20)
    .lean();

    res.json({
      summary,
      lowStockProducts,
      lowStockCount: lowStockProducts.length
    });
  } catch (error) {
    console.error("Error fetching inventory summary:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export const updateInventoryLog = async (req, res) => {
  try {
    const { reason, reference, cost } = req.body;

    const log = await InventoryLog.findByIdAndUpdate(
      req.params.id,
      { 
        reason,
        reference,
        cost,
        ...(cost && { totalValue: cost * log.quantity })
      },
      { new: true }
    )
    .populate('product', 'title sku images')
    .populate('createdBy', 'name email');

    if (!log) {
      return res.status(404).json({ message: 'Inventory log not found' });
    }

    res.json({ 
      message: "Inventory log updated successfully",
      log 
    });
  } catch (error) {
    console.error("Error updating inventory log:", error);
    res.status(500).json({ 
      message: "Error updating inventory log", 
      error: error.message 
    });
  }
};

export const deleteInventoryLog = async (req, res) => {
  try {
    const log = await InventoryLog.findById(req.params.id);
    
    if (!log) {
      return res.status(404).json({ message: 'Inventory log not found' });
    }

    // Note: Deleting inventory logs is generally not recommended as it affects audit trail
    // This should only be done for erroneous entries
    await InventoryLog.findByIdAndDelete(req.params.id);

    res.json({ 
      message: "Inventory log deleted successfully",
      ok: true 
    });
  } catch (error) {
    console.error("Error deleting inventory log:", error);
    res.status(500).json({ 
      message: "Error deleting inventory log", 
      error: error.message 
    });
  }
};

export const getStockAlerts = async (req, res) => {
  try {
    const lowStockProducts = await Product.getLowStockProducts();

    const criticalStockProducts = await Product.find({
      $or: [
        { 
          hasVariants: false,
          stock: { $lte: 2 },
          status: 'active'
        },
        { 
          hasVariants: true,
          'variants.stock': { $lte: 2 },
          status: 'active'
        }
      ]
    })
    .select('title sku stock lowStockAlert hasVariants variants images')
    .limit(50)
    .lean();

    res.json({
      lowStock: {
        products: lowStockProducts,
        count: lowStockProducts.length
      },
      criticalStock: {
        products: criticalStockProducts,
        count: criticalStockProducts.length
      },
      totalAlerts: lowStockProducts.length + criticalStockProducts.length
    });
  } catch (error) {
    console.error("Error fetching stock alerts:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export default { 
  listInventoryLogs, 
  getInventoryLog,
  createInventoryLog, 
  updateInventoryLog, 
  deleteInventoryLog, 
  getProductInventoryLogs,
  getInventorySummary,
  getStockAlerts
};