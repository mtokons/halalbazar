const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  numberOfBiryani: {
    type: Number,
    required: true
  },
  ingredientCost: {
    type: Number,
    required: true
  },
  electricityBill: {
    type: Number,
    required: true
  },
  labourCost: {
    type: Number,
    required: true
  },
  profitMargin: {
    type: Number,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  costPerBiryani: {
    type: Number,
    required: true
  },
  sellingPricePerBiryani: {
    type: Number,
    required: true
  },
  totalSellingPrice: {
    type: Number,
    required: true
  },
  profitPerOrder: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
