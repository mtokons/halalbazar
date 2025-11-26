const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage (for local testing without database)
let orders = [];
let nextId = 1;

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running (In-Memory Mode)' });
});

// Create a new order calculation
app.post('/api/orders', (req, res) => {
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

  // Create order object
  const order = {
    id: nextId++,
    number_of_biryani: parseInt(numberOfBiryani),
    ingredient_cost: parseFloat(ingredientCost),
    electricity_bill: parseFloat(electricityBill),
    labour_cost: parseFloat(labourCost),
    profit_margin: parseFloat(profitMargin),
    total_cost: parseFloat(totalCost.toFixed(2)),
    cost_per_biryani: parseFloat(costPerBiryani.toFixed(2)),
    selling_price_per_biryani: parseFloat(sellingPricePerBiryani.toFixed(2)),
    total_selling_price: parseFloat(totalSellingPrice.toFixed(2)),
    profit_per_order: parseFloat(profitPerOrder.toFixed(2)),
    created_at: new Date().toISOString()
  };

  orders.unshift(order);

  res.json({
    message: 'Order calculated successfully',
    orderId: order.id,
    calculation: {
      numberOfBiryani: order.number_of_biryani,
      ingredientCost: order.ingredient_cost,
      electricityBill: order.electricity_bill,
      labourCost: order.labour_cost,
      profitMargin: order.profit_margin,
      totalCost: order.total_cost.toFixed(2),
      costPerBiryani: order.cost_per_biryani.toFixed(2),
      sellingPricePerBiryani: order.selling_price_per_biryani.toFixed(2),
      totalSellingPrice: order.total_selling_price.toFixed(2),
      profitPerOrder: order.profit_per_order.toFixed(2)
    }
  });
});

// Get all orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Get a specific order by ID
app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const order = orders.find(o => o.id === parseInt(id));
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  res.json(order);
});

// Delete an order
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const index = orders.findIndex(o => o.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  orders.splice(index, 1);
  res.json({ message: 'Order deleted successfully' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api/health`);
  console.log(`⚠️  Using in-memory storage (data will be lost on restart)`);
});
