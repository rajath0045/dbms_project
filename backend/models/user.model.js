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

// Initialize users table with role
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('supplier', 'customer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Error creating users table:', err);
  }
});

const User = {
  create: (username, hashedPassword, role) => {
    return new Promise((resolve, reject) => {
      console.log('Creating user with:', { username, role });
      pool.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, hashedPassword, role],
        (err, results) => {
          if (err) {
            console.error('Error in user creation:', err.message, err.code);
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  },

  findByUsername: (username) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, results) => {
          if (err) reject(err);
          else resolve(results[0]);
        }
      );
    });
  },

  count: () => {
    return new Promise((resolve, reject) => {
      pool.query('SELECT COUNT(*) as count FROM users', (err, results) => {
        if (err) reject(err);
        else resolve(results[0].count);
      });
    });
  },

  findRecent: (limit) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT id, username, role, created_at FROM users ORDER BY created_at DESC LIMIT ?',
        [limit],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  },

  findByRole: (role) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT u.*, c.phone, c.address FROM users u LEFT JOIN customers c ON u.id = c.user_id WHERE u.role = ?',
        [role],
        (err, results) => {
          if (err) {
            console.error('Error finding users by role:', err);
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  },
};

module.exports = User; 