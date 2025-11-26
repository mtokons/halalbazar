const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  supplierId: { type: String, required: true, unique: true },
  supplierName: { type: String, required: true },
  contactPerson: String,
  email: String,
  phone: { type: String, required: true },
  address: String,
  productCategories: [String],
  paymentTerms: String,
  products: [{
    id: String,
    productName: String,
    basePrice: Number,
    deliveryPrice: Number,
    withoutDeliveryPrice: Number,
    packagingPrice: Number,
    withoutPackagingPrice: Number,
    b2bPrice: Number,
    mrp: Number,
    unit: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Supplier', SupplierSchema);
