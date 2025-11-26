import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { reportService } from '../../services/orderService';

const Reporting = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchReportData();
  }, []);
  
  const fetchReportData = async () => {
    try {
      setLoading(true);
      const data = await reportService.getSummary();
      setReportData(data);
    } catch (error) {
      console.error('Error loading report data:', error);
      setReportData({ orders: [], totalOrders: 0, totalSales: 0, totalCost: 0, totalProfit: 0, averageOrderValue: 0, profitMargin: 0, statusBreakdown: {} });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!reportData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>No report data available</Typography>
      </Container>
    );
  }

  // Filter orders by period
  const getFilteredOrders = () => {
    let filtered = [...(reportData.orders || [])];
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }
    
    // Filter by period
    const now = new Date();
    if (filterPeriod !== 'all') {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate);
        switch (filterPeriod) {
          case 'today':
            return orderDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            return orderDate.getMonth() === now.getMonth() && 
                   orderDate.getFullYear() === now.getFullYear();
          case 'year':
            return orderDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }
    
    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  // Calculate statistics from filtered data
  const calculateStats = () => {
    const totalSales = filteredOrders.reduce((sum, order) => sum + order.totalSellPrice, 0);
    const totalCost = filteredOrders.reduce((sum, order) => sum + order.totalSellPrice - order.profit, 0);
    const totalProfit = filteredOrders.reduce((sum, order) => sum + order.profit, 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const profitMargin = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    // Status breakdown
    const statusBreakdown = {
      Pending: filteredOrders.filter(o => o.status === 'Pending').length,
      Processing: filteredOrders.filter(o => o.status === 'Processing').length,
      Ready: filteredOrders.filter(o => o.status === 'Ready').length,
      'In Delivery': filteredOrders.filter(o => o.status === 'In Delivery').length,
      Delivered: filteredOrders.filter(o => o.status === 'Delivered').length,
      Completed: filteredOrders.filter(o => o.status === 'Completed').length,
      Cancelled: filteredOrders.filter(o => o.status === 'Cancelled').length
    };

    // Profit/Loss breakdown
    const profitableOrders = filteredOrders.filter(o => o.profit >= 0).length;
    const lossOrders = filteredOrders.filter(o => o.profit < 0).length;

    // Top customers
    const customerStats = {};
    filteredOrders.forEach(order => {
      if (!customerStats[order.customerId]) {
        customerStats[order.customerId] = {
          name: order.customerName,
          orders: 0,
          totalSpent: 0,
          totalProfit: 0
        };
      }
      customerStats[order.customerId].orders++;
      customerStats[order.customerId].totalSpent += order.totalSellPrice;
      customerStats[order.customerId].totalProfit += order.profit;
    });

    const topCustomers = Object.values(customerStats)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    return {
      totalSales,
      totalCost,
      totalProfit,
      totalOrders,
      averageOrderValue,
      profitMargin,
      statusBreakdown,
      profitableOrders,
      lossOrders,
      topCustomers
    };
  };

  const stats = calculateStats();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'warning';
      case 'Processing': return 'info';
      case 'Delivered': return 'success';
      case 'Finished': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssessmentIcon /> Sales Reporting & Analytics
          </Typography>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Time Period</InputLabel>
              <Select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">Last 7 Days</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Order Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Finished">Finished</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'success.lighter' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <MoneyIcon color="success" />
                  <Typography variant="body2" color="text.secondary">Total Sales</Typography>
                </Box>
                <Typography variant="h4" color="success.main">
                  €{stats.totalSales.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  From {stats.totalOrders} orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: stats.totalProfit >= 0 ? 'success.lighter' : 'error.lighter' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {stats.totalProfit >= 0 ? (
                    <TrendingUpIcon color="success" />
                  ) : (
                    <TrendingDownIcon color="error" />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Total {stats.totalProfit >= 0 ? 'Profit' : 'Loss'}
                  </Typography>
                </Box>
                <Typography variant="h4" color={stats.totalProfit >= 0 ? 'success.main' : 'error.main'}>
                  €{Math.abs(stats.totalProfit).toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Margin: {stats.profitMargin.toFixed(2)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'info.lighter' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CartIcon color="info" />
                  <Typography variant="body2" color="text.secondary">Total Orders</Typography>
                </Box>
                <Typography variant="h4" color="info.main">
                  {stats.totalOrders}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg: €{stats.averageOrderValue.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'warning.lighter' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <MoneyIcon color="warning" />
                  <Typography variant="body2" color="text.secondary">Total Cost</Typography>
                </Box>
                <Typography variant="h4" color="warning.main">
                  €{stats.totalCost.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Operating expenses
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Status Breakdown */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Order Status Breakdown</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">🟡 Open:</Typography>
                      <Chip label={stats.statusBreakdown.Open} size="small" color="warning" />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">🔵 Processing:</Typography>
                      <Chip label={stats.statusBreakdown.Processing} size="small" color="info" />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">🟢 Delivered:</Typography>
                      <Chip label={stats.statusBreakdown.Delivered} size="small" color="success" />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">✅ Finished:</Typography>
                      <Chip label={stats.statusBreakdown.Finished} size="small" color="success" />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">🔴 Cancelled:</Typography>
                      <Chip label={stats.statusBreakdown.Cancelled} size="small" color="error" />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Profit/Loss Analysis</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
                      <Typography variant="h3" color="success.main">{stats.profitableOrders}</Typography>
                      <Typography variant="body2" color="text.secondary">Profitable Orders</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.lighter', borderRadius: 1 }}>
                      <Typography variant="h3" color="error.main">{stats.lossOrders}</Typography>
                      <Typography variant="body2" color="text.secondary">Loss Orders</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Top Customers */}
        {stats.topCustomers.length > 0 && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top 5 Customers</Typography>
              <Divider sx={{ mb: 2 }} />
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Name</TableCell>
                    <TableCell align="right">Orders</TableCell>
                    <TableCell align="right">Total Spent (€)</TableCell>
                    <TableCell align="right">Profit Generated (€)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.topCustomers.map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell align="right">
                        <Chip label={customer.orders} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="success.main" fontWeight="bold">
                          €{customer.totalSpent.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          color={customer.totalProfit >= 0 ? 'success.main' : 'error.main'}
                          fontWeight="bold"
                        >
                          €{customer.totalProfit.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Detailed Orders Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Order Details ({filteredOrders.length})</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ overflow: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Items</TableCell>
                    <TableCell align="right">Sales (€)</TableCell>
                    <TableCell align="right">Cost (€)</TableCell>
                    <TableCell align="right">Profit/Loss (€)</TableCell>
                    <TableCell align="right">Margin %</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No orders found for the selected filters
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{new Date(order.placedAt).toLocaleDateString()}</TableCell>
                        <TableCell align="right">{order.lineItems.length}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="success.main" fontWeight="bold">
                            €{order.totalSellPrice.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">€{order.totalCost.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            color={order.profit >= 0 ? 'success.main' : 'error.main'}
                            fontWeight="bold"
                          >
                            €{order.profit.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={`${order.profitMargin.toFixed(1)}%`}
                            size="small"
                            color={order.profitMargin >= 20 ? 'success' : order.profitMargin >= 10 ? 'warning' : 'error'}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={order.status} 
                            size="small" 
                            color={getStatusColor(order.status)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </Container>
  );
};

export default Reporting;
