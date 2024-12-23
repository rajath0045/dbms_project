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

const Supplier = {
  create: (userId, supplierData) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO suppliers (sname, scontact, company_name, user_id) VALUES (?, ?, ?, ?)',
        [supplierData.sname, supplierData.scontact, supplierData.company_name, userId],
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
        'SELECT * FROM suppliers WHERE user_id = ?',
        [userId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results[0]);
        }
      );
    });
  },

  count: () => {
    return new Promise((resolve, reject) => {
      pool.query('SELECT COUNT(*) as count FROM suppliers', (err, results) => {
        if (err) reject(err);
        else resolve(results[0].count);
      });
    });
  },

  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      pool.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM suppliers WHERE sid = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }
};

module.exports = Supplier; 