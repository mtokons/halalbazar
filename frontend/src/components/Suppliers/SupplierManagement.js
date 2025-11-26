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
import { supplierService } from '../../services/orderService';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);

  // Load suppliers from API on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await supplierService.getAll();
        setSuppliers(data);
      } catch (error) {
        console.error('Error loading suppliers:', error);
      }
    };
    fetchSuppliers();
  }, []);

  const handleOpenForm = () => {
    setEditSupplier(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditSupplier(null);
  };

  const handleSaveSupplier = async (supplierData) => {
    try {
      if (editSupplier) {
        // Update existing supplier
        const updated = await supplierService.update(supplierData.supplierId || supplierData.id, supplierData);
        setSuppliers(suppliers.map(s => (s.supplierId || s.id) === (updated.supplierId || updated.id) ? updated : s));
      } else {
        // Add new supplier
        const newSupplier = await supplierService.create(supplierData);
        setSuppliers([...suppliers, newSupplier]);
      }
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Failed to save supplier');
      throw error;
    }
  };

  const handleEditSupplier = (supplier) => {
    setEditSupplier(supplier);
    setOpenForm(true);
  };

  const handleDeleteSupplier = async (supplierId) => {
    try {
      await supplierService.delete(supplierId);
      setSuppliers(suppliers.filter(s => (s.supplierId || s.id) !== supplierId));
    } catch (error) {
      console.error('Error deleting supplier:', error);
      alert('Failed to delete supplier');
    }
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
