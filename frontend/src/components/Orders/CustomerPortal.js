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
  Rating
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  ShoppingCart as CartIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { customerService } from '../../services/orderService';
import api from '../../config/api';

const CustomerPortal = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
    fetchOrderHistory();
  }, [customerId]);

  const fetchCustomerData = async () => {
    try {
      const customers = await customerService.getAll();
      const found = customers.find(c => (c.customerId || c.id) === customerId);
      setCustomer(found);
    } catch (error) {
      console.error('Error loading customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await api.get(`/customer-history/${customerId}`);
      setOrderHistory(response.data);
    } catch (error) {
      console.error('Error loading order history:', error);
    }
  };

  const calculateStats = () => {
    const totalOrders = orderHistory.length;
    const totalSpent = orderHistory.reduce((sum, order) => sum + order.totalAmount, 0);
    const completedOrders = orderHistory.filter(o => o.status === 'Completed').length;
    const pendingOrders = orderHistory.filter(o => ['Pending', 'Processing', 'Ready', 'In Delivery'].includes(o.status)).length;
    
    return { totalOrders, totalSpent, completedOrders, pendingOrders };
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'warning',
      'Processing': 'info',
      'Ready': 'primary',
      'In Delivery': 'info',
      'Delivered': 'success',
      'Completed': 'success',
      'Cancelled': 'error'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return <Container><Typography>Loading...</Typography></Container>;
  }

  if (!customer) {
    return (
      <Container>
        <Typography>Customer not found</Typography>
        <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
      </Container>
    );
  }

  const stats = calculateStats();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/orders')}>
              <BackIcon />
            </IconButton>
            <Typography variant="h4">{customer.name}</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<CartIcon />}
            onClick={() => navigate('/orders')}
          >
            New Order
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Customer Details */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PhoneIcon fontSize="small" color="action" />
                  <Typography>{customer.phone}</Typography>
                </Box>
                {customer.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography>{customer.email}</Typography>
                  </Box>
                )}
                {customer.address && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography>{customer.address}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Customer Since</Typography>
                <Typography variant="h5" color="primary">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Member for {Math.floor((new Date() - new Date(customer.createdAt)) / (1000 * 60 * 60 * 24))} days
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Statistics */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Order Statistics</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">Total Orders</Typography>
                    <Typography variant="h5" color="primary">{stats.totalOrders}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">Total Spent</Typography>
                    <Typography variant="h5" color="success.main">€{stats.totalSpent.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">Completed Orders</Typography>
                    <Typography variant="h5">{stats.completedOrders}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">Active Orders</Typography>
                    <Typography variant="h5" color="warning.main">{stats.pendingOrders}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Order History */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Order History</Typography>
                {orderHistory.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Amount (€)</TableCell>
                        <TableCell>Payment</TableCell>
                        <TableCell>Delivery Date</TableCell>
                        <TableCell>Rating</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderHistory.map((order) => (
                        <TableRow key={order._id} hover>
                          <TableCell>{order.orderId}</TableCell>
                          <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              size="small"
                              color={getStatusColor(order.status)}
                            />
                          </TableCell>
                          <TableCell align="right">€{order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.paymentStatus}
                              size="small"
                              color={
                                order.paymentStatus === 'paid' ? 'success' :
                                order.paymentStatus === 'partial' ? 'warning' :
                                order.paymentStatus === 'refunded' ? 'info' : 'error'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell>
                            {order.rating ? (
                              <Rating value={order.rating} size="small" readOnly />
                            ) : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography color="text.secondary">No orders yet</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CustomerPortal;
