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

const RawMaterial = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM raw_materials', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM raw_materials WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  create: (materialData) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO raw_materials (material_type, quantity, supplier_id) VALUES (?, ?, ?)',
        [materialData.material_type, materialData.quantity, materialData.supplier_id],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  },

  update: (id, materialData) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE raw_materials SET material_type = ?, quantity = ?, supplier_id = ? WHERE id = ?',
        [materialData.material_type, materialData.quantity, materialData.supplier_id, id],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM raw_materials WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
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
  }
};

module.exports = RawMaterial; 