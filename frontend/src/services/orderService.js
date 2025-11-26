import api from '../config/api';

// ==================== CUSTOMERS ====================
export const customerService = {
  getAll: async () => {
    const response = await api.get('/customers');
    return response.data;
  },
  
  create: async (customerData) => {
    const response = await api.post('/customers', {
      customerId: `CUST-${Date.now()}`,
      ...customerData,
    });
    return response.data;
  },
  
  delete: async (customerId) => {
    const response = await api.delete(`/customers/${customerId}`);
    return response.data;
  },
};

// ==================== SUPPLIERS ====================
export const supplierService = {
  getAll: async () => {
    const response = await api.get('/suppliers');
    return response.data;
  },
  
  create: async (supplierData) => {
    const response = await api.post('/suppliers', {
      supplierId: `SUPP-${Date.now()}`,
      ...supplierData,
    });
    return response.data;
  },
  
  update: async (supplierId, supplierData) => {
    const response = await api.put(`/suppliers/${supplierId}`, supplierData);
    return response.data;
  },
  
  delete: async (supplierId) => {
    const response = await api.delete(`/suppliers/${supplierId}`);
    return response.data;
  },
};

// ==================== MENU ITEMS ====================
export const menuService = {
  getAll: async () => {
    const response = await api.get('/menu-items');
    return response.data;
  },
  
  create: async (menuData) => {
    const response = await api.post('/menu-items', {
      menuId: `MENU-${Date.now()}`,
      ...menuData,
    });
    return response.data;
  },
  
  delete: async (menuId) => {
    const response = await api.delete(`/menu-items/${menuId}`);
    return response.data;
  },
};

// ==================== ORDERS ====================
export const orderService = {
  getAll: async () => {
    const response = await api.get('/orders-management');
    return response.data;
  },
  
  create: async (orderData) => {
    const response = await api.post('/orders-management', {
      orderId: `ORD-${Date.now()}`,
      ...orderData,
      placedAt: new Date(),
    });
    return response.data;
  },
  
  updateStatus: async (orderId, status) => {
    const response = await api.patch(`/orders-management/${orderId}/status`, {
      status,
    });
    return response.data;
  },
};

// ==================== INVENTORY ====================
export const inventoryService = {
  getAll: async () => {
    const response = await api.get('/inventory');
    return response.data;
  },
  
  create: async (inventoryData) => {
    const response = await api.post('/inventory', {
      inventoryId: `INV-${Date.now()}`,
      ...inventoryData,
    });
    return response.data;
  },
  
  update: async (inventoryId, inventoryData) => {
    const response = await api.put(`/inventory/${inventoryId}`, inventoryData);
    return response.data;
  },
  
  addTransaction: async (inventoryId, transaction) => {
    const response = await api.post(`/inventory/${inventoryId}/transaction`, transaction);
    return response.data;
  },
  
  delete: async (inventoryId) => {
    const response = await api.delete(`/inventory/${inventoryId}`);
    return response.data;
  },
};

// ==================== REPORTS ====================
export const reportService = {
  getSummary: async (startDate = null, endDate = null) => {
    let url = '/reports/summary';
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await api.get(url);
    return response.data;
  },
};

// ==================== BIRYANI CALCULATOR ====================
export const calculatorService = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  
  create: async (calculationData) => {
    const response = await api.post('/orders', calculationData);
    return response.data;
  },
  
  delete: async (orderId) => {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  },
};
