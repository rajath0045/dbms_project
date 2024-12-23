const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Supplier = require('../models/supplier.model');
const Customer = require('../models/customer.model');
const authConfig = require('../config/auth.config');

exports.register = async (req, res) => {
  const { 
    username, 
    password, 
    role, 
    // Supplier fields
    sname, 
    scontact, 
    company_name,
    // Customer fields
    phone,
    address 
  } = req.body;
  
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password, and role are required' });
  }

  if (!['supplier', 'customer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  // Validation for role-specific fields
  if (role === 'supplier' && (!sname || !scontact || !company_name)) {
    return res.status(400).json({ error: 'Supplier details are required' });
  }

  if (role === 'customer' && (!phone || !address)) {
    return res.status(400).json({ error: 'Customer details are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await User.create(username, hashedPassword, role);
    
    if (role === 'supplier') {
      await Supplier.create(userResult.insertId, {
        sname,
        scontact,
        company_name
      });
    } else if (role === 'customer') {
      await Customer.create(userResult.insertId, {
        phone,
        address
      });
    }

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username already exists' });
    }
    res.status(500).json({ 
      error: 'Error creating user',
      details: error.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get additional user info based on role
    let additionalInfo = {};
    if (user.role === 'supplier') {
      const supplier = await Supplier.findByUserId(user.id);
      additionalInfo.supplierId = supplier.sid;
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        ...additionalInfo  // This will include supplierId for suppliers
      },
      authConfig.secret,
      { expiresIn: authConfig.expiresIn }
    );

    res.json({
      token,
      role: user.role,
      supplierId: user.role === 'supplier' ? additionalInfo.supplierId : null
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error during login' });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role
      },
      authConfig.secret,
      { expiresIn: authConfig.expiresIn }
    );

    res.json({
      token,
      role: user.role
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Error during admin login' });
  }
}; 