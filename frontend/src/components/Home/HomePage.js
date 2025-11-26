import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Inventory as InventoryIcon,
  Store as StoreIcon,
  Calculate as CalculateIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  HourglassEmpty as PendingIcon
} from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    const savedInventory = localStorage.getItem('inventory');
    const savedSuppliers = localStorage.getItem('suppliers');

    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
    if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers));
  }, []);

  const activeOrders = orders.filter(order => order.status !== 'Completed');
  const completedOrders = orders.filter(order => order.status === 'Completed');
  const lowStockItems = inventory.filter(item => item.quantity <= item.reorderLevel);
  const outOfStockItems = inventory.filter(item => item.quantity === 0);

  const getOrderProgress = (order) => {
    switch (order.status) {
      case 'Pending': return 25;
      case 'In Progress': return 50;
      case 'Ready': return 75;
      case 'Completed': return 100;
      default: return 0;
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckIcon color="success" />;
      case 'In Progress': return <PendingIcon color="info" />;
      default: return <PendingIcon color="warning" />;
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Ready': return 'primary';
      default: return 'warning';
    }
  };

  const checkMissingItems = (order) => {
    const missing = [];
    
    if (order.lineItems) {
      order.lineItems.forEach(item => {
        if (item.type === 'in-house') {
          // Check raw materials in inventory
          Object.keys(item.rawMaterials).forEach(material => {
            const inventoryItem = inventory.find(inv => 
              inv.itemName.toLowerCase().includes(material.toLowerCase())
            );
            if (inventoryItem && inventoryItem.quantity < (item.quantity * 0.5)) {
              missing.push(`${inventoryItem.itemName} (${inventoryItem.quantity} ${inventoryItem.unit})`);
            }
          });
        }
      });
    }
    
    return missing;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Logo Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Box
            component="div"
            sx={{
              width: 200,
              height: 200,
              margin: '0 auto',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a7b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              border: '4px solid #d4a574'
            }}
          >
            <Typography variant="h2" sx={{ color: '#f5e6d3', fontWeight: 'bold' }}>
              myhalalbazar.de
            </Typography>
          </Box>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ fontStyle: 'italic', mb: 1 }}>
          Authentischer Marktplatz | Halal Speisen & Produkte für Deutschland
        </Typography>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Enterprise Resource Planning System
        </Typography>
      </Box>

      {/* Navigation Buttons */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': { 
                transform: 'translateY(-8px)', 
                boxShadow: 6,
                bgcolor: 'primary.light'
              }
            }}
            onClick={() => navigate('/suppliers')}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <StoreIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Supplier Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage suppliers and products
              </Typography>
              <Chip 
                label={`${suppliers.length} Suppliers`} 
                size="small" 
                color="primary" 
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': { 
                transform: 'translateY(-8px)', 
                boxShadow: 6,
                bgcolor: 'success.light'
              }
            }}
            onClick={() => navigate('/orders')}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <CartIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Order Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create and track orders
              </Typography>
              <Chip 
                label={`${activeOrders.length} Active`} 
                size="small" 
                color="success" 
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': { 
                transform: 'translateY(-8px)', 
                boxShadow: 6,
                bgcolor: 'warning.light'
              }
            }}
            onClick={() => navigate('/inventory')}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <InventoryIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Inventory Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track stock levels
              </Typography>
              <Chip 
                label={`${inventory.length} Items`} 
                size="small" 
                color="warning" 
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': { 
                transform: 'translateY(-8px)', 
                boxShadow: 6,
                bgcolor: 'info.light'
              }
            }}
            onClick={() => navigate('/calculator')}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <CalculateIcon sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Cost Calculator
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calculate biryani costs
              </Typography>
              <Chip 
                label="Classic Tool" 
                size="small" 
                color="info" 
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dashboard Section */}
      <Grid container spacing={3}>
        {/* Active Orders */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              <CartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Current Order Status
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {activeOrders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  No active orders. Create a new order to get started!
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<CartIcon />}
                  onClick={() => navigate('/orders')}
                  sx={{ mt: 2 }}
                >
                  Create Order
                </Button>
              </Box>
            ) : (
              <List>
                {activeOrders.map((order, index) => {
                  const missingItems = checkMissingItems(order);
                  const progress = getOrderProgress(order);

                  return (
                    <React.Fragment key={order.id}>
                      <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Box>
                            <Typography variant="h6">
                              {getOrderStatusIcon(order.status)}
                              <span style={{ marginLeft: 8 }}>{order.orderId}</span>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Customer: {order.customerName}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Chip 
                              label={order.status} 
                              color={getOrderStatusColor(order.status)}
                              size="small"
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {order.lineItems.length} items
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ width: '100%', mb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Progress
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {progress}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{ height: 8, borderRadius: 1 }}
                          />
                        </Box>

                        {missingItems.length > 0 && (
                          <Alert 
                            severity="warning" 
                            icon={<WarningIcon />} 
                            sx={{ width: '100%', mt: 1 }}
                          >
                            <Typography variant="caption" fontWeight="bold">
                              Low/Missing Items:
                            </Typography>
                            <Typography variant="caption" display="block">
                              {missingItems.join(', ')}
                            </Typography>
                          </Alert>
                        )}

                        <Box sx={{ width: '100%', mt: 1, display: 'flex', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Total: <strong>₹{order.sellingPrice?.toFixed(2) || '0.00'}</strong>
                          </Typography>
                          <Typography variant="body2" color="success.main">
                            Profit: <strong>₹{order.profitAmount?.toFixed(2) || '0.00'}</strong>
                          </Typography>
                        </Box>
                      </ListItem>
                      {index < activeOrders.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Missing Items Alert & Stats */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              <WarningIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'warning.main' }} />
              Inventory Alerts
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {lowStockItems.length === 0 && outOfStockItems.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <CheckIcon color="success" sx={{ fontSize: 40 }} />
                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                  All items are in stock!
                </Typography>
              </Box>
            ) : (
              <>
                {outOfStockItems.length > 0 && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Out of Stock ({outOfStockItems.length})
                    </Typography>
                    <List dense>
                      {outOfStockItems.map(item => (
                        <ListItem key={item.id} sx={{ py: 0 }}>
                          <ListItemText
                            primary={item.itemName}
                            primaryTypographyProps={{ variant: 'body2', color: 'error' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Alert>
                )}

                {lowStockItems.length > 0 && (
                  <Alert severity="warning">
                    <Typography variant="subtitle2" gutterBottom>
                      Low Stock ({lowStockItems.length})
                    </Typography>
                    <List dense>
                      {lowStockItems.slice(0, 5).map(item => (
                        <ListItem key={item.id} sx={{ py: 0 }}>
                          <ListItemText
                            primary={`${item.itemName}: ${item.quantity} ${item.unit}`}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                      {lowStockItems.length > 5 && (
                        <Typography variant="caption" color="text.secondary">
                          +{lowStockItems.length - 5} more items
                        </Typography>
                      )}
                    </List>
                  </Alert>
                )}

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/inventory')}
                  sx={{ mt: 2 }}
                >
                  View Full Inventory
                </Button>
              </>
            )}
          </Paper>

          {/* Quick Stats */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" color="primary">
                      {orders.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Orders
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" color="success.main">
                      {completedOrders.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Completed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" color="warning.main">
                      {inventory.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Inventory Items
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" color="info.main">
                      {suppliers.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Suppliers
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
