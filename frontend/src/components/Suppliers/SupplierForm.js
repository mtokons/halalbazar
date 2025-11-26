import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  Typography,
  Box,
  Divider,
  MenuItem,
  Chip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const SupplierForm = ({ open, onClose, onSave, editSupplier }) => {
  const [formData, setFormData] = useState({
    supplierName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    productCategories: [],
    paymentTerms: '',
    products: []
  });

  const [newCategory, setNewCategory] = useState('');
  const [newProduct, setNewProduct] = useState({
    productName: '',
    basePrice: '',
    deliveryPrice: '',
    withoutDeliveryPrice: '',
    packagingPrice: '',
    withoutPackagingPrice: '',
    b2bPrice: '',
    mrp: '',
    unit: 'kg'
  });

  const categories = ['Meat', 'Vegetables', 'Spices', 'Dairy', 'Grains', 'Others'];
  const paymentOptions = ['Cash', 'Credit 7 Days', 'Credit 15 Days', 'Credit 30 Days', 'Advance'];

  useEffect(() => {
    if (editSupplier) {
      setFormData(editSupplier);
    } else {
      resetForm();
    }
  }, [editSupplier, open]);

  const resetForm = () => {
    setFormData({
      supplierName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      productCategories: [],
      paymentTerms: '',
      products: []
    });
    setNewProduct({
      productName: '',
      basePrice: '',
      deliveryPrice: '',
      withoutDeliveryPrice: '',
      packagingPrice: '',
      withoutPackagingPrice: '',
      b2bPrice: '',
      mrp: '',
      unit: 'kg'
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddCategory = (category) => {
    if (!formData.productCategories.includes(category)) {
      setFormData({
        ...formData,
        productCategories: [...formData.productCategories, category]
      });
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setFormData({
      ...formData,
      productCategories: formData.productCategories.filter(cat => cat !== categoryToRemove)
    });
  };

  const handleProductChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProduct = () => {
    if (newProduct.productName && newProduct.basePrice) {
      setFormData({
        ...formData,
        products: [...formData.products, { ...newProduct, id: Date.now() }]
      });
      setNewProduct({
        productName: '',
        basePrice: '',
        deliveryPrice: '',
        withoutDeliveryPrice: '',
        packagingPrice: '',
        withoutPackagingPrice: '',
        b2bPrice: '',
        mrp: '',
        unit: 'kg'
      });
    }
  };

  const handleRemoveProduct = (productId) => {
    setFormData({
      ...formData,
      products: formData.products.filter(product => product.id !== productId)
    });
  };

  const handleSubmit = () => {
    if (formData.supplierName && formData.phone) {
      onSave({ ...formData, id: editSupplier?.id || Date.now() });
      resetForm();
      onClose();
    } else {
      alert('Please fill in required fields: Supplier Name and Phone');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editSupplier ? 'Edit Supplier' : 'Add New Supplier'}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Supplier Name"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              multiline
              rows={2}
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>

          {/* Product Categories */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Product Categories
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => handleAddCategory(category)}
                  color={formData.productCategories.includes(category) ? 'primary' : 'default'}
                  variant={formData.productCategories.includes(category) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
            {formData.productCategories.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {formData.productCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onDelete={() => handleRemoveCategory(category)}
                    color="primary"
                  />
                ))}
              </Box>
            )}
          </Grid>

          {/* Payment Terms */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Payment Terms"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
            >
              {paymentOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Products */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Products & Pricing
            </Typography>
          </Grid>

          {/* Add New Product Form */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Add Product
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Product Name"
                    name="productName"
                    value={newProduct.productName}
                    onChange={handleProductChange}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Base Price"
                    name="basePrice"
                    type="number"
                    value={newProduct.basePrice}
                    onChange={handleProductChange}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    select
                    label="Unit"
                    name="unit"
                    value={newProduct.unit}
                    onChange={handleProductChange}
                  >
                    <MenuItem value="kg">kg</MenuItem>
                    <MenuItem value="piece">piece</MenuItem>
                    <MenuItem value="pack">pack</MenuItem>
                    <MenuItem value="liter">liter</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="With Delivery"
                    name="deliveryPrice"
                    type="number"
                    value={newProduct.deliveryPrice}
                    onChange={handleProductChange}
                  />
                </Grid>

                <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Without Delivery"
                    name="withoutDeliveryPrice"
                    type="number"
                    value={newProduct.withoutDeliveryPrice}
                    onChange={handleProductChange}
                  />
                </Grid>

                <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="With Packaging"
                    name="packagingPrice"
                    type="number"
                    value={newProduct.packagingPrice}
                    onChange={handleProductChange}
                  />
                </Grid>

                <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Without Packaging"
                    name="withoutPackagingPrice"
                    type="number"
                    value={newProduct.withoutPackagingPrice}
                    onChange={handleProductChange}
                  />
                </Grid>

                <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="B2B Price"
                    name="b2bPrice"
                    type="number"
                    value={newProduct.b2bPrice}
                    onChange={handleProductChange}
                  />
                </Grid>

                <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="MRP"
                    name="mrp"
                    type="number"
                    value={newProduct.mrp}
                    onChange={handleProductChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddProduct}
                    disabled={!newProduct.productName || !newProduct.basePrice}
                  >
                    Add Product
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Products List */}
          {formData.products.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Added Products ({formData.products.length})
              </Typography>
              {formData.products.map((product) => (
                <Box
                  key={product.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {product.productName}
                      </Typography>
                      <Grid container spacing={1} sx={{ mt: 1 }}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">Base: </Typography>
                          <Typography variant="body2">₹{product.basePrice}/{product.unit}</Typography>
                        </Grid>
                        {product.deliveryPrice && (
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">With Delivery: </Typography>
                            <Typography variant="body2">₹{product.deliveryPrice}</Typography>
                          </Grid>
                        )}
                        {product.b2bPrice && (
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">B2B: </Typography>
                            <Typography variant="body2">₹{product.b2bPrice}</Typography>
                          </Grid>
                        )}
                        {product.mrp && (
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">MRP: </Typography>
                            <Typography variant="body2">₹{product.mrp}</Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editSupplier ? 'Update' : 'Save'} Supplier
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupplierForm;
