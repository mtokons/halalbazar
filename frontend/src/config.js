// API Configuration
// For Firebase Cloud Functions, the API will be available at the same domain
// During development, use the Firebase emulator or deployed function URL
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/health`,
  ORDERS: `${API_BASE_URL}/api/orders`,
  ORDER_BY_ID: (id) => `${API_BASE_URL}/api/orders/${id}`
};

export default API_BASE_URL;
