const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  inventoryId: { type: String, required: true, unique: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true },
  purchasePrice: { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 0 },
  transactions: [{
    type: { type: String, enum: ['in', 'out'] },
    quantity: Number,
    reason: String,
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', InventorySchema);
