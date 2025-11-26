const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// MySQL Connection (Railway.app compatible)
const db = mysql.createConnection({
  host: process.env.DB_HOST || process.env.MYSQLHOST,
  user: process.env.DB_USER || process.env.MYSQLUSER,
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE,
  port: process.env.DB_PORT || process.env.MYSQLPORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
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

  // Insert into database
  const query = `
    INSERT INTO orders 
    (number_of_biryani, ingredient_cost, electricity_bill, labour_cost, profit_margin, 
     total_cost, cost_per_biryani, selling_price_per_biryani, total_selling_price, profit_per_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    numberOfBiryani,
    ingredientCost,
    electricityBill,
    labourCost,
    profitMargin,
    totalCost,
    costPerBiryani,
    sellingPricePerBiryani,
    totalSellingPrice,
    profitPerOrder
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({
      message: 'Order calculated successfully',
      orderId: result.insertId,
      calculation: {
        numberOfBiryani: parseInt(numberOfBiryani),
        ingredientCost: parseFloat(ingredientCost),
        electricityBill: parseFloat(electricityBill),
        labourCost: parseFloat(labourCost),
        profitMargin: parseFloat(profitMargin),
        totalCost: totalCost.toFixed(2),
        costPerBiryani: costPerBiryani.toFixed(2),
        sellingPricePerBiryani: sellingPricePerBiryani.toFixed(2),
        totalSellingPrice: totalSellingPrice.toFixed(2),
        profitPerOrder: profitPerOrder.toFixed(2)
      }
    });
  });
});

// Get all orders
app.get('/api/orders', (req, res) => {
  const query = 'SELECT * FROM orders ORDER BY created_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get a specific order by ID
app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM orders WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching order:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(results[0]);
  });
});

// Delete an order
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM orders WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting order:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ message: 'Order deleted successfully' });
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
