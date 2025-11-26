const mongoose = require('mongoose');

const customerOrderHistorySchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    ref: 'Customer'
  },
  orderId: {
    type: String,
    required: true,
    ref: 'OrderManagement'
  },
  orderDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Ready', 'In Delivery', 'Delivered', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid', 'refunded'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank_transfer', 'credit'],
    default: 'cash'
  },
  deliveryAddress: String,
  deliveryDate: Date,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

customerOrderHistorySchema.index({ customerId: 1, orderDate: -1 });

module.exports = mongoose.model('CustomerOrderHistory', customerOrderHistorySchema);
