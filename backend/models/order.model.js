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

const Order = {
  create: (orderData) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO orders (customer_id, total_price) VALUES (?, ?)',
        [orderData.customer_id, orderData.total_price],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  },

  createOrderItem: (itemData) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [itemData.order_id, itemData.product_id, itemData.quantity, itemData.unit_price],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  },

  updateProductQuantity: (productId, newQuantity) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE products SET aval_quantity = ? WHERE id = ?',
        [newQuantity, productId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  },

  findByCustomerId: (customerId) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT o.*, 
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', oi.id,
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price,
              'product_name', p.name
            )
          ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.customer_id = ?
        GROUP BY o.id
        ORDER BY o.order_date DESC`,
        [customerId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  },

  count: () => {
    return new Promise((resolve, reject) => {
      pool.query('SELECT COUNT(*) as count FROM orders', (err, results) => {
        if (err) reject(err);
        else resolve(results[0].count);
      });
    });
  },

  findRecent: (limit) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT o.*, u.username as customer_name 
         FROM orders o 
         JOIN users u ON o.customer_id = u.id 
         ORDER BY o.order_date DESC 
         LIMIT ?`,
        [limit]
      );
    });
  },

  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      pool.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }
};

module.exports = Order; 