import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Divider,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Calculate as CalculateIcon,
  Save as SaveIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import { customerService, supplierService, menuService, orderService } from '../../services/orderService';

const OrderManagement = () => {
  // State Management
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Dialog States
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const [openCustomerListDialog, setOpenCustomerListDialog] = useState(false);
  const [openMenuItemDialog, setOpenMenuItemDialog] = useState(false);
  const [openCalculatorDialog, setOpenCalculatorDialog] = useState(false);
  const [selectedCustomerForView, setSelectedCustomerForView] = useState(null);
  
  // Current Order State
  const [currentOrder, setCurrentOrder] = useState({
    customerId: '',
    customerName: '',
    phone: '',
    deliveryAddress: '',
    orderDate: new Date().toISOString().split('T')[0],
    lineItems: [],
    status: 'Open'
  });
  
  // New Customer Form
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  
  // Calculator State
  const [calculator, setCalculator] = useState({
    itemName: '',
    rawMaterials: [{ name: '', cost: '' }],
    utilities: '',
    packaging: '',
    labor: '',
    otherCosts: '',
    orderQty: '',
    profitMargin: '',
    calculatedPrice: null
  });
  
  // Current Line Item
  const [currentLineItem, setCurrentLineItem] = useState({
    type: 'supplier', // 'supplier' or 'menu'
    itemId: '',
    itemName: '',
    quantity: '',
    unit: 'piece',
    sellPrice: '',
    supplierId: '',
    supplierPrice: '',
    // For internal tracking
    internalCost: null
  });

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, suppliersData, menuData, ordersData] = await Promise.all([
          customerService.getAll(),
          supplierService.getAll(),
          menuService.getAll(),
          orderService.getAll()
        ]);
        
        setCustomers(customersData);
        setSuppliers(suppliersData);
        setMenuItems(menuData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load data from server');
      }
    };
    
    fetchData();
  }, []);

  // Generate Unique IDs
  const generateId = (prefix) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Add Customer
  const handleAddCustomer = async () => {
    try {
      const customer = await customerService.create(newCustomer);
      
      const updatedCustomers = [...customers, customer];
      setCustomers(updatedCustomers);
      
      // Set as current order customer
      setCurrentOrder({
        ...currentOrder,
        customerId: customer.customerId,
        customerName: customer.name,
        phone: customer.phone,
        deliveryAddress: customer.address
      });
      
      setNewCustomer({ name: '', phone: '', email: '', address: '' });
      setOpenCustomerDialog(false);
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer');
    }
  };

  // Calculate Menu Item Price
  const handleCalculatePrice = () => {
    const rawMaterialTotal = calculator.rawMaterials.reduce((sum, item) => 
      sum + (parseFloat(item.cost) || 0), 0
    );
    
    const totalCost = rawMaterialTotal + 
      (parseFloat(calculator.utilities) || 0) +
      (parseFloat(calculator.packaging) || 0) +
      (parseFloat(calculator.labor) || 0) +
      (parseFloat(calculator.otherCosts) || 0);
    
    const orderQty = parseFloat(calculator.orderQty) || 1;
    const unitCost = totalCost / orderQty;
    
    const profitMargin = parseFloat(calculator.profitMargin) || 0;
    const sellPrice = unitCost * (1 + profitMargin / 100);
    
    setCalculator({
      ...calculator,
      calculatedPrice: {
        totalCost,
        unitCost,
        sellPrice,
        rawMaterialTotal
      }
    });
  };

  // Add Menu Item from Calculator
  const handleAddMenuItemFromCalculator = async () => {
    try {
      const menuItemData = {
        name: calculator.itemName,
        rawMaterials: calculator.rawMaterials.filter(rm => rm.name && rm.cost),
        utilities: parseFloat(calculator.utilities) || 0,
        packaging: parseFloat(calculator.packaging) || 0,
        labor: parseFloat(calculator.labor) || 0,
        otherCosts: parseFloat(calculator.otherCosts) || 0,
        standardQty: parseFloat(calculator.orderQty) || 1,
        unitCost: calculator.calculatedPrice?.unitCost || 0,
        suggestedPrice: calculator.calculatedPrice?.sellPrice || 0
      };
      
      const menuItem = await menuService.create(menuItemData);
      
      const updatedMenuItems = [...menuItems, menuItem];
      setMenuItems(updatedMenuItems);
      
      // Reset calculator
      setCalculator({
        itemName: '',
        rawMaterials: [{ name: '', cost: '' }],
        utilities: '',
        packaging: '',
        labor: '',
        otherCosts: '',
        orderQty: '',
        profitMargin: '',
        calculatedPrice: null
      });
      
      setOpenCalculatorDialog(false);
      alert('Menu item added successfully!');
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('Failed to add menu item');
    }
  };

  // Add Line Item to Order
  const handleAddLineItem = () => {
    if (!currentLineItem.itemName || !currentLineItem.quantity || !currentLineItem.sellPrice) {
      alert('Please fill in all required fields');
      return;
    }
    
    const lineItem = {
      id: generateId('LINE'),
      ...currentLineItem,
      quantity: parseFloat(currentLineItem.quantity),
      sellPrice: parseFloat(currentLineItem.sellPrice),
      totalSellPrice: parseFloat(currentLineItem.quantity) * parseFloat(currentLineItem.sellPrice)
    };
    
    setCurrentOrder({
      ...currentOrder,
      lineItems: [...currentOrder.lineItems, lineItem]
    });
    
    // Reset line item form
    setCurrentLineItem({
      type: 'supplier',
      itemId: '',
      itemName: '',
      quantity: '',
      unit: 'piece',
      sellPrice: '',
      supplierId: '',
      supplierPrice: '',
      internalCost: null
    });
  };

  // Remove Line Item
  const handleRemoveLineItem = (lineItemId) => {
    setCurrentOrder({
      ...currentOrder,
      lineItems: currentOrder.lineItems.filter(item => item.id !== lineItemId)
    });
  };

  // Calculate Order Totals
  const calculateOrderTotals = () => {
    const totalSellPrice = currentOrder.lineItems.reduce((sum, item) => 
      sum + item.totalSellPrice, 0
    );
    
    const totalInternalCost = currentOrder.lineItems.reduce((sum, item) => {
      if (item.type === 'menu' && item.internalCost) {
        return sum + (item.internalCost.unitCost * item.quantity);
      }
      return sum;
    }, 0);
    
    const totalSupplierCost = currentOrder.lineItems.reduce((sum, item) => {
      if (item.type === 'supplier' && item.supplierPrice) {
        return sum + (parseFloat(item.supplierPrice) * parseFloat(item.quantity));
      }
      return sum;
    }, 0);
    
    const totalCost = totalInternalCost + totalSupplierCost;
    const profit = totalSellPrice - totalCost;
    const profitMargin = totalCost > 0 ? ((profit / totalCost) * 100) : 0;
    
    return {
      totalSellPrice,
      totalInternalCost,
      totalSupplierCost,
      totalCost,
      profit,
      profitMargin
    };
  };

  // Place Order
  const handlePlaceOrder = async () => {
    if (!currentOrder.customerId || currentOrder.lineItems.length === 0) {
      alert('Please select a customer and add at least one line item');
      return;
    }
    
    try {
      const totals = calculateOrderTotals();
      
      const orderData = {
        customerId: currentOrder.customerId,
        customerName: currentOrder.customerName,
        phone: currentOrder.phone,
        deliveryAddress: currentOrder.deliveryAddress,
        orderDate: currentOrder.orderDate,
        lineItems: currentOrder.lineItems,
        totalSellPrice: totals.totalSellPrice,
        totalCost: totals.totalCost,
        profit: totals.profit,
        profitMargin: totals.profitMargin,
        status: 'Pending',
        subOrders: {
          internal: currentOrder.lineItems
            .filter(item => item.type === 'menu')
            .map(item => ({
              lineItemId: item.id,
              itemName: item.itemName,
              quantity: item.quantity,
              rawMaterials: item.internalCost?.rawMaterials || [],
              utilities: item.internalCost?.utilities || 0,
              packaging: item.internalCost?.packaging || 0,
              labor: item.internalCost?.labor || 0,
              unitCost: item.internalCost?.unitCost || 0,
              totalCost: (item.internalCost?.unitCost || 0) * item.quantity
            })),
          supplier: currentOrder.lineItems
            .filter(item => item.type === 'supplier')
            .map(item => ({
              lineItemId: item.id,
              supplierId: item.supplierId,
              itemName: item.itemName,
              quantity: item.quantity,
              unitPrice: item.supplierPrice,
              totalCost: parseFloat(item.supplierPrice) * parseFloat(item.quantity)
            }))
        }
      };
      
      const order = await orderService.create(orderData);
      
      const updatedOrders = [...orders, order];
      setOrders(updatedOrders);
      
      // Reset form
      setCurrentOrder({
        customerId: '',
        customerName: '',
        phone: '',
        deliveryAddress: '',
        orderDate: new Date().toISOString().split('T')[0],
        lineItems: [],
        status: 'Pending'
      });
      
      alert(`Order placed successfully! Order ID: ${order.orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  // Handle Supplier Selection
  const handleSupplierSelection = (e) => {
    const supplierId = e.target.value;
    setCurrentLineItem({
      ...currentLineItem,
      supplierId: supplierId,
      itemId: '',
      itemName: '',
      supplierPrice: '',
      sellPrice: ''
    });
  };

  // Handle Supplier Product Selection
  const handleSupplierProductSelection = (e) => {
    const productId = e.target.value;
    const supplier = suppliers.find(s => s.id === currentLineItem.supplierId);
    const product = supplier?.products?.find(p => p.id === productId);
    
    if (product) {
      setCurrentLineItem({
        ...currentLineItem,
        itemId: productId,
        itemName: product.productName,
        supplierPrice: product.basePrice || '',
        unit: product.unit || 'piece',
        sellPrice: (parseFloat(product.basePrice || 0) * 1.2).toFixed(2) // 20% markup default
      });
    }
  };

  // Handle Menu Item Selection
  const handleMenuItemSelection = (e) => {
    const menuItemId = e.target.value;
    const menuItem = menuItems.find(m => m.id === menuItemId);
    if (menuItem) {
      setCurrentLineItem({
        ...currentLineItem,
        itemId: menuItem.id,
        itemName: menuItem.name,
        sellPrice: menuItem.suggestedPrice.toFixed(2),
        unit: 'piece',
        internalCost: {
          rawMaterials: menuItem.rawMaterials,
          utilities: menuItem.utilities,
          packaging: menuItem.packaging,
          labor: menuItem.labor,
          unitCost: menuItem.unitCost
        }
      });
    }
  };

  // Get customer order history
  const getCustomerOrders = (customerId) => {
    return orders.filter(order => order.customerId === customerId);
  };

  // Delete customer
  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer? This cannot be undone.')) {
      try {
        await customerService.delete(customerId);
        
        const updatedCustomers = customers.filter(c => c.customerId !== customerId);
        setCustomers(updatedCustomers);
        
        if (selectedCustomerForView?.customerId === customerId) {
          setSelectedCustomerForView(null);
        }
        
        alert('Customer deleted successfully');
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer');
      }
    }
  };

  const totals = calculateOrderTotals();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CartIcon /> Order Management
        </Typography>

        {/* Customer Information */}
        <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Customer Information</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  onClick={() => setOpenCustomerListDialog(true)}
                >
                  View Customers
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenCustomerDialog(true)}
                >
                  Add Customer
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Select Customer</InputLabel>
                  <Select
                    value={currentOrder.customerId}
                    onChange={(e) => {
                      const customer = customers.find(c => c.id === e.target.value);
                      if (customer) {
                        setCurrentOrder({
                          ...currentOrder,
                          customerId: customer.id,
                          customerName: customer.name,
                          phone: customer.phone,
                          deliveryAddress: customer.address
                        });
                      }
                    }}
                  >
                    {customers.map(customer => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.name} ({customer.id})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={currentOrder.customerName}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={currentOrder.phone}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  type="date"
                  label="Order Date"
                  value={currentOrder.orderDate}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, orderDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Delivery Address"
                  value={currentOrder.deliveryAddress}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, deliveryAddress: e.target.value })}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Add Line Items */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Add Line Items</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<CalculateIcon />}
                  onClick={() => setOpenCalculatorDialog(true)}
                >
                  Price Calculator
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setOpenMenuItemDialog(true)}
                >
                  Manage Menu Items
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Item Type</InputLabel>
                  <Select
                    value={currentLineItem.type}
                    onChange={(e) => setCurrentLineItem({ ...currentLineItem, type: e.target.value, itemId: '', itemName: '' })}
                  >
                    <MenuItem value="supplier">Supplier Item</MenuItem>
                    <MenuItem value="menu">Menu Item</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {currentLineItem.type === 'supplier' ? (
                <>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <InputLabel>Select Supplier</InputLabel>
                      <Select
                        value={currentLineItem.supplierId}
                        onChange={handleSupplierSelection}
                      >
                        {suppliers.map(supplier => (
                          <MenuItem key={supplier.id} value={supplier.id}>
                            {supplier.supplierName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth disabled={!currentLineItem.supplierId}>
                      <InputLabel>Select Item</InputLabel>
                      <Select
                        value={currentLineItem.itemId}
                        onChange={handleSupplierProductSelection}
                      >
                        {currentLineItem.supplierId && 
                          suppliers
                            .find(s => s.id === currentLineItem.supplierId)
                            ?.products?.map(product => (
                              <MenuItem key={product.id} value={product.id}>
                                {product.productName} (€{product.basePrice})
                              </MenuItem>
                            ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Select Menu Item</InputLabel>
                    <Select
                      value={currentLineItem.itemId}
                      onChange={handleMenuItemSelection}
                    >
                      {menuItems.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name} (€{item.suggestedPrice.toFixed(2)})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Item Name"
                  value={currentLineItem.itemName}
                  onChange={(e) => setCurrentLineItem({ ...currentLineItem, itemName: e.target.value })}
                />
              </Grid>

              <Grid item xs={6} md={1}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity"
                  value={currentLineItem.quantity}
                  onChange={(e) => setCurrentLineItem({ ...currentLineItem, quantity: e.target.value })}
                  inputProps={{ step: "0.01", min: "0" }}
                />
              </Grid>

              <Grid item xs={6} md={1}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={currentLineItem.unit}
                    onChange={(e) => setCurrentLineItem({ ...currentLineItem, unit: e.target.value })}
                  >
                    <MenuItem value="piece">Piece</MenuItem>
                    <MenuItem value="kg">kg</MenuItem>
                    <MenuItem value="liter">Liter</MenuItem>
                    <MenuItem value="pack">Pack</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={8} md={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Sell Price (€)"
                  value={currentLineItem.sellPrice}
                  onChange={(e) => setCurrentLineItem({ ...currentLineItem, sellPrice: e.target.value })}
                  inputProps={{ step: "0.01", min: "0" }}
                />
              </Grid>

              <Grid item xs={4} md={1}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleAddLineItem}
                  startIcon={<AddIcon />}
                  sx={{ height: '56px' }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>

            {/* Line Items Table */}
            {currentOrder.lineItems.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Order Items:</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Item Name</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell>Unit</TableCell>
                      <TableCell align="right">Sell Price (€)</TableCell>
                      <TableCell align="right">Total (€)</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentOrder.lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Chip 
                            label={item.type === 'supplier' ? 'Supplier' : 'Menu'} 
                            size="small"
                            color={item.type === 'supplier' ? 'primary' : 'secondary'}
                          />
                        </TableCell>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell align="right">€{item.sellPrice.toFixed(2)}</TableCell>
                        <TableCell align="right">€{item.totalSellPrice.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" color="error" onClick={() => handleRemoveLineItem(item.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        {currentOrder.lineItems.length > 0 && (
          <Card sx={{ mb: 3, bgcolor: 'info.lighter' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={2}>
                  <Typography variant="body2" color="text.secondary">Total Sell Price:</Typography>
                  <Typography variant="h6" color="success.main">€{totals.totalSellPrice.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Typography variant="body2" color="text.secondary">Internal Cost:</Typography>
                  <Typography variant="h6">€{totals.totalInternalCost.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Typography variant="body2" color="text.secondary">Supplier Cost:</Typography>
                  <Typography variant="h6">€{totals.totalSupplierCost.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Typography variant="body2" color="text.secondary">Total Cost:</Typography>
                  <Typography variant="h6">€{totals.totalCost.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Typography variant="body2" color="text.secondary">Profit:</Typography>
                  <Typography variant="h6" color={totals.profit >= 0 ? 'success.main' : 'error.main'}>
                    €{totals.profit.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Typography variant="body2" color="text.secondary">Profit Margin:</Typography>
                  <Typography variant="h6">{totals.profitMargin.toFixed(2)}%</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            onClick={() => setCurrentOrder({
              customerId: '',
              customerName: '',
              phone: '',
              deliveryAddress: '',
              orderDate: new Date().toISOString().split('T')[0],
              lineItems: [],
              status: 'Pending'
            })}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />}
            onClick={handlePlaceOrder}
            disabled={!currentOrder.customerId || currentOrder.lineItems.length === 0}
          >
            Place Order
          </Button>
        </Box>

        {/* Orders List */}
        {orders.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>All Orders ({orders.length})</Typography>
            {orders.slice().reverse().map(order => (
              <Card key={order.orderId || order.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6">{order.orderId || order.id}</Typography>
                      <Typography variant="body2">Customer: {order.customerName}</Typography>
                      <Typography variant="body2">Items: {order.lineItems?.length || 0}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(order.placedAt).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">Total Sale:</Typography>
                      <Typography variant="h6" color="success.main">€{order.totalSellPrice.toFixed(2)}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Profit: €{order.profit.toFixed(2)} ({order.profitMargin.toFixed(2)}%)
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ textAlign: 'right' }}>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={order.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            try {
                              await orderService.updateStatus(order.orderId, newStatus);
                              const updatedOrders = orders.map(o => {
                                if (o.orderId === order.orderId) {
                                  return { ...o, status: newStatus, updatedAt: new Date() };
                                }
                                return o;
                              });
                              setOrders(updatedOrders);
                            } catch (error) {
                              console.error('Error updating status:', error);
                              alert('Failed to update order status');
                            }
                          }}
                        >
                          <MenuItem value="Pending">⏳ Pending</MenuItem>
                          <MenuItem value="Processing">🔵 Processing</MenuItem>
                          <MenuItem value="Ready">📦 Ready</MenuItem>
                          <MenuItem value="In Delivery">🚚 In Delivery</MenuItem>
                          <MenuItem value="Delivered">🟢 Delivered</MenuItem>
                          <MenuItem value="Completed">✅ Completed</MenuItem>
                          <MenuItem value="Cancelled">🔴 Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                      <Box sx={{ mt: 1 }}>
                        <Chip 
                          label={order.profit >= 0 ? 'Profit' : 'Loss'} 
                          size="small" 
                          color={order.profit >= 0 ? 'success' : 'error'}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>

      {/* Customer List Dialog */}
      <Dialog open={openCustomerListDialog} onClose={() => setOpenCustomerListDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Customer Management</DialogTitle>
        <DialogContent>
          {customers.length === 0 ? (
            <Alert severity="info">No customers yet. Add your first customer to get started.</Alert>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} md={selectedCustomerForView ? 6 : 12}>
                <Typography variant="subtitle1" gutterBottom>All Customers ({customers.length})</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Orders</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.map((customer) => {
                      const customerOrders = getCustomerOrders(customer.customerId || customer.id);
                      return (
                        <TableRow 
                          key={customer.customerId || customer.id}
                          sx={{ 
                            bgcolor: selectedCustomerForView?.customerId === (customer.customerId || customer.id) ? 'action.selected' : 'inherit',
                            cursor: 'pointer'
                          }}
                          onClick={() => setSelectedCustomerForView(customer)}
                        >
                          <TableCell>{customer.customerId || customer.id}</TableCell>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell>
                            <Chip label={customerOrders.length} size="small" color="primary" />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCustomer(customer.customerId || customer.id);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Grid>
              
              {selectedCustomerForView && (
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Customer Profile</Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">Customer ID:</Typography>
                          <Typography variant="body1">{selectedCustomerForView.id}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">Name:</Typography>
                          <Typography variant="body1">{selectedCustomerForView.name}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">Phone:</Typography>
                          <Typography variant="body1">{selectedCustomerForView.phone}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">Email:</Typography>
                          <Typography variant="body1">{selectedCustomerForView.email || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">Address:</Typography>
                          <Typography variant="body1">{selectedCustomerForView.address || 'N/A'}</Typography>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="h6" gutterBottom>Order History</Typography>
                      {getCustomerOrders(selectedCustomerForView.id).length === 0 ? (
                        <Alert severity="info">No orders yet</Alert>
                      ) : (
                        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                          {getCustomerOrders(selectedCustomerForView.id).map(order => (
                            <Card key={order.id} sx={{ mb: 1, bgcolor: 'grey.50' }}>
                              <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                                <Grid container spacing={1}>
                                  <Grid item xs={12}>
                                    <Typography variant="body2" fontWeight="bold">{order.id}</Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                      {new Date(order.placedAt).toLocaleDateString()}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                    <Typography variant="body2" color="success.main" fontWeight="bold">
                                      €{order.totalSellPrice.toFixed(2)}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography variant="caption">Items: {order.lineItems.length}</Typography>
                                  </Grid>
                                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                    <Chip label={order.status} size="small" />
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          ))}
                        </Box>
                      )}

                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button 
                          variant="outlined" 
                          color="error"
                          fullWidth
                          onClick={() => handleDeleteCustomer(selectedCustomerForView.id)}
                        >
                          Delete Customer
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenCustomerListDialog(false);
            setSelectedCustomerForView(null);
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Customer Dialog */}
      <Dialog open={openCustomerDialog} onClose={() => setOpenCustomerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Customer Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Phone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCustomerDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddCustomer}
            disabled={!newCustomer.name || !newCustomer.phone}
          >
            Add Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Price Calculator Dialog */}
      <Dialog open={openCalculatorDialog} onClose={() => setOpenCalculatorDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Price Calculator & Menu Item Creator</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Item/Menu Name"
                value={calculator.itemName}
                onChange={(e) => setCalculator({ ...calculator, itemName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Raw Materials</Typography>
              {calculator.rawMaterials.map((rm, index) => (
                <Grid container spacing={1} key={index} sx={{ mb: 1 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Material Name"
                      value={rm.name}
                      onChange={(e) => {
                        const updated = [...calculator.rawMaterials];
                        updated[index].name = e.target.value;
                        setCalculator({ ...calculator, rawMaterials: updated });
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Cost (€)"
                      value={rm.cost}
                      onChange={(e) => {
                        const updated = [...calculator.rawMaterials];
                        updated[index].cost = e.target.value;
                        setCalculator({ ...calculator, rawMaterials: updated });
                      }}
                      inputProps={{ step: "0.01", min: "0" }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    {index === calculator.rawMaterials.length - 1 && (
                      <IconButton 
                        size="small" 
                        onClick={() => setCalculator({ 
                          ...calculator, 
                          rawMaterials: [...calculator.rawMaterials, { name: '', cost: '' }] 
                        })}
                      >
                        <AddIcon />
                      </IconButton>
                    )}
                    {calculator.rawMaterials.length > 1 && (
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => setCalculator({ 
                          ...calculator, 
                          rawMaterials: calculator.rawMaterials.filter((_, i) => i !== index) 
                        })}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Utilities (€)"
                value={calculator.utilities}
                onChange={(e) => setCalculator({ ...calculator, utilities: e.target.value })}
                inputProps={{ step: "0.01", min: "0" }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Packaging (€)"
                value={calculator.packaging}
                onChange={(e) => setCalculator({ ...calculator, packaging: e.target.value })}
                inputProps={{ step: "0.01", min: "0" }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Labor (€)"
                value={calculator.labor}
                onChange={(e) => setCalculator({ ...calculator, labor: e.target.value })}
                inputProps={{ step: "0.01", min: "0" }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Other Costs (€)"
                value={calculator.otherCosts}
                onChange={(e) => setCalculator({ ...calculator, otherCosts: e.target.value })}
                inputProps={{ step: "0.01", min: "0" }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Order Quantity"
                value={calculator.orderQty}
                onChange={(e) => setCalculator({ ...calculator, orderQty: e.target.value })}
                inputProps={{ step: "0.01", min: "0.01" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Profit Margin (%)"
                value={calculator.profitMargin}
                onChange={(e) => setCalculator({ ...calculator, profitMargin: e.target.value })}
                inputProps={{ step: "0.01", min: "0" }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button 
                fullWidth 
                variant="contained" 
                startIcon={<CalculateIcon />}
                onClick={handleCalculatePrice}
              >
                Calculate Price
              </Button>
            </Grid>

            {calculator.calculatedPrice && (
              <Grid item xs={12}>
                <Alert severity="success">
                  <Typography variant="body1"><strong>Total Cost:</strong> €{calculator.calculatedPrice.totalCost.toFixed(2)}</Typography>
                  <Typography variant="body1"><strong>Unit Cost:</strong> €{calculator.calculatedPrice.unitCost.toFixed(2)}</Typography>
                  <Typography variant="body1"><strong>Suggested Sell Price:</strong> €{calculator.calculatedPrice.sellPrice.toFixed(2)}</Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCalculatorDialog(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={handleAddMenuItemFromCalculator}
            disabled={!calculator.itemName || !calculator.calculatedPrice}
          >
            Add to Menu Items
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu Items Dialog */}
      <Dialog open={openMenuItemDialog} onClose={() => setOpenMenuItemDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Menu Items</DialogTitle>
        <DialogContent>
          {menuItems.length === 0 ? (
            <Alert severity="info">No menu items yet. Use the Price Calculator to create menu items.</Alert>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Unit Cost (€)</TableCell>
                  <TableCell align="right">Suggested Price (€)</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">€{item.unitCost.toFixed(2)}</TableCell>
                    <TableCell align="right">€{item.suggestedPrice.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="error" onClick={async () => {
                        try {
                          await menuService.delete(item.menuId || item.id);
                          const updated = menuItems.filter(m => (m.menuId || m.id) !== (item.menuId || item.id));
                          setMenuItems(updated);
                        } catch (error) {
                          console.error('Error deleting menu item:', error);
                          alert('Failed to delete menu item');
                        }
                      }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMenuItemDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderManagement;
