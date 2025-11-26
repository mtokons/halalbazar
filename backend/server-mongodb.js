const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Models
const Order = require('./models/Order');
const Customer = require('./models/Customer');
const Supplier = require('./models/Supplier');
const MenuItem = require('./models/MenuItem');
const OrderManagement = require('./models/OrderManagement');
const Inventory = require('./models/Inventory');
const SupplierHistory = require('./models/SupplierHistory');
const CustomerOrderHistory = require('./models/CustomerOrderHistory');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/halalbazar';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// ==================== CUSTOMERS ====================
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    await Customer.findOneAndDelete({ customerId: req.params.id });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SUPPLIERS ====================
app.get('/api/suppliers', async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/suppliers', async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndUpdate(
      { supplierId: req.params.id },
      req.body,
      { new: true }
    );
    res.json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    await Supplier.findOneAndDelete({ supplierId: req.params.id });
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== MENU ITEMS ====================
app.get('/api/menu-items', async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/menu-items', async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/menu-items/:id', async (req, res) => {
  try {
    await MenuItem.findOneAndDelete({ menuId: req.params.id });
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ORDERS MANAGEMENT ====================
app.get('/api/orders-management', async (req, res) => {
  try {
    const orders = await OrderManagement.find().sort({ placedAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders-management', async (req, res) => {
  try {
    const order = new OrderManagement(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/orders-management/:id/status', async (req, res) => {
  try {
    const order = await OrderManagement.findOneAndUpdate(
      { orderId: req.params.id },
      { 
        status: req.body.status,
        updatedAt: new Date()
      },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== INVENTORY ====================
app.get('/api/inventory', async (req, res) => {
  try {
    const items = await Inventory.find().sort({ itemName: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/inventory', async (req, res) => {
  try {
    const item = new Inventory(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  try {
    const item = await Inventory.findOneAndUpdate(
      { inventoryId: req.params.id },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/inventory/:id/transaction', async (req, res) => {
  try {
    const item = await Inventory.findOne({ inventoryId: req.params.id });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const { type, quantity, reason } = req.body;
    
    if (type === 'in') {
      item.quantity += quantity;
    } else if (type === 'out') {
      item.quantity -= quantity;
    }
    
    item.transactions.push({
      type,
      quantity,
      reason,
      date: new Date()
    });
    
    item.updatedAt = new Date();
    await item.save();
    
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  try {
    await Inventory.findOneAndDelete({ inventoryId: req.params.id });
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== REPORTS ====================
app.get('/api/reports/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {};
    if (startDate && endDate) {
      query.placedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const orders = await OrderManagement.find(query);
    
    const totalSales = orders.reduce((sum, order) => sum + order.totalSellPrice, 0);
    const totalCost = orders.reduce((sum, order) => sum + order.totalCost, 0);
    const totalProfit = orders.reduce((sum, order) => sum + order.profit, 0);
    
    const statusBreakdown = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    
    res.json({
      totalOrders: orders.length,
      totalSales,
      totalCost,
      totalProfit,
      averageOrderValue: orders.length > 0 ? totalSales / orders.length : 0,
      profitMargin: totalCost > 0 ? (totalProfit / totalCost) * 100 : 0,
      statusBreakdown,
      orders: orders.map(order => ({
        orderId: order.orderId,
        customerName: order.customerName,
        orderDate: order.orderDate,
        status: order.status,
        totalSellPrice: order.totalSellPrice,
        profit: order.profit
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== BIRYANI CALCULATOR ====================
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const {
      numberOfBiryani,
      ingredientCost,
      electricityBill,
      labourCost,
      profitMargin
    } = req.body;

    if (!numberOfBiryani || !ingredientCost || !electricityBill || !labourCost || profitMargin === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const totalCost = parseFloat(ingredientCost) + parseFloat(electricityBill) + parseFloat(labourCost);
    const costPerBiryani = totalCost / parseFloat(numberOfBiryani);
    const profitPerBiryani = costPerBiryani * (parseFloat(profitMargin) / 100);
    const sellingPrice = costPerBiryani + profitPerBiryani;
    const profitOrLoss = profitPerBiryani * parseFloat(numberOfBiryani);

    const order = new Order({
      numberOfBiryani: parseFloat(numberOfBiryani),
      ingredientCost: parseFloat(ingredientCost),
      electricityBill: parseFloat(electricityBill),
      labourCost: parseFloat(labourCost),
      profitMargin: parseFloat(profitMargin),
      totalCost,
      costPerBiryani,
      sellingPrice,
      profitOrLoss
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SUPPLIER HISTORY ====================
app.get('/api/supplier-history/:supplierId', async (req, res) => {
  try {
    const history = await SupplierHistory.find({ supplierId: req.params.supplierId })
      .sort({ transactionDate: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/supplier-history', async (req, res) => {
  try {
    const history = new SupplierHistory({
      historyId: `SUPH-${Date.now()}`,
      ...req.body
    });
    await history.save();
    res.status(201).json(history);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== CUSTOMER ORDER HISTORY ====================
app.get('/api/customer-history/:customerId', async (req, res) => {
  try {
    const history = await CustomerOrderHistory.find({ customerId: req.params.customerId })
      .sort({ orderDate: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customer-history', async (req, res) => {
  try {
    const history = new CustomerOrderHistory(req.body);
    await history.save();
    res.status(201).json(history);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/customer-history/:id', async (req, res) => {
  try {
    const history = await CustomerOrderHistory.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(history);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}`);
});
