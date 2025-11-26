# 🧪 System Testing Checklist

## Test Date: November 26, 2025
**URL**: http://localhost:3000

---

## ✅ 1. Home Page Tests

### Visual Elements
- [ ] Company logo displayed and centered
- [ ] Three navigation buttons visible:
  - [ ] 🏪 Supplier Management
  - [ ] 📦 Order Management  
  - [ ] 📊 Inventory Management
- [ ] Dashboard section showing active orders
- [ ] Missing items alerts visible (if any)

### Navigation
- [ ] Click "Supplier Management" → Redirects to `/suppliers`
- [ ] Click "Order Management" → Redirects to `/orders`
- [ ] Click "Inventory Management" → Redirects to `/inventory`
- [ ] Browser back button works correctly
- [ ] URL updates properly on navigation

---

## ✅ 2. Supplier Management Tests

### Add New Supplier
- [ ] Click "Add Supplier" button opens dialog
- [ ] Form validation works:
  - [ ] Supplier Name required
  - [ ] Phone required
  - [ ] Other fields optional
- [ ] Product categories selection:
  - [ ] Can select multiple categories
  - [ ] Categories turn purple when selected
  - [ ] Can remove categories
- [ ] Payment terms dropdown works
- [ ] Can add products:
  - [ ] Product name + base price required
  - [ ] Unit selection works (kg, piece, pack, liter)
  - [ ] Optional pricing fields work
  - [ ] "Add Product" button adds to list
  - [ ] Can delete added products
- [ ] "Save Supplier" saves successfully
- [ ] Dialog closes after save

### Test Data to Add:
```
Supplier 1:
Name: Khan Meat Suppliers
Phone: +91 98765 43210
Email: khan@meatsupply.com
Categories: Meat, Dairy
Payment: Credit 7 Days

Products:
- Fresh Chicken: ₹180/kg, Delivery: ₹190, B2B: ₹175, MRP: ₹220
- Premium Mutton: ₹550/kg, Delivery: ₹560, B2B: ₹530, MRP: ₹650
```

```
Supplier 2:
Name: Fresh Farm Veggies
Phone: +91 98888 12345
Categories: Vegetables
Payment: Cash

Products:
- Onions: ₹40/kg, Delivery: ₹45, B2B: ₹35
- Tomatoes: ₹60/kg, Delivery: ₹65, B2B: ₹55
- Potatoes: ₹30/kg, Delivery: ₹35, B2B: ₹25
```

### Supplier List View
- [ ] Both suppliers display in cards
- [ ] Contact information shows correctly
- [ ] Category chips display
- [ ] Payment terms badge shows
- [ ] Products accordion expands/collapses
- [ ] Product pricing table displays all columns

### Search & Filter
- [ ] Search by supplier name works
- [ ] Search by phone works
- [ ] Search by contact person works
- [ ] Category filter works
- [ ] "All" category shows all suppliers
- [ ] Result count updates correctly

### Edit & Delete
- [ ] Edit button opens form with existing data
- [ ] Can modify and update supplier
- [ ] Delete button shows confirmation
- [ ] Delete removes supplier from list
- [ ] Data persists after page refresh

---

## ✅ 3. Order Management Tests

### Create New Order
- [ ] "Create New Order" button works
- [ ] Customer name field required
- [ ] Can add multiple line items
- [ ] "Add Line Item" button works

### Line Item - In-House Item
- [ ] Select "In-House Item" type
- [ ] Enter menu item name (e.g., "Chicken Biryani")
- [ ] Add raw materials:
  - [ ] Rice cost
  - [ ] Chicken cost
  - [ ] Spices cost
- [ ] Add packaging cost
- [ ] Add utilities cost
- [ ] Add labor cost
- [ ] Add other costs
- [ ] Quantity field works
- [ ] Total in-house cost calculates correctly

### Line Item - Supplier Product
- [ ] Select "Supplier Product" type
- [ ] Supplier dropdown populates from supplier list
- [ ] Product dropdown shows supplier's products
- [ ] Price auto-fills from selected product
- [ ] Pricing type selection works:
  - [ ] Base Price
  - [ ] With Delivery
  - [ ] Without Delivery
  - [ ] With Packaging
  - [ ] Without Packaging
  - [ ] B2B Price
  - [ ] MRP
- [ ] Quantity field works
- [ ] Total cost calculates correctly

### Test Order to Create:
```
Customer: ABC Restaurant
Order Items:
1. In-House: Chicken Biryani (50 plates)
   - Rice: ₹500
   - Chicken: ₹2000
   - Spices: ₹300
   - Packaging: ₹250
   - Utilities: ₹100
   - Labor: ₹500
   - Profit Margin: 25%

2. Supplier: Fresh Chicken from Khan Meat Suppliers
   - Quantity: 10 kg
   - Price Type: B2B (₹175/kg)
```

### Order Summary
- [ ] Shows total in-house cost
- [ ] Shows total supplier cost
- [ ] Shows profit margin
- [ ] Shows final selling price
- [ ] Shows total order cost
- [ ] All fields editable
- [ ] Recalculates on edit

### Save & List
- [ ] "Save Order" button works
- [ ] Order appears in list
- [ ] Order details display correctly
- [ ] Can edit existing order
- [ ] Can delete order
- [ ] Status updates work (Pending → In Progress → Completed)

---

## ✅ 4. Inventory Management Tests

### Add Inventory Item
- [ ] "Add Item" button opens form
- [ ] Item name required
- [ ] Quantity required
- [ ] Unit selection works (kg, piece, pack, liter)
- [ ] Purchase price field works
- [ ] Reorder level field works
- [ ] "Add Inventory Item" saves successfully

### Test Items to Add:
```
Item 1:
Name: Basmati Rice
Quantity: 100
Unit: kg
Purchase Price: ₹80
Reorder Level: 20

Item 2:
Name: Fresh Chicken
Quantity: 50
Unit: kg
Purchase Price: ₹180
Reorder Level: 10

Item 3:
Name: Packaging Boxes
Quantity: 500
Unit: piece
Purchase Price: ₹5
Reorder Level: 100
```

### Inventory Table
- [ ] All items display in table
- [ ] Current stock levels show
- [ ] Unit displays correctly
- [ ] Purchase price shows
- [ ] Low stock items highlighted in red/yellow
- [ ] Alert icon shows for low stock

### Stock Adjustments
- [ ] Can add stock (In transaction)
- [ ] Can remove stock (Out transaction)
- [ ] Stock balance updates correctly
- [ ] Transaction history visible
- [ ] Current quantity reflects changes

### Search & Filter
- [ ] Search by item name works
- [ ] Filter by unit works
- [ ] Filter by low stock works
- [ ] Sort by name works
- [ ] Sort by quantity works

### Low Stock Alerts
- [ ] Items below reorder level show warning
- [ ] Alert count shows in dashboard
- [ ] Can click alert to view item details

---

## ✅ 5. Integration Tests

### Supplier → Order Integration
- [ ] Suppliers created are available in order dropdown
- [ ] Supplier products populate correctly
- [ ] Prices sync from supplier data
- [ ] Editing supplier updates order options

### Order → Inventory Integration
- [ ] Creating order deducts from inventory (future)
- [ ] Missing items show in dashboard alerts
- [ ] Low stock items flag in order creation

### Inventory → Dashboard Integration
- [ ] Low stock items show on home page
- [ ] Alert count is accurate
- [ ] Clicking alert navigates to inventory

### Data Persistence
- [ ] Suppliers persist after page refresh
- [ ] Orders persist after page refresh
- [ ] Inventory items persist after page refresh
- [ ] localStorage contains all data

---

## ✅ 6. UI/UX Tests

### Responsive Design
- [ ] Works on full screen (1920x1080)
- [ ] Works on laptop screen (1366x768)
- [ ] Works on tablet view (768px)
- [ ] Works on mobile view (375px)
- [ ] Navigation remains usable on mobile
- [ ] Tables scroll horizontally on mobile

### Material-UI Components
- [ ] All buttons styled correctly
- [ ] All dialogs/modals work
- [ ] All text fields have proper labels
- [ ] All dropdowns function
- [ ] Icons display correctly
- [ ] Color scheme consistent

### User Experience
- [ ] Loading states visible
- [ ] Success messages show
- [ ] Error messages clear
- [ ] Confirmation dialogs for delete
- [ ] Form validation messages helpful
- [ ] Navigation intuitive

---

## ✅ 7. Performance Tests

### Load Times
- [ ] Home page loads < 2 seconds
- [ ] Supplier page loads < 2 seconds
- [ ] Order page loads < 2 seconds
- [ ] Inventory page loads < 2 seconds

### Large Data Sets
- [ ] Add 20+ suppliers → still responsive
- [ ] Add 50+ orders → still responsive
- [ ] Add 100+ inventory items → still responsive
- [ ] Search/filter still fast

### Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Edge
- [ ] Works in Safari (if available)

---

## ✅ 8. Error Handling Tests

### Form Errors
- [ ] Empty required fields show error
- [ ] Invalid email shows error
- [ ] Negative numbers rejected
- [ ] Non-numeric input in number fields rejected

### Data Errors
- [ ] Can't save supplier without name
- [ ] Can't save order without customer
- [ ] Can't save inventory without quantity
- [ ] Duplicate entries handled gracefully

### Navigation Errors
- [ ] Invalid routes redirect to home
- [ ] 404 page shows for unknown URLs

---

## 🎯 Test Results Summary

### Passed: ___/___
### Failed: ___/___
### Blocked: ___/___

### Critical Issues Found:
1. 
2. 
3. 

### Minor Issues Found:
1. 
2. 
3. 

### Recommendations:
1. 
2. 
3. 

---

## 📝 Notes

**Tester**: _______________
**Duration**: _______________
**Browser**: _______________
**Screen Resolution**: _______________

**Additional Comments**:
_______________________________________________
_______________________________________________
_______________________________________________
