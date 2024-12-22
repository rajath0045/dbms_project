const Order = require('../models/order.model');
const Product = require('../models/product.model');

exports.createOrder = async (req, res) => {
  console.log('Request user:', req.user); // Debug log
  console.log('Request body:', req.body); // Debug log
  
  const { items, total_price } = req.body;
  const customer_id = req.user?.id;

  console.log('Customer ID:', customer_id); // Debug log

  if (!customer_id) {
    console.log('No customer ID found in request'); // Debug log
    return res.status(400).json({ error: 'Customer ID is required' });
  }

  try {
    // Create the order first
    const orderResult = await Order.create({
      customer_id,
      total_price,
      status: 'pending'
    });

    console.log('Order created:', orderResult); // Debug log

    const order_id = orderResult.insertId;

    // Create order items and update product quantities
    for (const item of items) {
      // Get current product quantity
      const product = await Product.findById(item.product_id);
      if (!product) {
        throw new Error(`Product ${item.product_id} not found`);
      }

      if (product.aval_quantity < item.quantity) {
        throw new Error(`Insufficient quantity for product ${item.product_id}`);
      }

      // Create order item
      await Order.createOrderItem({
        order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      });

      // Update product quantity
      const newQuantity = product.aval_quantity - item.quantity;
      await Order.updateProductQuantity(item.product_id, newQuantity);
    }

    res.status(201).json({
      message: 'Order created successfully',
      order_id
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message || 'Error creating order' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findByCustomerId(req.user.id);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.customer_id !== req.user.id) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Error fetching order' });
  }
}; 