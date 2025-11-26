const mongoose = require('mongoose');

const supplierHistorySchema = new mongoose.Schema({
  historyId: {
    type: String,
    required: true,
    unique: true
  },
  supplierId: {
    type: String,
    required: true,
    ref: 'Supplier'
  },
  transactionType: {
    type: String,
    enum: ['purchase', 'payment', 'return', 'adjustment'],
    required: true
  },
  orderId: String,
  productName: String,
  quantity: Number,
  unitPrice: Number,
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partial', 'overdue'],
    default: 'pending'
  },
  paymentMethod: String,
  notes: String,
  transactionDate: {
    type: Date,
    default: Date.now
  },
  createdBy: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SupplierHistory', supplierHistorySchema);
