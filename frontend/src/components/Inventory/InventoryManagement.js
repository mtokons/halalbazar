import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Chip,
  Alert,
  InputAdornment,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { inventoryService } from '../../services/orderService';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Raw Material',
    quantity: 0,
    unit: 'kg',
    purchasePrice: 0,
    reorderLevel: 10,
    supplier: ''
  });

  const categories = ['All', 'Raw Material', 'Packaging', 'Spices', 'Dairy', 'Meat', 'Vegetables', 'Grains', 'Supplies'];
  const units = ['kg', 'liter', 'piece', 'pack', 'gram', 'box'];

  // Load inventory from API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await inventoryService.getAll();
        setInventory(data);
      } catch (error) {
        console.error('Error loading inventory:', error);
        setInventory([]);
      }
    };
    fetchInventory();
  }, []);

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData(item);
    } else {
      setEditItem(null);
      setFormData({
        itemName: '',
        category: 'Raw Material',
        quantity: 0,
        unit: 'kg',
        purchasePrice: 0,
        reorderLevel: 10,
        supplier: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditItem(null);
  };

  const handleSaveItem = async () => {
    if (!formData.itemName || formData.quantity < 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editItem) {
        // Update existing item
        const updated = await inventoryService.update(editItem.inventoryId || editItem.id, formData);
        setInventory(inventory.map(item =>
          (item.inventoryId || item.id) === (editItem.inventoryId || editItem.id) ? updated : item
        ));
      } else {
        // Add new item
        const newItem = await inventoryService.create(formData);
        setInventory([...inventory, newItem]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      alert('Failed to save inventory item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryService.delete(itemId);
        setInventory(inventory.filter(item => (item.inventoryId || item.id) !== itemId));
      } catch (error) {
        console.error('Error deleting inventory item:', error);
        alert('Failed to delete inventory item');
      }
    }
  };

  const handleAdjustStock = async (itemId, type) => {
    const amount = prompt(`Enter ${type === 'add' ? 'quantity to add' : 'quantity to remove'}:`);
    if (amount && !isNaN(amount)) {
      try {
        const transaction = {
          type: type === 'add' ? 'in' : 'out',
          quantity: Number(amount),
          reason: type === 'add' ? 'Stock added' : 'Stock removed'
        };
        
        const updated = await inventoryService.addTransaction(itemId, transaction);
        setInventory(inventory.map(item =>
          (item.inventoryId || item.id) === itemId ? updated : item
        ));
      } catch (error) {
        console.error('Error adjusting stock:', error);
        alert('Failed to adjust stock');
      }
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => item.quantity <= item.reorderLevel);
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.purchasePrice), 0);
  const outOfStockItems = inventory.filter(item => item.quantity === 0);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Inventory Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track raw materials, packaging, and supplies
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            size="large"
          >
            Add Item
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {inventory.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Items
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main">
                  €{totalValue.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Value
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: lowStockItems.length > 0 ? 'warning.light' : 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" color={lowStockItems.length > 0 ? 'warning.dark' : 'text.primary'}>
                  {lowStockItems.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Low Stock Items
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: outOfStockItems.length > 0 ? 'error.light' : 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" color={outOfStockItems.length > 0 ? 'error.dark' : 'text.primary'}>
                  {outOfStockItems.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Out of Stock
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Low Stock Alert - {lowStockItems.length} item(s) need reordering:
            </Typography>
            {lowStockItems.map(item => (
              <Typography key={item.id} variant="body2">
                • {item.itemName}: {item.quantity} {item.unit} (reorder at {item.reorderLevel} {item.unit})
              </Typography>
            ))}
          </Alert>
        )}

        {/* Search and Filter */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search by item name or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Filter by Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* Inventory Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>Item Name</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell align="right"><strong>Quantity</strong></TableCell>
                <TableCell align="right"><strong>Unit Price</strong></TableCell>
                <TableCell align="right"><strong>Total Value</strong></TableCell>
                <TableCell><strong>Supplier</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No items found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map((item) => {
                  const isLowStock = item.quantity <= item.reorderLevel;
                  const isOutOfStock = item.quantity === 0;
                  
                  return (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {item.itemName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={item.category} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          color={isOutOfStock ? 'error' : isLowStock ? 'warning.main' : 'text.primary'}
                          fontWeight={isLowStock ? 'bold' : 'normal'}
                        >
                          {item.quantity} {item.unit}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        €{item.purchasePrice.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          €{(item.quantity * item.purchasePrice).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {item.supplier || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {isOutOfStock ? (
                          <Chip label="Out of Stock" size="small" color="error" />
                        ) : isLowStock ? (
                          <Chip label="Low Stock" size="small" color="warning" />
                        ) : (
                          <Chip label="In Stock" size="small" color="success" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleAdjustStock(item.inventoryId || item.id, 'add')}
                          title="Add Stock"
                        >
                          <TrendingUpIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleAdjustStock(item.inventoryId || item.id, 'remove')}
                          title="Remove Stock"
                        >
                          <TrendingDownIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(item)}
                          title="Edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteItem(item.inventoryId || item.id)}
                          title="Delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Item Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Item Name"
                  value={formData.itemName}
                  onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.filter(c => c !== 'All').map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                >
                  {units.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Purchase Price"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({...formData, purchasePrice: Number(e.target.value)})}
                  inputProps={{ step: "0.01", min: "0" }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Reorder Level"
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({...formData, reorderLevel: Number(e.target.value)})}
                  helperText="Alert when stock reaches this level"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                />
              </Grid>
              {formData.quantity > 0 && formData.purchasePrice > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="subtitle2">
                      Total Value: €{(formData.quantity * formData.purchasePrice).toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveItem} variant="contained" color="primary">
              {editItem ? 'Update' : 'Add'} Item
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default InventoryManagement;
