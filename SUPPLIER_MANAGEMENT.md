# Supplier Management System

## Overview
The Supplier Management System allows you to onboard and manage suppliers with their product pricing details.

## Features

### 1. **Supplier Onboarding Form**
- **Basic Information:**
  - Supplier Name (required)
  - Contact Person
  - Email
  - Phone (required)
  - Address

- **Product Categories:**
  - Pre-defined categories: Meat, Vegetables, Spices, Dairy, Grains, Others
  - Select multiple categories per supplier
  - Visual chip-based selection

- **Payment Terms:**
  - Cash
  - Credit 7 Days
  - Credit 15 Days
  - Credit 30 Days
  - Advance

- **Products & Pricing:**
  - Add multiple products per supplier
  - For each product:
    - Product Name
    - Base Price (required)
    - Unit (kg, piece, pack, liter)
    - With Delivery Price
    - Without Delivery Price
    - With Packaging Price
    - Without Packaging Price
    - B2B Price
    - MRP

### 2. **Supplier List View**
- **Search & Filter:**
  - Search by supplier name, contact person, or phone
  - Filter by product category
  - Real-time results count

- **Supplier Cards:**
  - Display all supplier information
  - Contact details with icons
  - Category chips
  - Payment terms badge
  - Expandable product table

- **Actions:**
  - Edit supplier details
  - Delete supplier (with confirmation)

### 3. **Product Pricing Table**
- Collapsible accordion view
- Comprehensive pricing grid showing:
  - Base price (highlighted)
  - Delivery options
  - Packaging options
  - B2B pricing
  - MRP
  - Unit of measurement

## Usage

### Adding a Supplier
1. Click "Add Supplier" button
2. Fill in supplier basic information
3. Select product categories
4. Choose payment terms
5. Add products with pricing details:
   - Enter product name and base price
   - Optionally add different pricing tiers
   - Click "Add Product" to add to list
6. Click "Save Supplier"

### Editing a Supplier
1. Click the edit icon (pencil) on any supplier card
2. Modify the information
3. Click "Update Supplier"

### Deleting a Supplier
1. Click the delete icon (trash) on any supplier card
2. Confirm deletion in the popup

### Searching & Filtering
1. Use the search bar to find suppliers by name, contact, or phone
2. Use the category dropdown to filter by product category
3. Results update in real-time

## Data Storage
- Currently uses **localStorage** for data persistence
- Data persists across browser sessions
- Can be easily migrated to backend API

## Backend Integration (Future)
To integrate with a backend API:

1. **Create Mongoose Schema:**
```javascript
const supplierSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  contactPerson: String,
  email: String,
  phone: { type: String, required: true },
  address: String,
  productCategories: [String],
  paymentTerms: String,
  products: [{
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
```

2. **Create API Routes:**
```javascript
// POST /api/suppliers - Create supplier
// GET /api/suppliers - Get all suppliers
// GET /api/suppliers/:id - Get single supplier
// PUT /api/suppliers/:id - Update supplier
// DELETE /api/suppliers/:id - Delete supplier
```

3. **Update SupplierManagement.js:**
- Replace localStorage with API calls
- Use axios for HTTP requests
- Add error handling

## Dependencies
- **@mui/material** - Material-UI components
- **@mui/icons-material** - Material-UI icons
- **@emotion/react** - CSS-in-JS styling
- **@emotion/styled** - Styled components
- **React** - Core framework

## Component Structure
```
frontend/src/components/Suppliers/
├── SupplierManagement.js  - Main container component
├── SupplierForm.js        - Form dialog for add/edit
└── SupplierList.js        - List view with search/filter
```

## Styling
- Uses Material-UI's built-in theming
- Responsive design for mobile/tablet/desktop
- Consistent with Material Design guidelines
- Card-based layout for easy scanning

## Tips
1. **Product Pricing:** Not all pricing fields are required - add only what's relevant for each product
2. **Categories:** Select all relevant categories to make suppliers easier to find
3. **Search:** The search is flexible - it searches across name, contact person, and phone
4. **Units:** Choose the appropriate unit for each product to avoid confusion

## Future Enhancements
- Export supplier data to CSV/Excel
- Import suppliers from file
- Price history tracking
- Supplier performance metrics
- Auto-calculate best pricing options
- Supplier comparison tool
- Contract/agreement attachment
- Email integration for quotes
- SMS notifications for orders
