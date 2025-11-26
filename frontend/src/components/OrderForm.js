import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';
import './OrderForm.css';

function OrderForm({ onCalculationComplete, onNewCalculation }) {
  const [formData, setFormData] = useState({
    numberOfBiryani: '',
    ingredientCost: '',
    electricityBill: '',
    labourCost: '',
    profitMargin: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.numberOfBiryani || !formData.ingredientCost || 
        !formData.electricityBill || !formData.labourCost || 
        formData.profitMargin === '') {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.ORDERS, formData);
      onCalculationComplete(response.data.calculation);
      
      // Reset form
      setFormData({
        numberOfBiryani: '',
        ingredientCost: '',
        electricityBill: '',
        labourCost: '',
        profitMargin: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      numberOfBiryani: '',
      ingredientCost: '',
      electricityBill: '',
      labourCost: '',
      profitMargin: ''
    });
    setError('');
    onNewCalculation();
  };

  return (
    <div className="order-form-container">
      <h2>📝 New Order Calculation</h2>
      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label htmlFor="numberOfBiryani">
            Number of Biryani Packets
          </label>
          <input
            type="number"
            id="numberOfBiryani"
            name="numberOfBiryani"
            value={formData.numberOfBiryani}
            onChange={handleChange}
            placeholder="e.g., 100"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ingredientCost">
            Ingredient Cost (₹)
          </label>
          <input
            type="number"
            id="ingredientCost"
            name="ingredientCost"
            value={formData.ingredientCost}
            onChange={handleChange}
            placeholder="e.g., 5000"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="electricityBill">
            Electricity Bill (₹)
          </label>
          <input
            type="number"
            id="electricityBill"
            name="electricityBill"
            value={formData.electricityBill}
            onChange={handleChange}
            placeholder="e.g., 500"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="labourCost">
            Labour Cost (₹)
          </label>
          <input
            type="number"
            id="labourCost"
            name="labourCost"
            value={formData.labourCost}
            onChange={handleChange}
            placeholder="e.g., 2000"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="profitMargin">
            Profit Margin (%)
          </label>
          <input
            type="number"
            id="profitMargin"
            name="profitMargin"
            value={formData.profitMargin}
            onChange={handleChange}
            placeholder="e.g., 20"
            step="0.01"
            min="0"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Calculating...' : '🧮 Calculate'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            🔄 Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default OrderForm;
