import React from 'react';
import './ResultDisplay.css';

function ResultDisplay({ result }) {
  const isProfitable = parseFloat(result.profitPerOrder) > 0;

  return (
    <div className="result-display-container">
      <h2>📊 Calculation Results</h2>
      
      <div className="result-grid">
        <div className="result-card">
          <div className="result-label">Total Cost</div>
          <div className="result-value">₹{result.totalCost}</div>
        </div>

        <div className="result-card">
          <div className="result-label">Cost per Biryani</div>
          <div className="result-value">₹{result.costPerBiryani}</div>
        </div>

        <div className="result-card highlight">
          <div className="result-label">Selling Price per Biryani</div>
          <div className="result-value">₹{result.sellingPricePerBiryani}</div>
        </div>

        <div className="result-card highlight">
          <div className="result-label">Total Selling Price</div>
          <div className="result-value">₹{result.totalSellingPrice}</div>
        </div>

        <div className={`result-card profit-card ${isProfitable ? 'profit' : 'loss'}`}>
          <div className="result-label">
            {isProfitable ? '💰 Profit per Order' : '⚠️ Loss per Order'}
          </div>
          <div className="result-value profit-value">
            ₹{result.profitPerOrder}
          </div>
        </div>
      </div>

      <div className="summary-section">
        <h3>Order Summary</h3>
        <div className="summary-details">
          <div className="summary-row">
            <span>Number of Biryani Packets:</span>
            <strong>{result.numberOfBiryani}</strong>
          </div>
          <div className="summary-row">
            <span>Ingredient Cost:</span>
            <strong>₹{result.ingredientCost}</strong>
          </div>
          <div className="summary-row">
            <span>Electricity Bill:</span>
            <strong>₹{result.electricityBill}</strong>
          </div>
          <div className="summary-row">
            <span>Labour Cost:</span>
            <strong>₹{result.labourCost}</strong>
          </div>
          <div className="summary-row">
            <span>Profit Margin:</span>
            <strong>{result.profitMargin}%</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultDisplay;
