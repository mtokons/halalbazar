const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
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

    // Prepare order data
    const orderData = {
      numberOfBiryani: parseInt(numberOfBiryani),
      ingredientCost: parseFloat(ingredientCost),
      electricityBill: parseFloat(electricityBill),
      labourCost: parseFloat(labourCost),
      profitMargin: parseFloat(profitMargin),
      totalCost: parseFloat(totalCost.toFixed(2)),
      costPerBiryani: parseFloat(costPerBiryani.toFixed(2)),
      sellingPricePerBiryani: parseFloat(sellingPricePerBiryani.toFixed(2)),
      totalSellingPrice: parseFloat(totalSellingPrice.toFixed(2)),
      profitPerOrder: parseFloat(profitPerOrder.toFixed(2)),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save to Firestore
    const docRef = await db.collection('orders').add(orderData);

    res.json({
      message: 'Order calculated successfully',
      orderId: docRef.id,
      calculation: {
        ...orderData,
        createdAt: new Date().toISOString()
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
    const ordersSnapshot = await db.collection('orders')
      .orderBy('createdAt', 'desc')
      .get();

    const orders = [];
    ordersSnapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
      });
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get a specific order by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('orders').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
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
    const docRef = db.collection('orders').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await docRef.delete();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);
