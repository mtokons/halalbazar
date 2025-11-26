import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import OrderForm from './components/OrderForm';
import OrderHistory from './components/OrderHistory';
import ResultDisplay from './components/ResultDisplay';
import SupplierManagement from './components/Suppliers/SupplierManagement';
import OrderManagement from './components/Orders/OrderManagement';
import InventoryManagement from './components/Inventory/InventoryManagement';
import HomePage from './components/Home/HomePage';

// Calculator Page Component
function CalculatorPage() {
  const [currentResult, setCurrentResult] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleCalculationComplete = (result) => {
    setCurrentResult(result);
    setRefreshHistory(prev => prev + 1);
  };

  const handleNewCalculation = () => {
    setCurrentResult(null);
  };

  return (
    <div className="main-content">
      <div className="left-section">
        <OrderForm 
          onCalculationComplete={handleCalculationComplete}
          onNewCalculation={handleNewCalculation}
        />
        {currentResult && (
          <ResultDisplay result={currentResult} />
        )}
      </div>

      <div className="right-section">
        <OrderHistory refresh={refreshHistory} />
      </div>
    </div>
  );
}

// Navigation Header Component
function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Don't show navigation on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header className="App-header">
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1>🍛 Halal Bazar</h1>
      </Link>
      <p>Business Management System</p>
      
      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <Link to="/" className="tab-button">
          🏠 Home
        </Link>
        <Link 
          to="/suppliers" 
          className={isActive('/suppliers') ? 'tab-button active' : 'tab-button'}
        >
          🏪 Suppliers
        </Link>
        <Link 
          to="/orders" 
          className={isActive('/orders') ? 'tab-button active' : 'tab-button'}
        >
          🛒 Orders
        </Link>
        <Link 
          to="/inventory" 
          className={isActive('/inventory') ? 'tab-button active' : 'tab-button'}
        >
          📦 Inventory
        </Link>
        <Link 
          to="/calculator" 
          className={isActive('/calculator') ? 'tab-button active' : 'tab-button'}
        >
          📊 Calculator
        </Link>
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/suppliers" element={<SupplierManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/calculator" element={<CalculatorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
