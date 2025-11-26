const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  menuId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  rawMaterials: [{
    name: String,
    cost: Number
  }],
  utilities: { type: Number, default: 0 },
  packaging: { type: Number, default: 0 },
  labor: { type: Number, default: 0 },
  otherCosts: { type: Number, default: 0 },
  standardQty: { type: Number, default: 1 },
  unitCost: { type: Number, required: true },
  suggestedPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
