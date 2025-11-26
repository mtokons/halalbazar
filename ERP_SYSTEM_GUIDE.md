# 🏢 Halal Bazar ERP System - Complete Guide

## 🎯 Overview

**Halal Bazar** is a comprehensive Enterprise Resource Planning (ERP) system designed specifically for food businesses, particularly biryani and halal food operations. It integrates supplier management, order processing, inventory tracking, and cost calculation into one unified platform.

---

## 🚀 Features

### 1. **Home Dashboard** 
- Company logo and navigation hub
- Real-time order status with progress bars
- Low stock and missing items alerts
- Quick statistics overview
- One-click navigation to all modules

### 2. **Supplier Management** 
- Complete supplier database with contact information
- Multi-product catalog per supplier
- Flexible pricing structures:
  - Base Price
  - Delivery/No Delivery options
  - Packaging/No Packaging options
  - B2B pricing
  - MRP (Maximum Retail Price)
- Category-based organization
- Payment terms tracking
- Search and filter functionality

### 3. **Order Management** 
- Create orders with mixed source items:
  - **In-House Menu Items**: Full cost breakdown (raw materials, labor, utilities, packaging)
  - **Supplier Products**: Direct pricing from supplier database
- Dynamic line item addition
- Automatic cost calculations:
  - Total in-house cost
  - Total supplier cost
  - Profit margin configuration
  - Final selling price
- Customer information management
- Order status tracking (Pending, In Progress, Ready, Completed)

### 4. **Inventory Management** 
- Track raw materials, packaging, and supplies
- Real-time stock levels
- Automated low-stock alerts
- Quick stock adjustments (add/remove)
- Category-based organization
- Supplier linking
- Total inventory value calculation
- Search and filter by item or category

### 5. **Cost Calculator** 
- Original biryani cost calculator
- Calculate per-order costs and profits
- Historical order tracking
- Instant results display

---

## 📂 Project Structure

```
HalalBazar/
├── backend/
│   ├── server-mongodb.js       # MongoDB backend
│   └── .env                    # Database config
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Home/
│       │   │   └── HomePage.js          # Dashboard
│       │   ├── Suppliers/
│       │   │   ├── SupplierManagement.js
│       │   │   ├── SupplierForm.js
│       │   │   └── SupplierList.js
│       │   ├── Orders/
│       │   │   └── OrderManagement.js   # Order system
│       │   ├── Inventory/
│       │   │   └── InventoryManagement.js
│       │   ├── OrderForm.js             # Calculator form
│       │   ├── OrderHistory.js
│       │   └── ResultDisplay.js
│       ├── App.js               # Router & Navigation
│       ├── App.css
│       └── config.js
│
├── firebase.json
└── package.json
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - UI framework
- **Material-UI** - Component library
- **React Router v6** - Navigation
- **Axios** - HTTP requests
- **localStorage** - Data persistence

### Backend
- **Node.js** - Runtime
- **Express.js** - API framework
- **MongoDB Atlas** - Database
- **Mongoose** - ODM

### Deployment
- **Firebase Hosting** - Frontend
- **Render.com** - Backend
- **MongoDB Atlas** - Database (Cloud)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20.19.5
- npm
- Firebase CLI (for deployment)

### Local Development

1. **Clone the Repository**
```powershell
git clone https://github.com/mtokons/halalbazar.git
cd halalbazar
```

2. **Install Dependencies**
```powershell
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configure Environment Variables**

`backend/.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

`frontend/.env.local`:
```
REACT_APP_API_URL=http://localhost:5000
```

4. **Start Development Servers**

Terminal 1 - Backend:
```powershell
cd backend
node server-mongodb.js
```

Terminal 2 - Frontend:
```powershell
cd frontend
npm start
```

5. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 📖 User Guide

### Getting Started

1. **Access Home Page**
   - Open http://localhost:3000
   - View dashboard with quick stats
   - See active orders and inventory alerts

2. **Add Suppliers First**
   - Click "Supplier Management" button
   - Add suppliers with products and pricing
   - This data will be used in orders

3. **Setup Inventory**
   - Navigate to "Inventory Management"
   - Add raw materials and supplies
   - Set reorder levels for alerts

4. **Create Orders**
   - Go to "Order Management"
   - Add customer information
   - Add line items (in-house or supplier products)
   - System calculates costs automatically
   - Review and save order

5. **Monitor Dashboard**
   - Return to Home page
   - Track order progress
   - Check inventory alerts
   - View quick statistics

### Detailed Workflows

#### Creating an Order with Mixed Items

**Example: Restaurant Order for 50 Biryani Plates + Beverages**

1. Navigate to Orders → Create New Order
2. Enter customer details
3. Add In-House Item:
   - Type: In-House
   - Item Name: "Chicken Biryani"
   - Quantity: 50 plates
   - Raw Materials:
     - Rice: ₹25
     - Chicken: ₹50
     - Spices: ₹10
     - Vegetables: ₹5
     - Oil: ₹3
   - Packaging: ₹5
   - Labor: ₹15
   - Utilities: ₹5
   - **Unit Cost**: ₹118/plate
   - **Total**: ₹5,900

4. Add Supplier Item:
   - Type: Supplier
   - Select: "Coca Cola - 1L (₹40/piece)"
   - Quantity: 50 pieces
   - **Total**: ₹2,000

5. Set Profit Margin: 25%
6. Review Summary:
   - In-House Cost: ₹5,900
   - Supplier Cost: ₹2,000
   - **Total Cost**: ₹7,900
   - **Profit (25%)**: ₹1,975
   - **Selling Price**: ₹9,875

7. Save Order

#### Managing Inventory Stock

**Scenario: Rice stock running low**

1. Navigate to Inventory
2. See "Low Stock Alert" for Basmati Rice (5kg remaining)
3. Click "Add Stock" button (⬆️ icon)
4. Enter quantity: 50 kg
5. New stock: 55 kg
6. Alert clears automatically

#### Finding Best Supplier Price

1. Navigate to Suppliers
2. Use search: "chicken"
3. Filter by Category: "Meat"
4. Compare prices across suppliers
5. Click accordion to view all pricing options
6. Select supplier with best terms

---

## 📊 Data Flow

### localStorage Structure

```javascript
// Suppliers
{
  id: 123456,
  supplierName: "Khan Meat Suppliers",
  contactPerson: "Mohammed Khan",
  email: "khan@example.com",
  phone: "+91 98765 43210",
  address: "Shop 12, Main Market",
  productCategories: ["Meat", "Dairy"],
  paymentTerms: "Credit 7 Days",
  products: [
    {
      id: 789,
      productName: "Fresh Chicken",
      basePrice: 180,
      unit: "kg",
      deliveryPrice: 190,
      b2bPrice: 175,
      mrp: 220
    }
  ]
}

// Orders
{
  id: 456789,
  orderId: "ORD-1234567890",
  customerName: "Restaurant ABC",
  customerPhone: "+91 99999 11111",
  orderDate: "2025-11-26",
  lineItems: [
    {
      type: "in-house",
      itemName: "Chicken Biryani",
      quantity: 50,
      unit: "plate",
      rawMaterials: { rice: 25, chicken: 50, ... },
      packaging: 5,
      labor: 15,
      unitCost: 118
    },
    {
      type: "supplier",
      itemName: "Coca Cola 1L",
      quantity: 50,
      supplierPrice: 40,
      unitCost: 40
    }
  ],
  profitMargin: 25,
  totalInHouseCost: 5900,
  totalSupplierCost: 2000,
  totalCost: 7900,
  profitAmount: 1975,
  sellingPrice: 9875,
  status: "Pending"
}

// Inventory
{
  id: 1,
  itemName: "Basmati Rice",
  category: "Grains",
  quantity: 50,
  unit: "kg",
  purchasePrice: 120,
  reorderLevel: 20,
  supplier: "Basmati House",
  lastUpdated: "2025-11-26T..."
}
```

---

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly buttons
- Collapsible sections

### Visual Feedback
- Color-coded status indicators
- Progress bars for orders
- Alert badges for low stock
- Hover effects on interactive elements

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation support
- Clear visual hierarchy

---

## 🔧 Configuration

### Profit Margin
Default: 25%
Configurable per order in Order Management

### Stock Alerts
Configurable per inventory item via "Reorder Level" field

### Payment Terms Options
- Cash
- Credit 7 Days
- Credit 15 Days
- Credit 30 Days
- Advance

---

## 🚀 Deployment

### Frontend (Firebase)
```powershell
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

### Backend (Render.com)
Auto-deploys from GitHub on push to main branch

---

## 📈 Future Enhancements

### Planned Features
- [ ] User authentication and roles
- [ ] Multi-user support
- [ ] PDF invoice generation
- [ ] Email notifications
- [ ] SMS order updates
- [ ] Barcode scanning
- [ ] QR code generation
- [ ] Sales analytics and reports
- [ ] Supplier performance tracking
- [ ] Automated reordering
- [ ] Payment gateway integration
- [ ] Mobile app (React Native)
- [ ] WhatsApp integration
- [ ] Recipe management
- [ ] Staff management
- [ ] Delivery tracking

### Backend Integration
Currently using localStorage. Planned migration:
- REST API endpoints
- MongoDB schemas for all entities
- Real-time data synchronization
- Cloud backup and restore

---

## 🐛 Troubleshooting

### Common Issues

**1. Navigation not working**
- Ensure react-router-dom is installed
- Check browser console for errors
- Clear browser cache

**2. Data not persisting**
- Check browser localStorage
- Don't use private/incognito mode
- Check browser storage quota

**3. Components not rendering**
- Verify all dependencies installed
- Check Material-UI version compatibility
- Restart development server

**4. Order calculations incorrect**
- Verify all numeric fields filled
- Check profit margin percentage
- Ensure quantity is positive number

---

## 📞 Support

For issues or questions:
- Check documentation files
- Review console errors
- Test in different browser
- Clear localStorage and retry

---

## 📄 License

This project is for internal business use.

---

## 👥 Credits

Developed for Halal Bazar business operations.
Built with React, Material-UI, and MongoDB.

---

## 📝 Version History

### v2.0.0 - ERP System (November 2025)
- Added Home Dashboard
- Added Order Management with mixed sources
- Added Inventory Management
- Integrated React Router
- Material-UI implementation
- Complete ERP functionality

### v1.0.0 - Cost Calculator (Initial)
- Basic biryani cost calculator
- Supplier management
- Firebase deployment

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Material-UI](https://mui.com)
- [React Router](https://reactrouter.com)
- [MongoDB](https://www.mongodb.com/docs)

---

**Happy Business Management! 🎉**
