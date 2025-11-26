const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  phone: String,
  deliveryAddress: String,
  orderDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Ready', 'In Delivery', 'Delivered', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  lineItems: [{
    id: String,
    type: { type: String, enum: ['supplier', 'menu'] },
    itemId: String,
    itemName: String,
    quantity: Number,
    unit: String,
    sellPrice: Number,
    totalSellPrice: Number,
    supplierId: String,
    supplierPrice: Number,
    internalCost: {
      rawMaterials: [{ name: String, cost: Number }],
      utilities: Number,
      packaging: Number,
      labor: Number,
      unitCost: Number
    }
  }],
  totalSellPrice: { type: Number, required: true },
  totalInternalCost: { type: Number, default: 0 },
  totalSupplierCost: { type: Number, default: 0 },
  totalCost: { type: Number, required: true },
  profit: { type: Number, required: true },
  profitMargin: { type: Number, required: true },
  subOrders: {
    internal: [{
      lineItemId: String,
      itemName: String,
      quantity: Number,
      rawMaterials: [{ name: String, cost: Number }],
      utilities: Number,
      packaging: Number,
      labor: Number,
      unitCost: Number,
      totalCost: Number
    }],
    supplier: [{
      lineItemId: String,
      supplierId: String,
      itemName: String,
      quantity: Number,
      unitPrice: Number,
      totalCost: Number
    }]
  },
  placedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OrderManagement', OrderSchema);
