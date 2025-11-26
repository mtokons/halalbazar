import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Payment as PaymentIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { supplierService } from '../../services/orderService';
import api from '../../config/api';

const SupplierProfile = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openHistory, setOpenHistory] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    transactionType: 'purchase',
    productName: '',
    quantity: '',
    unitPrice: '',
    paymentStatus: 'pending',
    notes: ''
  });

  useEffect(() => {
    fetchSupplierData();
    fetchHistory();
  }, [supplierId]);

  const fetchSupplierData = async () => {
    try {
      const suppliers = await supplierService.getAll();
      const found = suppliers.find(s => (s.supplierId || s.id) === supplierId);
      setSupplier(found);
    } catch (error) {
      console.error('Error loading supplier:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get(`/supplier-history/${supplierId}`);
      setHistory(response.data);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleAddTransaction = async () => {
    try {
      const transaction = {
        ...newTransaction,
        supplierId,
        totalAmount: parseFloat(newTransaction.quantity) * parseFloat(newTransaction.unitPrice)
      };
      await api.post('/supplier-history', transaction);
      fetchHistory();
      setOpenHistory(false);
      setNewTransaction({
        transactionType: 'purchase',
        productName: '',
        quantity: '',
        unitPrice: '',
        paymentStatus: 'pending',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction');
    }
  };

  const calculateTotals = () => {
    const totalPurchases = history
      .filter(h => h.transactionType === 'purchase')
      .reduce((sum, h) => sum + h.totalAmount, 0);
    
    const totalPaid = history
      .filter(h => h.transactionType === 'payment')
      .reduce((sum, h) => sum + h.totalAmount, 0);
    
    const outstanding = totalPurchases - totalPaid;
    
    return { totalPurchases, totalPaid, outstanding };
  };

  if (loading) {
    return <Container><Typography>Loading...</Typography></Container>;
  }

  if (!supplier) {
    return (
      <Container>
        <Typography>Supplier not found</Typography>
        <Button onClick={() => navigate('/suppliers')}>Back to Suppliers</Button>
      </Container>
    );
  }

  const totals = calculateTotals();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/suppliers')}>
              <BackIcon />
            </IconButton>
            <Typography variant="h4">{supplier.supplierName}</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/suppliers/edit/${supplierId}`)}
          >
            Edit Supplier
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Supplier Details */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                {supplier.contactPerson && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography>Contact: {supplier.contactPerson}</Typography>
                  </Box>
                )}
                {supplier.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography>{supplier.phone}</Typography>
                  </Box>
                )}
                {supplier.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography>{supplier.email}</Typography>
                  </Box>
                )}
                {supplier.address && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography>{supplier.address}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Business Details</Typography>
                {supplier.productCategories && supplier.productCategories.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Categories:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {supplier.productCategories.map((cat, index) => (
                        <Chip key={index} label={cat} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}
                {supplier.paymentTerms && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaymentIcon fontSize="small" color="action" />
                    <Typography>Payment Terms: {supplier.paymentTerms}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Financial Summary */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Financial Summary</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Total Purchases</Typography>
                    <Typography variant="h6" color="primary">€{totals.totalPurchases.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Total Paid</Typography>
                    <Typography variant="h6" color="success.main">€{totals.totalPaid.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Outstanding</Typography>
                    <Typography variant="h6" color={totals.outstanding > 0 ? "error.main" : "success.main"}>
                      €{totals.outstanding.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Products */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Products ({supplier.products?.length || 0})</Typography>
                {supplier.products && supplier.products.length > 0 ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Base Price</TableCell>
                        <TableCell>Delivery Price</TableCell>
                        <TableCell>B2B Price</TableCell>
                        <TableCell>MRP</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {supplier.products.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.productName}</TableCell>
                          <TableCell>€{product.basePrice?.toFixed(2)}</TableCell>
                          <TableCell>€{product.deliveryPrice?.toFixed(2)}</TableCell>
                          <TableCell>€{product.b2bPrice?.toFixed(2)}</TableCell>
                          <TableCell>€{product.mrp?.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography color="text.secondary">No products added yet</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Transaction History */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Transaction History</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenHistory(true)}
                  >
                    Add Transaction
                  </Button>
                </Box>
                {history.length > 0 ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Amount (€)</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {history.map((transaction) => (
                        <TableRow key={transaction._id}>
                          <TableCell>
                            {new Date(transaction.transactionDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={transaction.transactionType}
                              size="small"
                              color={transaction.transactionType === 'purchase' ? 'primary' : 'success'}
                            />
                          </TableCell>
                          <TableCell>{transaction.productName || '-'}</TableCell>
                          <TableCell align="right">{transaction.quantity || '-'}</TableCell>
                          <TableCell align="right">€{transaction.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip
                              label={transaction.paymentStatus}
                              size="small"
                              color={
                                transaction.paymentStatus === 'paid' ? 'success' :
                                transaction.paymentStatus === 'pending' ? 'warning' :
                                transaction.paymentStatus === 'overdue' ? 'error' : 'default'
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography color="text.secondary">No transactions yet</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Add Transaction Dialog */}
      <Dialog open={openHistory} onClose={() => setOpenHistory(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Transaction Type"
                value={newTransaction.transactionType}
                onChange={(e) => setNewTransaction({...newTransaction, transactionType: e.target.value})}
              >
                <MenuItem value="purchase">Purchase</MenuItem>
                <MenuItem value="payment">Payment</MenuItem>
                <MenuItem value="return">Return</MenuItem>
                <MenuItem value="adjustment">Adjustment</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                value={newTransaction.productName}
                onChange={(e) => setNewTransaction({...newTransaction, productName: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={newTransaction.quantity}
                onChange={(e) => setNewTransaction({...newTransaction, quantity: e.target.value})}
                inputProps={{ step: "0.01" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Unit Price (€)"
                type="number"
                value={newTransaction.unitPrice}
                onChange={(e) => setNewTransaction({...newTransaction, unitPrice: e.target.value})}
                inputProps={{ step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Payment Status"
                value={newTransaction.paymentStatus}
                onChange={(e) => setNewTransaction({...newTransaction, paymentStatus: e.target.value})}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="partial">Partial</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={newTransaction.notes}
                onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistory(false)}>Cancel</Button>
          <Button onClick={handleAddTransaction} variant="contained">Add Transaction</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SupplierProfile;
