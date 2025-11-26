import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import SupplierForm from './SupplierForm';
import SupplierList from './SupplierList';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);

  // Load suppliers from localStorage on component mount
  useEffect(() => {
    const savedSuppliers = localStorage.getItem('suppliers');
    if (savedSuppliers) {
      setSuppliers(JSON.parse(savedSuppliers));
    }
  }, []);

  // Save suppliers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  const handleOpenForm = () => {
    setEditSupplier(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditSupplier(null);
  };

  const handleSaveSupplier = (supplierData) => {
    if (editSupplier) {
      // Update existing supplier
      setSuppliers(suppliers.map(s => s.id === supplierData.id ? supplierData : s));
    } else {
      // Add new supplier
      setSuppliers([...suppliers, supplierData]);
    }
  };

  const handleEditSupplier = (supplier) => {
    setEditSupplier(supplier);
    setOpenForm(true);
  };

  const handleDeleteSupplier = (supplierId) => {
    setSuppliers(suppliers.filter(s => s.id !== supplierId));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Supplier Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your suppliers and their product pricing
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
            size="large"
          >
            Add Supplier
          </Button>
        </Box>

        {/* Supplier List */}
        <SupplierList
          suppliers={suppliers}
          onEdit={handleEditSupplier}
          onDelete={handleDeleteSupplier}
        />

        {/* Supplier Form Dialog */}
        <SupplierForm
          open={openForm}
          onClose={handleCloseForm}
          onSave={handleSaveSupplier}
          editSupplier={editSupplier}
        />
      </Paper>
    </Container>
  );
};

export default SupplierManagement;
