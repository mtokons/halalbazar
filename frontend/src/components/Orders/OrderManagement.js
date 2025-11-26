import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Restaurant as RestaurantIcon,
  Store as StoreIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({
    orderId: '',
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    orderDate: new Date().toISOString().split('T')[0],
    lineItems: [],
    profitMargin: 25
  });
  const [lineItem, setLineItem] = useState({
    type: 'in-house', // 'in-house' or 'supplier'
    itemName: '',
    quantity: 1,
    unit: 'piece',
    // In-house costs
    rawMaterials: {
      rice: 0,
      chicken: 0,
      spices: 0,
      vegetables: 0,
      oil: 0
    },
    packaging: 0,
    utilities: 0,
    labor: 0,
    otherCosts: 0,
    // Supplier item
    supplierProduct: null,
    supplierPrice: 0
  });

  const [suppliers, setSuppliers] = useState([]);
  const [inventory, setInventory] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    const savedSuppliers = localStorage.getItem('suppliers');
    const savedInventory = localStorage.getItem('inventory');
    
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
  }, []);

  // Save orders to localStorage
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [orders]);

  const calculateLineItemCost = (item) => {
    if (item.type === 'in-house') {
      const rawMaterialTotal = Object.values(item.rawMaterials).reduce((sum, val) => sum + Number(val || 0), 0);
      return rawMaterialTotal + Number(item.packaging || 0) + Number(item.utilities || 0) + 
             Number(item.labor || 0) + Number(item.otherCosts || 0);
    } else {
      return Number(item.supplierPrice || 0);
    }
  };

  const calculateOrderTotals = (order) => {
    let totalInHouseCost = 0;
    let totalSupplierCost = 0;

    order.lineItems.forEach(item => {
      const itemCost = calculateLineItemCost(item);
      const totalItemCost = itemCost * item.quantity;
      
      if (item.type === 'in-house') {
        totalInHouseCost += totalItemCost;
      } else {
        totalSupplierCost += totalItemCost;
      }
    });

    const totalCost = totalInHouseCost + totalSupplierCost;
    const profitAmount = (totalCost * order.profitMargin) / 100;
    const sellingPrice = totalCost + profitAmount;

    return {
      totalInHouseCost,
      totalSupplierCost,
      totalCost,
      profitMargin: order.profitMargin,
      profitAmount,
      sellingPrice
    };
  };

  const handleAddLineItem = () => {
    if (!lineItem.itemName) {
      alert('Please enter item name');
      return;
    }

    const newLineItem = {
      ...lineItem,
      id: Date.now(),
      unitCost: calculateLineItemCost(lineItem)
    };

    setCurrentOrder({
      ...currentOrder,
      lineItems: [...currentOrder.lineItems, newLineItem]
    });

    // Reset line item form
    setLineItem({
      type: 'in-house',
      itemName: '',
      quantity: 1,
      unit: 'piece',
      rawMaterials: { rice: 0, chicken: 0, spices: 0, vegetables: 0, oil: 0 },
      packaging: 0,
      utilities: 0,
      labor: 0,
      otherCosts: 0,
      supplierProduct: null,
      supplierPrice: 0
    });
  };

  const handleRemoveLineItem = (itemId) => {
    setCurrentOrder({
      ...currentOrder,
      lineItems: currentOrder.lineItems.filter(item => item.id !== itemId)
    });
  };

  const handleSaveOrder = () => {
    if (!currentOrder.customerName || currentOrder.lineItems.length === 0) {
      alert('Please fill customer name and add at least one line item');
      return;
    }

    const orderTotals = calculateOrderTotals(currentOrder);
    const newOrder = {
      ...currentOrder,
      id: Date.now(),
      orderId: `ORD-${Date.now()}`,
      ...orderTotals,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setOrders([...orders, newOrder]);
    setOpenOrderDialog(false);
    resetOrder();
  };

  const resetOrder = () => {
    setCurrentOrder({
      orderId: '',
      customerName: '',
      customerPhone: '',
      deliveryAddress: '',
      orderDate: new Date().toISOString().split('T')[0],
      lineItems: [],
      profitMargin: 25
    });
  };

  const handleSupplierProductChange = (productId) => {
    const selectedSupplier = suppliers.find(s => 
      s.products.some(p => p.id === productId)
    );
    
    if (selectedSupplier) {
      const product = selectedSupplier.products.find(p => p.id === productId);
      setLineItem({
        ...lineItem,
        supplierProduct: product,
        supplierPrice: product.basePrice,
        itemName: product.productName,
        unit: product.unit
      });
    }
  };

  const getSupplierProducts = () => {
    const products = [];
    suppliers.forEach(supplier => {
      if (supplier.products) {
        supplier.products.forEach(product => {
          products.push({
            ...product,
            supplierName: supplier.supplierName
          });
        });
      }
    });
    return products;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              <CartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Order Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create and manage orders with mixed source items
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenOrderDialog(true)}
            size="large"
          >
            Create New Order
          </Button>
        </Box>

        {/* Orders List */}
        <Grid container spacing={2}>
          {orders.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No orders yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create your first order to get started
                </Typography>
              </Box>
            </Grid>
          ) : (
            orders.map((order) => (
              <Grid item xs={12} md={6} key={order.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="h6">{order.orderId}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.customerName}
                        </Typography>
                      </Box>
                      <Chip 
                        label={order.status} 
                        color={order.status === 'Completed' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Items</Typography>
                        <Typography variant="body2">{order.lineItems.length} items</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Date</Typography>
                        <Typography variant="body2">{order.orderDate}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Total Cost</Typography>
                        <Typography variant="body2">₹{order.totalCost.toFixed(2)}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Selling Price</Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          ₹{order.sellingPrice.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Profit</Typography>
                        <Typography variant="body2" color="success.main" fontWeight="bold">
                          ₹{order.profitAmount.toFixed(2)} ({order.profitMargin}%)
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Create Order Dialog */}
        <Dialog open={openOrderDialog} onClose={() => setOpenOrderDialog(false)} maxWidth="lg" fullWidth>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              {/* Customer Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Customer Information</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Customer Name"
                  value={currentOrder.customerName}
                  onChange={(e) => setCurrentOrder({...currentOrder, customerName: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={currentOrder.customerPhone}
                  onChange={(e) => setCurrentOrder({...currentOrder, customerPhone: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Order Date"
                  type="date"
                  value={currentOrder.orderDate}
                  onChange={(e) => setCurrentOrder({...currentOrder, orderDate: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Delivery Address"
                  multiline
                  rows={2}
                  value={currentOrder.deliveryAddress}
                  onChange={(e) => setCurrentOrder({...currentOrder, deliveryAddress: e.target.value})}
                />
              </Grid>

              {/* Line Items Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Add Line Items</Typography>
              </Grid>

              {/* Item Type Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Item Type</InputLabel>
                  <Select
                    value={lineItem.type}
                    label="Item Type"
                    onChange={(e) => setLineItem({...lineItem, type: e.target.value})}
                  >
                    <MenuItem value="in-house">
                      <RestaurantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      In-House Menu Item
                    </MenuItem>
                    <MenuItem value="supplier">
                      <StoreIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Supplier Product
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {lineItem.type === 'in-house' ? (
                <>
                  {/* In-House Item Form */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Item Name"
                      value={lineItem.itemName}
                      onChange={(e) => setLineItem({...lineItem, itemName: e.target.value})}
                      placeholder="e.g., Chicken Biryani"
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={lineItem.quantity}
                      onChange={(e) => setLineItem({...lineItem, quantity: Number(e.target.value)})}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      select
                      label="Unit"
                      value={lineItem.unit}
                      onChange={(e) => setLineItem({...lineItem, unit: e.target.value})}
                    >
                      <MenuItem value="piece">Piece</MenuItem>
                      <MenuItem value="plate">Plate</MenuItem>
                      <MenuItem value="kg">KG</MenuItem>
                      <MenuItem value="pack">Pack</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                      Raw Material Costs (per unit)
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Rice"
                      type="number"
                      value={lineItem.rawMaterials.rice}
                      onChange={(e) => setLineItem({
                        ...lineItem, 
                        rawMaterials: {...lineItem.rawMaterials, rice: Number(e.target.value)}
                      })}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Chicken/Meat"
                      type="number"
                      value={lineItem.rawMaterials.chicken}
                      onChange={(e) => setLineItem({
                        ...lineItem,
                        rawMaterials: {...lineItem.rawMaterials, chicken: Number(e.target.value)}
                      })}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Spices"
                      type="number"
                      value={lineItem.rawMaterials.spices}
                      onChange={(e) => setLineItem({
                        ...lineItem,
                        rawMaterials: {...lineItem.rawMaterials, spices: Number(e.target.value)}
                      })}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Vegetables"
                      type="number"
                      value={lineItem.rawMaterials.vegetables}
                      onChange={(e) => setLineItem({
                        ...lineItem,
                        rawMaterials: {...lineItem.rawMaterials, vegetables: Number(e.target.value)}
                      })}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Oil"
                      type="number"
                      value={lineItem.rawMaterials.oil}
                      onChange={(e) => setLineItem({
                        ...lineItem,
                        rawMaterials: {...lineItem.rawMaterials, oil: Number(e.target.value)}
                      })}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                    />
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Packaging"
                      type="number"
                      value={lineItem.packaging}
                      onChange={(e) => setLineItem({...lineItem, packaging: Number(e.target.value)})}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Utilities"
                      type="number"
                      value={lineItem.utilities}
                      onChange={(e) => setLineItem({...lineItem, utilities: Number(e.target.value)})}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Labor Cost"
                      type="number"
                      value={lineItem.labor}
                      onChange={(e) => setLineItem({...lineItem, labor: Number(e.target.value)})}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Other Costs"
                      type="number"
                      value={lineItem.otherCosts}
                      onChange={(e) => setLineItem({...lineItem, otherCosts: Number(e.target.value)})}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                    />
                  </Grid>
                </>
              ) : (
                <>
                  {/* Supplier Product Form */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Select Supplier Product"
                      value={lineItem.supplierProduct?.id || ''}
                      onChange={(e) => handleSupplierProductChange(e.target.value)}
                    >
                      {getSupplierProducts().length === 0 ? (
                        <MenuItem value="" disabled>
                          No supplier products available
                        </MenuItem>
                      ) : (
                        getSupplierProducts().map((product) => (
                          <MenuItem key={product.id} value={product.id}>
                            {product.productName} - {product.supplierName} (₹{product.basePrice}/{product.unit})
                          </MenuItem>
                        ))
                      )}
                    </TextField>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={lineItem.quantity}
                      onChange={(e) => setLineItem({...lineItem, quantity: Number(e.target.value)})}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      label="Unit Price"
                      type="number"
                      value={lineItem.supplierPrice}
                      onChange={(e) => setLineItem({...lineItem, supplierPrice: Number(e.target.value)})}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                    />
                  </Grid>
                </>
              )}

              {/* Unit Cost Display */}
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="subtitle2">
                    Unit Cost: ₹{calculateLineItemCost(lineItem).toFixed(2)} × {lineItem.quantity} = 
                    <strong> ₹{(calculateLineItemCost(lineItem) * lineItem.quantity).toFixed(2)}</strong>
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddLineItem}
                  fullWidth
                >
                  Add Line Item
                </Button>
              </Grid>

              {/* Added Line Items */}
              {currentOrder.lineItems.length > 0 && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Order Items ({currentOrder.lineItems.length})
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell align="right">Qty</TableCell>
                          <TableCell align="right">Unit Cost</TableCell>
                          <TableCell align="right">Total</TableCell>
                          <TableCell align="center">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentOrder.lineItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell>
                              <Chip 
                                label={item.type === 'in-house' ? 'In-House' : 'Supplier'}
                                size="small"
                                color={item.type === 'in-house' ? 'primary' : 'secondary'}
                              />
                            </TableCell>
                            <TableCell align="right">{item.quantity} {item.unit}</TableCell>
                            <TableCell align="right">₹{item.unitCost.toFixed(2)}</TableCell>
                            <TableCell align="right">₹{(item.unitCost * item.quantity).toFixed(2)}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveLineItem(item.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                </>
              )}

              {/* Order Summary */}
              {currentOrder.lineItems.length > 0 && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>Order Summary</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Profit Margin (%)"
                      type="number"
                      value={currentOrder.profitMargin}
                      onChange={(e) => setCurrentOrder({...currentOrder, profitMargin: Number(e.target.value)})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Card sx={{ bgcolor: 'background.default' }}>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">In-House Cost:</Typography>
                          </Grid>
                          <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">
                              ₹{calculateOrderTotals(currentOrder).totalInHouseCost.toFixed(2)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Supplier Cost:</Typography>
                          </Grid>
                          <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">
                              ₹{calculateOrderTotals(currentOrder).totalSupplierCost.toFixed(2)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}><Divider /></Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">Total Cost:</Typography>
                          </Grid>
                          <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body1" fontWeight="bold">
                              ₹{calculateOrderTotals(currentOrder).totalCost.toFixed(2)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="success.main">
                              Profit ({currentOrder.profitMargin}%):
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" color="success.main">
                              ₹{calculateOrderTotals(currentOrder).profitAmount.toFixed(2)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}><Divider /></Grid>
                          <Grid item xs={6}>
                            <Typography variant="h6" color="primary">Selling Price:</Typography>
                          </Grid>
                          <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              ₹{calculateOrderTotals(currentOrder).sellingPrice.toFixed(2)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenOrderDialog(false)}>Cancel</Button>
            <Button
              onClick={handleSaveOrder}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={!currentOrder.customerName || currentOrder.lineItems.length === 0}
            >
              Save Order
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default OrderManagement;
