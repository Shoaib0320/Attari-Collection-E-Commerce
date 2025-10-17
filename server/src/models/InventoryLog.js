import mongoose from 'mongoose';

const inventoryLogSchema = new mongoose.Schema(
  {
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    variant: {
      variantId: mongoose.Schema.Types.ObjectId,
      color: String,
      size: String,
      sku: String
    },
    type: { 
      type: String, 
      enum: ['in', 'out', 'adjustment', 'return', 'damaged', 'lost'],
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    previousStock: { 
      type: Number, 
      required: true 
    },
    newStock: { 
      type: Number, 
      required: true 
    },
    reason: {
      type: String,
      required: true,
      maxlength: [500, 'Reason cannot exceed 500 characters']
    },
    reference: {
      type: String,
      trim: true
    },
    cost: {
      type: Number,
      min: [0, 'Cost cannot be negative']
    },
    totalValue: {
      type: Number,
      min: [0, 'Total value cannot be negative']
    },
    
    // Metadata
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    notes: String
  },
  { 
    timestamps: true 
  }
);

// Indexes
inventoryLogSchema.index({ product: 1, createdAt: -1 });
inventoryLogSchema.index({ type: 1 });
inventoryLogSchema.index({ reference: 1 });
inventoryLogSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate total value
inventoryLogSchema.pre('save', function(next) {
  if (this.cost && this.quantity) {
    this.totalValue = this.cost * this.quantity;
  }
  next();
});

// Static methods
inventoryLogSchema.statics.getProductLogs = function(productId, limit = 50) {
  return this.find({ product: productId })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit);
};

inventoryLogSchema.statics.getStockMovement = function(productId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        createdAt: { $gte: startDate, $lte: endDate }
      }
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
};

const InventoryLog = mongoose.models.InventoryLog || mongoose.model('InventoryLog', inventoryLogSchema);
export default InventoryLog;