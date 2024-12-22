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

const Customer = {
  create: (userId, customerData) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO customers (phone, address, user_id) VALUES (?, ?, ?)',
        [customerData.phone, customerData.address, userId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  },

  findByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM customers WHERE user_id = ?',
        [userId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results[0]);
        }
      );
    });
  }
};

module.exports = Customer; 