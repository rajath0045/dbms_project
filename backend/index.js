const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createTables } = require('./models/init.db');

const app = express();
const PORT = process.env.PORT || 8000;

// Create database tables
createTables();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/raw-materials', require('./routes/rawMaterial.routes'));
// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
