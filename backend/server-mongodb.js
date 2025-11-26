const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const Order = require('./models/Order');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/halalbazar';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Create a new order calculation
app.post('/api/orders', async (req, res) => {
  try {
    const {
      numberOfBiryani,
      ingredientCost,
      electricityBill,
      labourCost,
      profitMargin
    } = req.body;

    // Validation
    if (!numberOfBiryani || !ingredientCost || !electricityBill || !labourCost || profitMargin === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Calculate total cost
    const totalCost = parseFloat(ingredientCost) + parseFloat(electricityBill) + parseFloat(labourCost);
    
    // Calculate cost per biryani packet
    const costPerBiryani = totalCost / parseInt(numberOfBiryani);
    
    // Calculate selling price with profit margin
    const sellingPricePerBiryani = costPerBiryani * (1 + parseFloat(profitMargin) / 100);
    
    // Calculate total selling price
    const totalSellingPrice = sellingPricePerBiryani * parseInt(numberOfBiryani);
    
    // Calculate profit per order
    const profitPerOrder = totalSellingPrice - totalCost;

    // Create new order
    const order = new Order({
      numberOfBiryani: parseInt(numberOfBiryani),
      ingredientCost: parseFloat(ingredientCost),
      electricityBill: parseFloat(electricityBill),
      labourCost: parseFloat(labourCost),
      profitMargin: parseFloat(profitMargin),
      totalCost: parseFloat(totalCost.toFixed(2)),
      costPerBiryani: parseFloat(costPerBiryani.toFixed(2)),
      sellingPricePerBiryani: parseFloat(sellingPricePerBiryani.toFixed(2)),
      totalSellingPrice: parseFloat(totalSellingPrice.toFixed(2)),
      profitPerOrder: parseFloat(profitPerOrder.toFixed(2))
    });

    await order.save();

    res.json({
      message: 'Order calculated successfully',
      orderId: order._id,
      calculation: {
        numberOfBiryani: order.numberOfBiryani,
        ingredientCost: order.ingredientCost,
        electricientCost: order.electricityBill,
        labourCost: order.labourCost,
        profitMargin: order.profitMargin,
        totalCost: order.totalCost.toFixed(2),
        costPerBiryani: order.costPerBiryani.toFixed(2),
        sellingPricePerBiryani: order.sellingPricePerBiryani.toFixed(2),
        totalSellingPrice: order.totalSellingPrice.toFixed(2),
        profitPerOrder: order.profitPerOrder.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    
    const formattedOrders = orders.map(order => ({
      id: order._id,
      number_of_biryani: order.numberOfBiryani,
      ingredient_cost: order.ingredientCost,
      electricity_bill: order.electricityBill,
      labour_cost: order.labourCost,
      profit_margin: order.profitMargin,
      total_cost: order.totalCost,
      cost_per_biryani: order.costPerBiryani,
      selling_price_per_biryani: order.sellingPricePerBiryani,
      total_selling_price: order.totalSellingPrice,
      profit_per_order: order.profitPerOrder,
      created_at: order.createdAt
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get a specific order by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      id: order._id,
      number_of_biryani: order.numberOfBiryani,
      ingredient_cost: order.ingredientCost,
      electricity_bill: order.electricityBill,
      labour_cost: order.labourCost,
      profit_margin: order.profitMargin,
      total_cost: order.totalCost,
      cost_per_biryani: order.costPerBiryani,
      selling_price_per_biryani: order.sellingPricePerBiryani,
      total_selling_price: order.totalSellingPrice,
      profit_per_order: order.profitPerOrder,
      created_at: order.createdAt
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Delete an order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
