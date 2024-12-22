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

const Product = {
  create: (productData) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO products (name, category, aval_quantity, unit_price, material) VALUES (?, ?, ?, ?, ?)',
        [
          productData.name,
          productData.category,
          productData.aval_quantity,
          productData.unit_price,
          productData.material
        ],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  },

  findAll: () => {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM products', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM products WHERE id = ?',
        [id],
        (err, results) => {
          if (err) reject(err);
          else resolve(results[0]);
        }
      );
    });
  },

  update: (id, productData) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE products SET name = ?, category = ?, aval_quantity = ?, unit_price = ?, material = ? WHERE id = ?',
        [
          productData.name,
          productData.category,
          productData.aval_quantity,
          productData.unit_price,
          productData.material,
          id
        ],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'DELETE FROM products WHERE id = ?',
        [id],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  }
};

module.exports = Product; 