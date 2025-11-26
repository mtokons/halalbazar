import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const SupplierList = ({ suppliers, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const allCategories = ['All', ...new Set(
    suppliers.flatMap(supplier => supplier.productCategories)
  )];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = 
      supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm);

    const matchesCategory = 
      categoryFilter === 'All' || 
      supplier.productCategories.includes(categoryFilter);

    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      {/* Search and Filter */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Search by name, contact person, or phone..."
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
            {allCategories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Results Count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredSuppliers.length} of {suppliers.length} suppliers
      </Typography>

      {/* Suppliers List */}
      {filteredSuppliers.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No suppliers found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || categoryFilter !== 'All' 
              ? 'Try adjusting your search or filters' 
              : 'Add your first supplier to get started'}
          </Typography>
        </Box>
      ) : (
        filteredSuppliers.map((supplier) => (
          <Card key={supplier.supplierId || supplier.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {supplier.supplierName}
                  </Typography>
                  {supplier.contactPerson && (
                    <Typography variant="body2" color="text.secondary">
                      Contact: {supplier.contactPerson}
                    </Typography>
                  )}
                </Box>
                <Box>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => window.location.href = `/suppliers/${supplier.supplierId || supplier.id}`}
                    sx={{ mr: 1 }}
                  >
                    View Profile
                  </Button>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEdit(supplier)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${supplier.supplierName}?`)) {
                        onDelete(supplier.supplierId || supplier.id);
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Contact Information */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">{supplier.phone}</Typography>
                  </Box>
                </Grid>
                {supplier.email && (
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">{supplier.email}</Typography>
                    </Box>
                  </Grid>
                )}
                {supplier.address && (
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" noWrap>{supplier.address}</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* Categories */}
              {supplier.productCategories.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Categories:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {supplier.productCategories.map((category) => (
                      <Chip key={category} label={category} size="small" color="primary" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Payment Terms */}
              {supplier.paymentTerms && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Payment Terms: 
                  </Typography>
                  <Chip label={supplier.paymentTerms} size="small" sx={{ ml: 1 }} />
                </Box>
              )}

              {/* Products Accordion */}
              {supplier.products && supplier.products.length > 0 && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">
                      Products ({supplier.products.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product Name</TableCell>
                          <TableCell align="right">Base Price</TableCell>
                          <TableCell align="right">With Delivery</TableCell>
                          <TableCell align="right">Without Delivery</TableCell>
                          <TableCell align="right">With Packaging</TableCell>
                          <TableCell align="right">Without Packaging</TableCell>
                          <TableCell align="right">B2B</TableCell>
                          <TableCell align="right">MRP</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {supplier.products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {product.productName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Unit: {product.unit}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="bold" color="primary">
                                ₹{product.basePrice}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              {product.deliveryPrice ? `₹${product.deliveryPrice}` : '-'}
                            </TableCell>
                            <TableCell align="right">
                              {product.withoutDeliveryPrice ? `₹${product.withoutDeliveryPrice}` : '-'}
                            </TableCell>
                            <TableCell align="right">
                              {product.packagingPrice ? `₹${product.packagingPrice}` : '-'}
                            </TableCell>
                            <TableCell align="right">
                              {product.withoutPackagingPrice ? `₹${product.withoutPackagingPrice}` : '-'}
                            </TableCell>
                            <TableCell align="right">
                              {product.b2bPrice ? `₹${product.b2bPrice}` : '-'}
                            </TableCell>
                            <TableCell align="right">
                              {product.mrp ? `₹${product.mrp}` : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionDetails>
                </Accordion>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default SupplierList;
