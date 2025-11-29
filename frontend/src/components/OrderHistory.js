import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';
import './OrderHistory.css';

function OrderHistory({ refresh }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [refresh]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.ORDERS);
      setOrders(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load order history');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await axios.delete(API_ENDPOINTS.ORDER_BY_ID(id));
      fetchOrders();
    } catch (err) {
      alert('Failed to delete order');
      console.error('Error deleting order:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="order-history-container">
        <h2>📜 Order History</h2>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <h2>📜 Order History</h2>
      
      {error && <div className="error-message">{error}</div>}

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders yet. Create your first calculation!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order #{order.id}</span>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(order.id)}
                  title="Delete order"
                >
                  🗑️
                </button>
              </div>
              
              <div className="order-date">
                {formatDate(order.created_at)}
              </div>

              <div className="order-details">
                <div className="detail-row">
                  <span>Biryani Packets:</span>
                  <strong>{order.number_of_biryani}</strong>
                </div>
                <div className="detail-row">
                  <span>Total Cost:</span>
                  <strong>₹{parseFloat(order.total_cost).toFixed(2)}</strong>
                </div>
                <div className="detail-row">
                  <span>Selling Price:</span>
                  <strong>₹{parseFloat(order.total_selling_price).toFixed(2)}</strong>
                </div>
                <div className={`detail-row ${parseFloat(order.profit_per_order) > 0 ? 'profit' : 'loss'}`}>
                  <span>
                    {parseFloat(order.profit_per_order) > 0 ? 'Profit:' : 'Loss:'}
                  </span>
                  <strong>€{parseFloat(order.profit_per_order).toFixed(2)}</strong>
                </div>
              </div>

              <div className="order-footer">
                <span className="margin-badge">
                  Margin: {parseFloat(order.profit_margin)}%
                </span>
                <span className="price-per-unit">
                  €{parseFloat(order.selling_price_per_biryani).toFixed(2)} per packet
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
