-- Create database
CREATE DATABASE IF NOT EXISTS halalbazar_db;

USE halalbazar_db;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  number_of_biryani INT NOT NULL,
  ingredient_cost DECIMAL(10, 2) NOT NULL,
  electricity_bill DECIMAL(10, 2) NOT NULL,
  labour_cost DECIMAL(10, 2) NOT NULL,
  profit_margin DECIMAL(5, 2) NOT NULL,
  total_cost DECIMAL(10, 2) NOT NULL,
  cost_per_biryani DECIMAL(10, 2) NOT NULL,
  selling_price_per_biryani DECIMAL(10, 2) NOT NULL,
  total_selling_price DECIMAL(10, 2) NOT NULL,
  profit_per_order DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
