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

  getStatsBySupplier: (supplierId) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT 
          material_type,
          SUM(quantity) as total_quantity,
          COUNT(*) as entry_count,
          MAX(date_added) as last_entry
        FROM raw_materials
        WHERE supplier_id = ?
        GROUP BY material_type`,
        [supplierId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  },

  getAllBySupplier: (supplierId) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM raw_materials WHERE supplier_id = ? ORDER BY date_added DESC',
        [supplierId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
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

module.exports = RawMaterial; 