# 🏪 Quick Start: Supplier Management

## Access the Feature
1. Open your browser to `http://localhost:3000`
2. Click the **"🏪 Suppliers"** tab in the header

## Add Your First Supplier

### Step 1: Basic Details
```
Supplier Name: Khan Meat Suppliers *
Contact Person: Mohammed Khan
Email: khan@meatsupply.com
Phone: +91 98765 43210 *
Address: Shop 12, Main Market, Delhi
```

### Step 2: Select Categories
Click on relevant categories:
- ✅ Meat
- ✅ Dairy
- (Categories will turn purple when selected)

### Step 3: Payment Terms
Select from dropdown:
- Cash
- Credit 7 Days ⭐ (Popular)
- Credit 15 Days
- Credit 30 Days
- Advance

### Step 4: Add Products

**Example 1: Chicken**
```
Product Name: Fresh Chicken
Base Price: 180 (per kg)
Unit: kg

With Delivery: 190
Without Delivery: 180
With Packaging: 185
Without Packaging: 180
B2B Price: 175
MRP: 220
```
Click **"Add Product"**

**Example 2: Mutton**
```
Product Name: Premium Mutton
Base Price: 550
Unit: kg

With Delivery: 560
Without Delivery: 550
B2B Price: 530
MRP: 650
```
Click **"Add Product"**

### Step 5: Save
Click **"Save Supplier"** button

---

## Search & Filter

### Search Examples:
- Type "Khan" - finds supplier by name
- Type "98765" - finds by phone
- Type "Mohammed" - finds by contact person

### Filter by Category:
- Select "Meat" from dropdown
- Only suppliers with Meat category shown

---

## Edit a Supplier
1. Find the supplier card
2. Click the ✏️ (pencil) icon at top-right
3. Modify any details
4. Click "Update Supplier"

---

## View Product Prices
1. Find the supplier card
2. Click "Products (2)" accordion
3. See full pricing table

---

## Sample Suppliers to Add

### 1. Vegetable Supplier
```
Name: Fresh Farm Veggies
Phone: +91 98888 12345
Categories: Vegetables
Payment: Credit 7 Days

Products:
- Onions: ₹40/kg (Base), ₹45 (Delivery), ₹35 (B2B)
- Tomatoes: ₹60/kg (Base), ₹65 (Delivery), ₹55 (B2B)
- Potatoes: ₹30/kg (Base), ₹35 (Delivery), ₹25 (B2B)
```

### 2. Spice Supplier
```
Name: Spice King
Phone: +91 97777 54321
Categories: Spices
Payment: Cash

Products:
- Biryani Masala: ₹80/pack (Base), ₹450 (B2B/kg), ₹500 (MRP/kg)
- Red Chili Powder: ₹120/pack (Base), ₹600 (B2B/kg), ₹650 (MRP/kg)
- Turmeric Powder: ₹90/pack (Base), ₹450 (B2B/kg), ₹500 (MRP/kg)
```

### 3. Rice Supplier
```
Name: Basmati House
Phone: +91 96666 98765
Categories: Grains
Payment: Credit 15 Days

Products:
- Premium Basmati: ₹120/kg (Base), ₹125 (Delivery), ₹110 (B2B), ₹150 (MRP)
- Regular Rice: ₹60/kg (Base), ₹65 (Delivery), ₹55 (B2B), ₹80 (MRP)
```

---

## Tips for Best Results

### ✅ Do's:
- Fill both Supplier Name and Phone (required)
- Add all relevant product categories
- Include as many pricing options as available
- Use consistent units (kg, piece, pack, liter)
- Add contact email for easy communication

### ❌ Don'ts:
- Don't leave required fields empty
- Don't add products without base price
- Don't forget to click "Add Product" before saving
- Don't worry if some price fields are empty - they're optional

---

## Keyboard Shortcuts
- `Enter` in Product Name field: moves to Base Price
- `Enter` in Base Price: adds product (if valid)
- `Esc` in dialog: closes form

---

## Data Persistence
- All supplier data saves automatically to browser
- Data persists even after closing browser
- Safe to refresh page - data won't be lost
- Clear browser data = clears suppliers (use Export feature in future)

---

## Troubleshooting

**Q: "Save Supplier" button doesn't work**
- Check: Supplier Name filled?
- Check: Phone number filled?

**Q: Product not added to list**
- Check: Product Name entered?
- Check: Base Price entered?
- Did you click "Add Product" button?

**Q: Search shows no results**
- Check spelling
- Try shorter search term
- Reset category filter to "All"

**Q: Can't see pricing table**
- Click "Products (X)" accordion to expand
- Check if products were added to supplier

---

## Next Steps
Once comfortable with the system:
1. Add all your current suppliers
2. Keep pricing updated regularly
3. Use search to quickly find best prices
4. Compare prices across suppliers
5. Export data for backup (coming soon)

## Need Help?
- Check SUPPLIER_MANAGEMENT.md for detailed documentation
- All changes save automatically
- Can't break anything - just try it out! 🎉
