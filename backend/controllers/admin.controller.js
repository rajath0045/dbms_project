const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Supplier = require('../models/supplier.model');
const RawMaterial = require('../models/raw_material.model');

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalSuppliers
    ] = await Promise.all([
      User.count(),
      Product.count(),
      Order.count(),
      Supplier.count()
    ]);

    const recentOrders = await Order.findRecent(5);
    const recentUsers = await User.findRecent(5);

    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalSuppliers
      },
      recentOrders,
      recentUsers
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({ error: 'Error fetching dashboard statistics' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let users;
    
    if (role) {
      users = await User.findByRole(role);
    } else {
      users = await User.findAll();
    }
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.delete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const query = `
      SELECT o.*, 
        u.username as customer_name,
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
      JOIN users u ON o.customer_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.order_date DESC`;

    const orders = await Order.query(query);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

exports.getAllSuppliers = async (req, res) => {
  try {
    const query = `
      SELECT s.*, u.username 
      FROM suppliers s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.sid DESC`;
      
    const suppliers = await Supplier.query(query);
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Error fetching suppliers' });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    await Supplier.delete(req.params.id);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Error deleting supplier' });
  }
};

exports.getAllRawMaterials = async (req, res) => {
  try {
    const query = `
      SELECT rm.*, s.company_name as supplier_name, u.username
      FROM raw_materials rm
      JOIN suppliers s ON rm.supplier_id = s.sid
      JOIN users u ON s.user_id = u.id
      ORDER BY rm.date_added DESC`;
      
    const materials = await RawMaterial.query(query);
    res.json(materials);
  } catch (error) {
    console.error('Error fetching raw materials:', error);
    res.status(500).json({ error: 'Error fetching raw materials' });
  }
}; 