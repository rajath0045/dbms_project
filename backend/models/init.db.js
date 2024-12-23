const mysql = require('mysql2');
const dbConfig = require('../config/db.config');

const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Example table creation
const createTables = () => {
  // Create users table first
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('customer', 'supplier', 'admin') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create customers table with foreign key
  const createCustomersTable = `
    CREATE TABLE IF NOT EXISTS customers (
      cid INT PRIMARY KEY AUTO_INCREMENT,
      phone VARCHAR(20) NOT NULL,
      address TEXT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  // Create suppliers table with foreign key
  const createSuppliersTable = `
    CREATE TABLE IF NOT EXISTS suppliers (
      sid INT PRIMARY KEY AUTO_INCREMENT,
      sname VARCHAR(255) NOT NULL,
      scontact VARCHAR(20) NOT NULL,
      company_name VARCHAR(255) NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  // Create products table
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      category ENUM('male', 'female') NOT NULL,
      aval_quantity INT NOT NULL DEFAULT 0,
      unit_price DECIMAL(10, 2) NOT NULL,
      material VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Add this to your createTables function
  const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      customer_id INT NOT NULL,
      order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      total_price DECIMAL(10, 2) NOT NULL,
      status ENUM('pending', 'confirmed', 'delivered') DEFAULT 'pending',
      FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  const createOrderItemsTable = `
    CREATE TABLE IF NOT EXISTS order_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      unit_price DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
    )
  `;

  const createRawMaterialsTable = `
    CREATE TABLE IF NOT EXISTS raw_materials (
      id INT PRIMARY KEY AUTO_INCREMENT,
      material_type ENUM('cotton', 'wool', 'silk', 'linen', 'polyester', 'nylon', 'rayon', 'acrylic', 'bamboo', 'jute', 'hemp', 'ramie', 'polypropylene') NOT NULL,
      quantity DECIMAL(10,2) NOT NULL,
      supplier_id INT NOT NULL,
      date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (supplier_id) REFERENCES suppliers(sid) ON DELETE CASCADE
    )
  `;

  pool.query(createUsersTable, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
      return;
    }
    console.log('Users table created successfully');

    // Create customers table after users table
    pool.query(createCustomersTable, (err) => {
      if (err) {
        console.error('Error creating customers table:', err);
        return;
      }
      console.log('Customers table created successfully');

      // Create suppliers table after customers table
      pool.query(createSuppliersTable, (err) => {
        if (err) {
          console.error('Error creating suppliers table:', err);
          return;
        }
        console.log('Suppliers table created successfully');

        // Create raw materials table after suppliers table
        pool.query(createRawMaterialsTable, (err) => {
          if (err) {
            console.error('Error creating raw_materials table:', err);
            return;
          }
          console.log('Raw materials table created successfully');
        });
      });
    });
  });

  // Create other tables that don't have dependencies
  pool.query(createProductsTable, (err) => {
    if (err) {
      console.error('Error creating products table:', err);
      return;
    }
    console.log('Products table created successfully');
  });

  pool.query(createOrdersTable, (err) => {
    if (err) {
      console.error('Error creating orders table:', err);
      return;
    }
    console.log('Orders table created successfully');

    pool.query(createOrderItemsTable, (err) => {
      if (err) {
        console.error('Error creating order_items table:', err);
        return;
      }
      console.log('Order items table created successfully');
    });
  });
};

module.exports = { createTables }; 